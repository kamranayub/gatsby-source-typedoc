const helpers = require("./__fixtures__/helpers");
const { sourceNodes } = require("../gatsby-node");

describe("gatsby-node: sourceNodes", () => {
  describe("typedoc: latest", () => {
    it("should generate project", async () => {
      const nodes = [];

      helpers.actions.createNode.mockImplementation((node) => nodes.push(node));

      await sourceNodes(helpers, {
        src: [require.resolve("./__fixtures__/simple/index.ts")],
        typedoc: {
          logLevel: "Verbose",
          tsconfig: require.resolve("./__fixtures__/simple/tsconfig.json"),
        },
      });

      expect(nodes).toMatchSnapshot();
    });
  });
});
