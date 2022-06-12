import { Inject, Injectable, Logger } from '@nestjs/common';
import { LOCK_ACQUIRED as success, LOCK_ALREADY_EXISTS as alreadyExists, LOCK_RETRY_COULD_NOT_ACQUIRE as failed, LOCKR_CONSTANTS as Lockr } from '../constants';
import { LockPreferences, UnlockPreferences } from '../interfaces/preferences';
import { LockrOptions } from '../interfaces/module';
import { LockStatus } from '../types';
import { LockrUtils, RedisUtils } from '../utils';
import { PreferenceService } from './preference.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LockrService {
	protected readonly uuid = uuidv4();
	private readonly logger = new Logger(LockrService.name);

	constructor(@Inject(Lockr.providerName) private readonly options: LockrOptions, private readonly preferenceService: PreferenceService) {}

	public async lock(name: string, preferences: Partial<LockPreferences> = {}): Promise<LockStatus> {
		const lockPreferences = this.preferenceService.buildLockPreferences(preferences, this.options);
		const status = await this.lockInternal(name, lockPreferences);
		this.logger.log(`
				> Lock status: ${status.acquired ? 'Acquired' : 'Failed'}
					> Name: ${status.lockName}
					> Duration: ${lockPreferences.atMost} ${lockPreferences.timeUnit}
					> Message: ${status.message}
		`);
		return status;
	}

	public async unlock(name: string, preferences: Partial<UnlockPreferences> = { unlockAfterExpiration: false }): Promise<void> {
		let lockName = LockrUtils.prefixName(name, this.options.namePrefix);
		let unlockAfterExpiration = preferences.unlockAfterExpiration ?? false;

		if (unlockAfterExpiration) {
			this.logger.log(`
				> Lock status: Releasing on expiration.
					> Name: ${lockName}
					> Message: Automatically removed on expiration.
			`);
			return;
		}

		const unlockScript = `
    if redis.call('get', KEYS[1]) == ARGV[1] 
    	then return redis.call('del', KEYS[1])
    else 
    	return 0
    end
    `;

		const result = await this.options?.client?.eval(unlockScript, 1, lockName, this.uuid);

		this.logger.log(`
				> Lock status: ${!!result ? 'Unlocked' : 'Failed to unlock '}
					> Name: ${lockName}
		`);
	}

	private async lockInternal(name: string, preferences: LockPreferences): Promise<LockStatus> {
		const { client } = this.options;

		const lockName = LockrUtils.prefixName(name, this.options.namePrefix);
		const lockDuration = RedisUtils.redisExpirationTime(preferences);

		const retryPreferences = preferences.retry;
		const retryInterval = LockrUtils.retryIntervalTime(retryPreferences);
		const retryMaxCount = retryPreferences.maxRetryCount;

		this.logger.verbose(`
				> Lock status: Acquiring
					> Name: ${lockName}
					> Duration: ${preferences.atMost} ${preferences.timeUnit}
					> Retrying: ${retryMaxCount > 0 ? 'Yes, ' + retryMaxCount + ' times' : 'No'}
		`);

		let retryCount = 0;
		while (true) {
			const lock = await client?.set(lockName, this.uuid, 'PX', lockDuration, 'NX');
			if (retryPreferences.maxRetryCount === 0 || lock !== null) {
				return {
					acquired: lock !== null,
					message: lock !== null ? success(lockName) : alreadyExists(lockName),
					lockName,
				} as LockStatus;
			}

			if (retryCount >= retryMaxCount) {
				return {
					acquired: false,
					message: failed(lockName, retryCount),
					lockName,
				};
			}

			await LockrUtils.sleep(retryInterval);
			retryCount++;
		}
	}
}
