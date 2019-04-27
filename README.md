## gatsby-source-typedoc

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
        src: [
          `${__dirname}/path/to/index.ts`
        ],

        // Options passed to Typedoc Application
        // Usually corresponds to CLI args directly
        typedoc: {
          target: "es5",
          mode: "modules",
          tsconfig: `${__dirname}/path/to/tsconfig.json`
        }
      }
    }
  ]
};
```

## How is this being used?

We are using this plugin on [excaliburjs.github.io](https://github.com/excaliburjs/excaliburjs.github.io) to let us link to symbols dynamically in our documentation.

In theory, you could use this to create an entire Gatsby site for your Typedoc project.