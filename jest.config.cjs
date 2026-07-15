/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Fix 1: Maps imports ending in '.js' to their actual '.ts' files on disk
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Fix 2: Forces ts-jest to convert modern 'import' statements into old-school 'require' 
  // statements in memory so Jest's core engine doesn't crash!
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
        },
      },
    ],
  },
};