import { LockTimeUnit } from '../../types';
import { Redis } from 'ioredis';

export interface LockrOptions {
	readonly retryCount?: number;
	readonly retryTimeUnit?: LockTimeUnit;
	readonly retryInterval?: number;
	readonly namePrefix?: string;
	readonly lockAtMost?: number;
	readonly lockTimeUnit?: LockTimeUnit;
	readonly client?: Redis;
}
