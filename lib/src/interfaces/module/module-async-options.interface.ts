import { ModuleMetadata, Type } from '@nestjs/common';
import { LockrOptionsFactory } from './module-options-factory.interface';
import { LockrOptions } from './module-options.interface';

export interface AsyncLockrOptions extends Pick<ModuleMetadata, 'imports'> {
	useExisting?: Type<LockrOptionsFactory>;
	useClass?: Type<LockrOptionsFactory>;
	useFactory?: (...args: any[]) => LockrOptions | Promise<LockrOptions>;
	inject?: any[];
}
