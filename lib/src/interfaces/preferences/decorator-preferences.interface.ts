import { LockPreferences } from './lock-preferences.interface';
import { UnlockPreferences } from './unlock-preferences.interface';

export interface DecoratorPreferences extends LockPreferences, UnlockPreferences {}
