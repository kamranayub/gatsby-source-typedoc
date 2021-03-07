const { helpers, cleanNodeForSnapshot } = require("./__fixtures__/test-utils");
const { sourceNodes } = require("../gatsby-node");

describe("gatsby-node: sourceNodes", () => {
  describe("typedoc: latest", () => {
    it("should generate project", async () => {
      let typedocNode;

      helpers.actions.createNode.mockImplementation((node) => {
        typedocNode = node;
      });

      await sourceNodes(helpers, {
        src: [require.resolve("./__fixtures__/simple/index.ts")],
        typedoc: {
          logLevel: "Verbose",
          disableSources: true,
          tsconfig: require.resolve("./__fixtures__/simple/tsconfig.json"),
        },
      });

      expect(typedocNode).toBeDefined();
      cleanNodeForSnapshot(typedocNode);
      expect(typedocNode).toMatchSnapshot();
    });
  });
});
