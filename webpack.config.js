// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // ✅ Ensure entry is not empty
  if (!config.entry || config.entry.length === 0) {
    config.entry = ['./index.js']; // or ./src/index.js depending on your project
  }

  // ✅ Aliases for web compatibility
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-linear-gradient': 'react-native-web-linear-gradient',
    'react-native-svg': 'react-native-svg/lib/commonjs/ReactNativeSVG.web',
  };

  return config;
};
