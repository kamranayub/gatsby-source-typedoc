const helpers = require("./__fixtures__/helpers");
const { sourceNodes } = require("../gatsby-node");

jest.mock("typedoc", () => require("typedoc17"));

describe("gatsby-node: sourceNodes", () => {
  describe("typedoc: 0.17.x", () => {
    it("should generate project", async () => {
      const nodes = [];

      helpers.actions.createNode.mockImplementation((node) => nodes.push(node));

      await sourceNodes(helpers, {
        src: [require.resolve("./__fixtures__/simple/index.ts")],
        typedoc: {
          target: "es5",
          mode: "modules",
        },
      });

      expect(nodes).toMatchSnapshot();
    });
  });
});
