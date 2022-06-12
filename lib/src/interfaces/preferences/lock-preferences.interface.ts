import { LockTimeUnit } from '../../types';
import { RetryPreferences } from './retry-preferences.interface';

export interface LockPreferences {
	readonly timeUnit: LockTimeUnit;
	readonly atMost: number;
	readonly retry: RetryPreferences;
}
