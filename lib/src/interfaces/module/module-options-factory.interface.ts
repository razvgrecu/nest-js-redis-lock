import { LockrOptions } from './module-options.interface';

export interface LockrOptionsFactory {
	lockOptions(): LockrOptions | Promise<LockrOptions>;
}
