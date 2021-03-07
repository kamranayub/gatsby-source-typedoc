/**
 * Shared Gatsby helper mocks
 */
exports.helpers = {
  actions: {
    createNode: jest.fn(),
  },
  createNodeId: jest.fn((id) => id),
  createContentDigest: jest.fn(() => "testdigest"),
  cache: {
    get: jest.fn(),
    set: jest.fn(),
  },
  reporter: {
    panicOnBuild: jest.fn((message, error) => {
      console.error(message);
      if (error) {
        throw error;
      }
    }),
    verbose: jest.fn(),
    warn: jest.fn(),
  },
};
