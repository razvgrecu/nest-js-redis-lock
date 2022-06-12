import { LockStatus } from '../types';

export class LockrError extends Error {
	constructor(public readonly status: LockStatus) {
		super(status.message);
	}
}
