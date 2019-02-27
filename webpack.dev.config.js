/* eslint-disable */
'use strict';

const webpack = require('webpack');
const webpackConfig = require('./webpack.base.config');

let dhisConfig;

function getDhisConfig(fileContents) {
    let convertedConfig = {};    
    let lines = fileContents.split(/\r?\n/);

    lines.forEach((function(line){
        var lineTrimmed = line.trim();
        if (lineTrimmed) {
            let splitIndex = line.indexOf(" ");
            if (splitIndex >= 0) {
                let id = line.substring(0, splitIndex);
                let value = line.substring(splitIndex).trim();
                if (value && id) {
                    id = id.toUpperCase();
                    if (id === "BASEURL") {
                        convertedConfig.baseUrl = value;                        
                    }
                    else if (id === "AUTHORIZATION") {
                        if (value.match(/^basic/i)) {
                            let valueParts = value.split(" ");
                            if (valueParts.length === 2) {
                                let newValue = valueParts[0] + " " + new Buffer(valueParts[1]).toString('base64');
                                convertedConfig.authorization = newValue;
                            }                                                         
                        } else {
                            convertedConfig.authorization = value;
                        }
                    }
                }
            }
        }        
    }));

    return convertedConfig;
}  


function getConfig() {
    const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME.trimRight('/')}/config`;
    console.log(`using config.json from ${dhisConfigPath}`)
    return require(dhisConfigPath);
}


try {
    dhisConfig = getConfig();
    console.log(dhisConfig)
} catch (e) {
    // Failed to load config file - use default config
    console.log('\nWARNING! Failed to load DHIS config:' + e.message);
    dhisConfig = {
        baseUrl: 'http://localhost:8080/',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };
}

webpackConfig.plugins = [
    new webpack.DefinePlugin({
        DHIS_CONFIG: JSON.stringify(dhisConfig)
    })
];

function log(req, res, opt) {
    if ( req.url === '/manifest.webapp' ) {
        return req.url;
    }
    req.headers.Authorization = dhisConfig.authorization;
    console.log('[PROXY]' + req.url);
}

webpackConfig.devServer = {
    contentBase: './src',
    progress: true,
    port: 8081,
    open: true,
    proxy: {
        '/dhis-web-commons/**': {
            target: dhisConfig.baseUrl,
            bypass: log,
            changeOrigin: false
        }
    }
};

module.exports = webpackConfig;
