/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint no-undef: 0 */

const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const setupConfiguration = require("./config/app-configuration");

const nextConfig = {
  env: {
    CONFIG: JSON.stringify(setupConfiguration()),
  },
};

module.exports = withPlugins([[withImages]], nextConfig);
