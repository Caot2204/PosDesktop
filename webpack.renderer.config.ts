import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import CopyWebpackPlugin from 'copy-webpack-plugin';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
      new CopyWebpackPlugin(
        {
          patterns: [
            {
              from: 'src/icons',
              to: 'icons'
            }
          ]
        }
      )
    ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
