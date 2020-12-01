module.exports = function (api) {
  api.cache(true);
  const plugins = ["@babel/plugin-proposal-optional-chaining"];
  return {  plugins };
};