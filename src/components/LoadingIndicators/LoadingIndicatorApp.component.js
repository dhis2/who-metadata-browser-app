/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React, { Component, PropTypes } from 'react';

// components
import CircularProgress from 'material-ui/CircularProgress';
// import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

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
            <CircularProgress size={1.5} style={Object.assign({}, style, this.props.style)} />
        );
    }
}

LoadingIndicatorApp.propTypes = {
    style: PropTypes.object,

};

LoadingIndicatorApp.childContextTypes = {
    muiTheme: React.PropTypes.object,
};

LoadingIndicatorApp.defaultProps = {
    style: {},
};

export default LoadingIndicatorApp;
