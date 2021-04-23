const typescript = require("typescript");
const { Application, TypeDocReader, TSConfigReader } = require("typedoc");
const fs = require("fs");

exports.pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    src: Joi.array()
      .items(Joi.string().required())
      .required(),
    id: Joi.string(),
    typedoc: Joi.object().unknown(true),
  }).unknown(true);

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, cache, reporter },
  configOptions
) => {
  const { createNode } = actions;

  delete configOptions.plugins;

  const { src, id = "default", typedoc: typedocOptions = {} } = configOptions;

  if (!src || !Array.isArray(src)) {
    reporter.panicOnBuild(
      "gatsby-source-typedoc requires a `src` array of TypeScript files to process"
    );
  }

  function processTypeDoc(generated) {
    const nodeId = createNodeId(`typedoc-${id}`);
    const nodeContent = JSON.stringify(generated);

    const nodeData = {
      id: nodeId,
      typedocId: id,
      source: generated,
      internal: {
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

  const app = new Application();
  app.options.addReader(new TypeDocReader());
  app.options.addReader(new TSConfigReader());

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

  app.bootstrap(Object.assign({ name: id }, typedocOptions));

  try {
    /**
     * In TS 0.20.x+, a TS program is needed to properly
     * serialize a project to an object format. For 0.17,
     * you don't need to.
     */
    let program;

    if (app.options.getFileNames) {
      program = typescript.createProgram({
        rootNames: app.options.getFileNames(),
        options: app.options.getCompilerOptions(),
        projectReferences: app.options.getProjectReferences(),
      });
      app.options.setValue("entryPoints", app.expandInputFiles(src));
    }

    const reflection = program
      ? app.convert()
      : app.convert(app.expandInputFiles(src));

    if (reflection) {
      const serialized = app.serializer.toObject(reflection, program);
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
