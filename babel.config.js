module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@src/config': './src/config',
          '@src/images': './src/images',
          '@src/pages': './src/pages',
          '@src/utils': './src/utils',
          '@src/redux': './src/redux',


        },
      },
    ],
  ],
};
