module.exports = {
  env: {
    development: {
      presets: [
        "@babel/preset-react"
      ],
      plugins: [
        "@babel/plugin-transform-runtime",
        [
          "@babel/plugin-proposal-class-properties", 
          {
            loose: true
          }
        ],
        "@babel/plugin-syntax-dynamic-import",
      ]
    },
    production: {
      presets:[
        "@babel/preset-react"
      ],
      plugins: [
        "@babel/runtime",
      ]
    }
  }
}
