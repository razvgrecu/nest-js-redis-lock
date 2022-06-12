import { RetryPreferences } from '../interfaces/preferences';

export class LockrUtils {
	static prefixName(name: string, namePrefix?: string): string {
		return `${namePrefix ?? 'lock'}:${name}`;
	}

	static sleep(timeInMilliseconds: number): Promise<() => void> {
		return new Promise(resolve => setTimeout(resolve, Number(timeInMilliseconds)));
	}

	static retryIntervalTime(preference: Required<RetryPreferences>): number {
		if (preference.timeUnit === 'milliseconds') return preference.interval;
		return preference.interval * 1000;
	}
}
