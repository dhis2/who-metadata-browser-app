/* eslint-disable comma-dangle */

const webpack = require('webpack');
const webpackConfig = require('./webpack.base.config');

webpackConfig.mode = 'production';
webpackConfig.plugins = [
    // Replace any occurance of process.env.NODE_ENV with the string 'production'
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '\'production\'',
        },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.BannerPlugin({ banner: '© Copyright 2017 the World Health Organization (WHO). This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.' }),
    new webpack.DefinePlugin({
        DHIS_CONFIG: JSON.stringify({})
    })
];

module.exports = webpackConfig;
