import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AsyncLockrOptions, LockrOptions, LockrOptionsFactory } from './interfaces/module';
import { LockrService } from './service/lockr.service';
import { ConfigModule } from '@nestjs/config';
import { PreferenceService } from './service/preference.service';

@Module({
	imports: [ConfigModule],
	providers: [LockrService, PreferenceService],
	exports: [LockrService, PreferenceService],
})
export class LockrModule {
	static forRoot(options?: LockrOptions): DynamicModule {
		return {
			module: LockrModule,
			providers: [{ provide: 'lockr_options', useValue: options || {} }],
		};
	}

	static forRootAsync(options: AsyncLockrOptions): DynamicModule {
		return {
			module: LockrModule,
			imports: options.imports,
			providers: this.asyncProviders(options),
		};
	}

	private static asyncProviders(options: AsyncLockrOptions): Array<Provider> {
		if (options.useExisting || options.useFactory) {
			return [this.asyncProvider(options)];
		}

		const { useClass } = options;
		return [this.asyncProvider(options), { provide: useClass, useClass } as Provider];
	}

	private static asyncProvider(options: AsyncLockrOptions): Provider {
		let params;
		if (options.useFactory) {
			const { useFactory, inject = [] } = options;
			params = { useFactory, inject };
		} else {
			params = {
				useFactory: async (factory: LockrOptionsFactory) => await factory.lockOptions(),
				inject: [options.useExisting || options.useClass],
			};
		}
		return { provide: 'lockr_options', ...params } as Provider;
	}
}
