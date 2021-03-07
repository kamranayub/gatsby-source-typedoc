module.exports = {
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
    panicOnBuild: jest.fn(),
    verbose: jest.fn(),
    warn: jest.fn(),
  },
};
