const { helpers, cleanNodeForSnapshot } = require("./__fixtures__/test-utils");
const { sourceNodes } = require("../gatsby-node");

jest.mock("typedoc", () => require("typedoc17"));

describe("gatsby-node: sourceNodes", () => {
  describe("typedoc: 0.17.x", () => {
    it("should generate project", async () => {
      let typedocNode;

      helpers.actions.createNode.mockImplementation((node) => {
        typedocNode = node;
      });

      await sourceNodes(helpers, {
        src: [require.resolve("./__fixtures__/simple/index.ts")],
        typedoc: {
          target: "es5",
          mode: "modules",
          disableSources: true,
        },
      });

      expect(typedocNode).toBeDefined();
      cleanNodeForSnapshot(typedocNode);
      expect(typedocNode).toMatchSnapshot();
    });
  });
});
