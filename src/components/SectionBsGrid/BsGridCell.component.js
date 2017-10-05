/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import { Col } from 'react-bootstrap';
import isDefined from 'd2-utilizr/lib/isDefined';

export default React.createClass({
    propTypes: {
        value: React.PropTypes.string,
        xs: React.PropTypes.number,
        sm: React.PropTypes.number,
        md: React.PropTypes.number,
        lg: React.PropTypes.number,
        classNames: React.PropTypes.string,
        isLabel: React.PropTypes.bool,
    },
    contextTypes: {
        muiTheme: React.PropTypes.object,
    },
    render() {
        let { isLabel, value, ...config } = this.props;

        const myStyle = this.context.muiTheme.bsGridCell;

        const { labelBackgroundColor, labelColor, ...style } = myStyle;
        config.style = style;

        if (isLabel) {
            config.style = Object.assign({}, config.style, {
                backgroundColor: labelBackgroundColor,
                color: labelColor,
            });
        }

        if (!isDefined(value) || value === '') {
            value = '\u00a0';
        }

        return (<Col {...config}>{value}</Col>);
    },
});
