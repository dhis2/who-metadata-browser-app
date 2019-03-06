/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prefer-const */

import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import isDefined from 'd2-utilizr/lib/isDefined';

export default class extends React.Component {
    static propTypes = {
        value: PropTypes.string,
        xs: PropTypes.number,
        sm: PropTypes.number,
        md: PropTypes.number,
        lg: PropTypes.number,
        classNames: PropTypes.string,
        isLabel: PropTypes.bool,
    }
    static contextTypes = {
        muiTheme: PropTypes.object,
    }

    displayName = 'BsGridCell'

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
    }
}
