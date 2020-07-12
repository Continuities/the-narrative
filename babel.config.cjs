module.exports = {
  presets: [
    "@babel/env", 
    "@babel/preset-react",
    "@babel/preset-flow"
  ],
  sourceMaps: 'both',
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [ 'babel-plugin-transform-imports',
    {
      '@material-ui/icons': {
        'transform': '@material-ui/icons/esm/${member}',
        'preventFullImport': true
      }
    }]  
  ]
};
