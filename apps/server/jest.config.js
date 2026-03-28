/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [ 'dist' ],
  coveragePathIgnorePatterns: [ 'src/adapter' ],
  moduleNameMapper: {
    '^@server-core/(.*)$': '<rootDir>/src/core/$1',
    '^#adapter/(.*)$': '<rootDir>/src/adapter/$1',
    '^#app/(.*)$': '<rootDir>/src/app/$1',
    '^@eoneom/api-client/(.*)$': '<rootDir>/../../packages/api-client/$1',
    '^#core/(.*)$': '<rootDir>/src/core/$1',
    '^#cron/(.*)$': '<rootDir>/src/cron/$1',
    '^#command/(.*)$': '<rootDir>/src/app/command/$1',
    '^#query/(.*)$': '<rootDir>/src/app/query/$1',
    '^#shared/(.*)$': '<rootDir>/src/shared/$1',
    '^#type/(.*)$': '<rootDir>/src/core/type/$1',
    '^#web/(.*)$': '<rootDir>/src/web/$1',
  },
}
