import { LockPreferences } from '../interfaces/preferences';

export class RedisUtils {
	static redisExpirationTime(preference: LockPreferences): number {
		if (preference.timeUnit === 'milliseconds') return preference.atMost;
		return preference.atMost * 1000;
	}
}
