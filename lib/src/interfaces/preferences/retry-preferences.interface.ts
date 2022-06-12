import { LockTimeUnit } from '../../types';

export interface RetryPreferences {
	readonly timeUnit: LockTimeUnit;
	readonly interval: number;
	readonly maxRetryCount: number;
}
