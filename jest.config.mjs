// jest.config.mjs
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    moduleNameMapper: {
        '@src/(.*)': '<rootDir>/src/$1'
    }
};