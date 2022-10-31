## gatsby-source-typedoc

[![Node.js Package Lint, Test and Publish](https://github.com/kamranayub/gatsby-source-typedoc/actions/workflows/publish.yml/badge.svg)](https://github.com/kamranayub/gatsby-source-typedoc/actions/workflows/publish.yml)

> A Gatsby plugin that executes Typedoc against TypeScript source files to create GraphQL nodes that contain the TypeDoc generated data structure

## Example Usage

    # Install the plugin
    npm install gatsby-source-typedoc
    # Install typedoc as a peer dependency
    npm install typedoc -D

In your `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-typedoc",
      options: {

        // Array of Typescript files to
        // include
        src: [
          `${__dirname}/path/to/index.ts`
        ],

        // Options passed to Typedoc Application
        // Usually corresponds to CLI args directly
        // See: https://typedoc.org/guides/options/
        typedoc: {
          tsconfig: `${__dirname}/path/to/tsconfig.json`
        }
      }
    }
  ]
};
```

> **NOTE:** Starting with `typedoc@0.20.x` you **must** provide a path to the `tsconfig.json` file. See [release notes](https://github.com/TypeStrong/typedoc/releases/tag/v0.20.0). This source plugin supports typedoc versions previous to 0.20 but there are breaking changes to the exported JSON you may need to account for.

In GraphQL now you may do:

```
{
  typedoc {
    id
    source {
      id
      kind
      name
    }
    internal {
      content
    }
  }
}
```

The `typedoc.internal.content` field contains the generated JSON you can use to parse and use in your app. You can optionally use GraphQL to go into the `typedoc.source` fields but due to the recursive nature of the data structure, this may be more annoying than useful.

## Transforming Markdown Symbol Links

Want to be able to transform [Typedoc symbol links](https://typedoc.org/guides/link-resolution/) in Markdown files like `[[MyClass]]` to link to your Typedoc API docs?

Check out the sister plugin [gatsby-remark-typedoc-symbol-links](https://github.com/kamranayub/gatsby-remark-typedoc-symbol-links).

## How is this being used?

We are using this plugin on [excaliburjs.github.io](https://github.com/excaliburjs/excaliburjs.github.io) to let us link to symbols dynamically in our documentation.

In theory, you could use this to create an entire Gatsby site for your Typedoc project.

## Contributing

I welcome all contributions. Releases are automated through GitHub.