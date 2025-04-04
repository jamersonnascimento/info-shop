//The babel.config.js file is used to configure Babel, a JavaScript compiler that allows 
// you to use modern JavaScript features while ensuring compatibility with older environments.
module.exports = function(api) {
  api.cache(true); // Enables caching for faster rebuilds
  return {
    presets: ['babel-preset-expo'], // Preset for Expo projects
    plugins: [
      ['@babel/plugin-transform-class-properties', { loose: true }], // Transforms class properties
      ['@babel/plugin-transform-private-methods', { loose: true }], // Transforms private methods
      ['@babel/plugin-transform-private-property-in-object', { loose: true }] // Transforms private properties in objects
    ],
  };
};


  