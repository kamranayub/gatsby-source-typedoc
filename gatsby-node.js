const typedoc = require("typedoc");

exports.sourceNodes = async (
  { actions, createNoteId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;

  delete configOptions.plugins;

  console.log("plugin options", configOptions);

  const { src, cliOptions = {} } = configOptions;

  if (!src) {
      throw new Error("gatsby-source-typedoc requires a `src` array of TypeScript files to process");
  }

  const app = new typedoc.CliApplication(
    Object.extend({}, cliOptions)
  );
  const generated = app.generateJson(
    src,
    "./generated-typedoc.json"
  );

  return Promise.resolve(generated);
};
