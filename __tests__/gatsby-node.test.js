const helpers = require('./__fixtures__/helpers');
const { sourceNodes } = require("../gatsby-node");

describe("gatsby-node: sourceNodes", () => {

  describe("typedoc: latest", () => {
    it("should generate project", async () => {
      const nodes = [];

      helpers.actions.createNode.mockImplementation((node) => nodes.push(node));

      await sourceNodes(helpers, {
        src: ["./__fixtures__/simple/index.ts"],
      });

      expect(nodes).toMatchSnapshot();
    });
  });
});
