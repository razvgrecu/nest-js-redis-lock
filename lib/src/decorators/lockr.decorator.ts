import { DecoratorPreferences } from '../interfaces/preferences';
import { Inject } from '@nestjs/common';
import { LockrService } from '../service/lockr.service';
import { LockrError } from '../errors';

export function LockR(lockName: string, options: Partial<DecoratorPreferences> = { unlockAfterExpiration: false }) {
	const lockrService = Inject(LockrService);

	return function (target: unknown, key: unknown, descriptor: any) {
		const value = descriptor.value;
		lockrService(target as Record<string, unknown>, 'lockrService');
		let lockWasAcquired = true;

		descriptor.value = async function (...args: any) {
			const service: LockrService = this.lockrService;
			try {
				const status = await service.lock(lockName, options);
				if (status.acquired) {
					return await value.call(this, ...args);
				} else {
					lockWasAcquired = false;
					throw new LockrError(status);
				}
			} finally {
				if (lockWasAcquired) {
					await service.unlock(lockName, options);
				}
			}
		};
		return descriptor;
	};
}
