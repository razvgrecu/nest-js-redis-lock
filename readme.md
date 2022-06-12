# LockR

### ...a NestJS Redis lock. Distributed lock, single Redis node.

#### (for now)

## Requirements

- this works on the assumption that your application already is using Redis
- this particular implementation uses `ioredis`

## Installation

- install through npm or yarn

```
npm i @stephanson/lockr --save
#OR
yarn add @stephanson/lockr
```

## Configuration

- you can configure through [module options](lib/src/interfaces/module/module-options.interface.ts)
- or any mechanism that is recognized by `@nestjs/config/ConfigService`
    - example: dotenv files
    - a current list of the values used by the `ConfigService`:
        - `LOCKR_DEFAULT_EXPIRATION_TIME_UNIT` : `'seconds' | 'milliseconds'`
        - `LOCKR_DEFAULT_EXPIRATION_DURATION_AT_MOST`: `number`
        - `LOCKR_DEFAULT_RETRY_TIME_UNIT`: `'seconds' | 'milliseconds'`
        - `LOCKR_DEFAULT_RETRY_INTERVAL`: `number`
        - `LOCKR_DEFAULT_RETRY_MAX_COUNT`: `number`
- **you can mix and match whatever approach works for you best**
- when using the decorator or the service, the precedence of the values is the following:
    1. the actual input, if exists
    2. the configured module options, if exists
    3. the source for `ConfigService`
- if none of them can provide a value, an error will be thrown by the `ConfigService`
- the exceptions are
    - the `RetryPreferences` where the assumption is that the retry behavior is not desired.
    - the lock name prefix parameter, which, if not supplied is defaulted to `lock`
        - a lock will have the format: `<prefix ?? lock>:<user-defined-name>`

## Usage

## Contributions and future

- there are several topics i would like to address in the future
    - adding testcontainers and writing actual tests within the library
    - adding a nestjs specific implementation for redlock (the distributed, multi node redis version of the algorithm)