/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import PropTypes from 'prop-types';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const Loader = (props) => {
    const indicatorStyle = {
        container: {
            position: 'relative',
        },
        refresh: {
            position: 'relative',
        },
    };

    let left = 5;
    if (props.center) {
        indicatorStyle.refresh.marginLeft = '50%';
        left = (props.size / -2);
    }

    return (
        <div style={indicatorStyle.container}>
            <RefreshIndicator
                size={props.size}
                left={left}
                top={props.top}
                status="loading"
                style={indicatorStyle.refresh}
            />
        </div>
    );
};

Loader.propTypes = {
    size: PropTypes.number,
    center: PropTypes.bool,
    top: PropTypes.number,
};

Loader.defaultProps = {
    size: 20,
    center: false,
    top: 0,
};

export default Loader;
