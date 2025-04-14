// jest.config.mjs
export default {
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testEnvironment: 'node',
    verbose: true,
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
    },
};