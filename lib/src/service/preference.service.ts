import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LockPreferences, RetryPreferences } from '../interfaces/preferences';
import { LockrOptions } from '../interfaces/module';
import { LockTimeUnit } from '../types';

@Injectable()
export class PreferenceService {
	constructor(private readonly configService: ConfigService) {}

	buildLockPreferences(input: Partial<LockPreferences> = {}, moduleOptions: LockrOptions): LockPreferences {
		const expirationTimeUnit = input.timeUnit ?? moduleOptions.lockTimeUnit ?? (this.configService.getOrThrow('LOCKR_DEFAULT_EXPIRATION_TIME_UNIT') as LockTimeUnit);

		const expirationDurationAtMost = input.atMost ?? moduleOptions.lockAtMost ?? this.configService.getOrThrow('LOCKR_DEFAULT_EXPIRATION_DURATION_AT_MOST');

		const retry = this.buildRetryPreferences(input.retry, moduleOptions);

		return {
			timeUnit: expirationTimeUnit,
			atMost: expirationDurationAtMost,
			retry,
		};
	}

	buildRetryPreferences(input: Partial<RetryPreferences> = {}, moduleOptions: LockrOptions): RetryPreferences {
		const timeUnit = input.timeUnit ?? moduleOptions.retryTimeUnit ?? (this.configService.get('LOCKR_DEFAULT_RETRY_TIME_UNIT') as LockTimeUnit) ?? 'milliseconds';

		const interval = input.interval ?? moduleOptions.retryInterval ?? +this.configService.get('LOCKR_DEFAULT_RETRY_INTERVAL') ?? 0;

		const maxRetryCount = input.maxRetryCount ?? moduleOptions.retryCount ?? +this.configService.get('LOCKR_DEFAULT_RETRY_MAX_COUNT') ?? 0;

		return {
			timeUnit,
			interval,
			maxRetryCount,
		};
	}
}
