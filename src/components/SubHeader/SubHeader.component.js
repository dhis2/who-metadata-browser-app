/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import PropTypes from 'proptypes';

const SubHeader = (props, context) => {
    const style = {
        fontSize: 12,
        paddingLeft: 0,
    };

    if (context.muiTheme && context.muiTheme.subHeader) {
        Object.assign(style, context.muiTheme.subHeader);
    }

    return (
        <div style={style}>
            {props.children}
        </div>
    );
};

SubHeader.propTypes = {
    children: PropTypes.node,
};

SubHeader.contextTypes = {
    muiTheme: PropTypes.object,
};

export default SubHeader;
