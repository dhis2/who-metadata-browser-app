/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Row, Grid, Col } from 'react-bootstrap';
import isDefined from 'd2-utilizr/lib/isDefined';
import BsGridCell from './BsGridCell.component';

export default React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
    },
    contextTypes: {
        muiTheme: React.PropTypes.object,
    },
    render() {
        let header = '';
        if (isDefined(this.props.data.header)) {
            header = (<Row><Col sm={12} style={this.context.muiTheme.sectionHeader}>{this.props.data.header}</Col></Row>);
        }

        const rows = this.props.data.body.map((r, rowIndex) => {
            const cols = r.map((c, colIndex) => (<BsGridCell key={colIndex} {...c} />));
            return (<Row key={rowIndex} className="flex-row">{cols}</Row>);
        });

        return (<Grid fluid>{header}{rows}</Grid>);
    },
});
