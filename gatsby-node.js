const typescript = require("typescript");
const typedoc = require("typedoc");
const fs = require("fs");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, cache, reporter },
  configOptions
) => {
  const { createNode } = actions;

  delete configOptions.plugins;

  const { src, id = "default", typedoc: typedocOptions = {} } = configOptions;

  if (!src || !Array.isArray(src)) {
    reporter.paninOnBuild(
      "gatsby-source-typedoc requires a `src` array of TypeScript files to process"
    );
  }

  function processTypeDoc(generated) {
    const nodeId = createNodeId(`typedoc-${id}`);
    const nodeContent = JSON.stringify(generated);

    const nodeData = {
      id: nodeId,
      source: generated,
      internal: {
        id,
        type: "Typedoc",
        content: nodeContent,
        contentDigest: createContentDigest(generated),
      },
    };

    return nodeData;
  }

  //
  // Use existing cached data, if already processed
  //
  const existing = await cache.get(`gatsby-source-typedoc--generated-${id}`);
  if (existing) {
    const nodeData = processTypeDoc(existing);
    createNode(nodeData);
    reporter.verbose(
      `Using generated TypeDoc from previous build with ID: ${id}`
    );
    return true;
  }

  const app = new typedoc.Application();
  app.options.addReader(new typedoc.TypeDocReader());
  app.options.addReader(new typedoc.TSConfigReader());

  // If specifying tsconfig file, use TS to find
  // it so types are resolved relative to the source
  // folder
  if (typedocOptions.tsconfig) {
    const tsconfig = typescript.findConfigFile(
      typedocOptions.tsconfig,
      fs.existsSync
    );
    if (tsconfig) {
      typedocOptions.tsconfig = tsconfig;
    }
  }

  app.bootstrap(Object.assign({}, typedocOptions));

  try {
    const reflection = app.convert(src);

    if (reflection) {
      const eventData = {
        outputDirectory: __dirname,
        outputFile: `generated=${id}.json`,
      };
      const serialized = app.serializer.projectToObject(reflection, {
        begin: eventData,
        end: eventData,
      });
      const nodeData = processTypeDoc(serialized);

      // Store in Gatsby cache
      await cache.set(`gatsby-source-typedoc--generated-${id}`, serialized);

      createNode(nodeData);

      reporter.verbose(`Generated TypeDoc and cached with ID: ${id}`);
    } else {
      reporter.warn("TypeDoc returned an empty project");
    }
  } catch (error) {
    reporter.panicOnBuild("Encountered error when executing TypeDoc", error);
  }

  return Promise.resolve(true);
};
