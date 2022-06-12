export const LOCKR_CONSTANTS = {
	providerName: 'lockr_options',
};

export const LOCK_ALREADY_EXISTS = (name: string) => `Lock with name ${name} already exists. Cannot acquire lock for this execution.`;
export const LOCK_ACQUIRED = (name: string) => `Lock with name ${name} was acquired.`;
export const LOCK_RETRY_COULD_NOT_ACQUIRE = (name: string, count: number) => `Lock with name ${name} could not be acquired after ${count} tries.`;
