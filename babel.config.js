module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env", // Import from @env in your code
          path: ".env", // Path to your .env file
        },
      ],
    ],
  };
};
