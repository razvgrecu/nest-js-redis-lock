import Redis from 'ioredis';
import { LockTimeUnit } from '../../types';

export interface LockrOptions {
	readonly retryCount?: number;
	readonly retryTimeUnit?: LockTimeUnit;
	readonly retryInterval?: number;
	readonly namePrefix?: string;
	readonly lockAtMost?: number;
	readonly lockTimeUnit?: LockTimeUnit;
	readonly client?: Redis;
}
