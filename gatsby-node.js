const typedoc = require("typedoc");
const path = require("path");
const fs = require("fs");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;

  delete configOptions.plugins;

  function processTypeDoc(generated) {
    const nodeId = createNodeId(`typedoc-${generated.name || "default"}`);
    const nodeContent = JSON.stringify(generated);

    const nodeData = {
      id: nodeId,
      source: generated,
      internal: {
        type: "Typedoc",
        content: nodeContent,
        contentDigest: createContentDigest(generated),
      },
    };

    return nodeData;
  }

  const { src, typedoc: typedocOptions = {} } = configOptions;

  if (!src || !Array.isArray(src)) {
    throw new Error(
      "gatsby-source-typedoc requires a `src` array of TypeScript files to process"
    );
  }

  const app = new typedoc.Application();
  app.options.addReader(new typedoc.TypeDocReader());
  app.options.addReader(new typedoc.TSConfigReader());
  app.bootstrap(Object.assign({}, typedocOptions));

  const generatedFile = path.join(__dirname, ".cache", "generated.json");

  const generated = app.generateJson(src, generatedFile);

  if (generated) {
    const nodeData = processTypeDoc(JSON.parse(fs.readFileSync(generatedFile)));
    createNode(nodeData);
  } else {
    console.error("Failed to generated TypeDoc JSON file");
  }

  return Promise.resolve(generated);
};
