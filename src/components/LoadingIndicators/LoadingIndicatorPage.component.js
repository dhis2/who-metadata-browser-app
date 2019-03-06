/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// components
import CircularProgress from 'material-ui/CircularProgress';

class LoadingIndicatorPage extends Component {

    render() {
        const style = {

        };

        const containerStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };

        return (
            <div style={containerStyle}>
                <CircularProgress style={Object.assign({}, style, this.props.style)} />
            </div>
        );
    }
}

LoadingIndicatorPage.propTypes = {
    style: PropTypes.object,
};

LoadingIndicatorPage.defaultProps = {
    style: {},
};

export default LoadingIndicatorPage;
