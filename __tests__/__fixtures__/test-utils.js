/**
 * Shared Gatsby helpers
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

/**
 * Clean typedoc node for snapshots to remove things
 * like pathnames
 */
exports.cleanNodeForSnapshot = (typedocNode) => {
  if (typedocNode.internal.content) {
    const pathregex = new RegExp(`${__dirname.replace(/\\/g, '/')}`);
    typedocNode.internal.content = typedocNode.internal.content.replace(
      pathregex,
      "__PROJECT__"
    );
  }

  if (typedocNode.source.children) {
    typedocNode.source.children.forEach((source) => {
      if (source.originalName) {
        delete source.originalName;
      }
    });
  }
  if (typedocNode.source.sourceFileToPackageName) {
    delete typedocNode.source.sourceFileToPackageName;
  }
};
