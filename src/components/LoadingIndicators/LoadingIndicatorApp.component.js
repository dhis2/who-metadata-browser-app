/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// components
import CircularProgress from 'material-ui/CircularProgress';

// theme
import AppTheme from '../../styles/theme';

class LoadingIndicatorApp extends Component {

    getChildContext() {
        return {
            muiTheme: AppTheme,
        };
    }

    render() {
        const style = {
            left: '50%',
            position: 'fixed',
            top: '50%',
            marginTop: -25,
            marginLeft: -25,
        };

        return (
            <CircularProgress size={89} style={Object.assign({}, style, this.props.style)} />
        );
    }
}

LoadingIndicatorApp.propTypes = {
    style: PropTypes.object,
};

LoadingIndicatorApp.childContextTypes = {
    muiTheme: PropTypes.object,
};

LoadingIndicatorApp.defaultProps = {
    style: {},
};

export default LoadingIndicatorApp;
