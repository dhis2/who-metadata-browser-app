/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import PropTypes from 'proptypes';
import Paper from 'material-ui/Paper';

export default class extends React.Component {

    static propTypes = {
        children: PropTypes.node,
    }

    static contextTypes = {
        muiTheme: PropTypes.object,
    }

    render() {
        const myStyle = this.context.muiTheme.sectionWrapper;

        return (
            <Paper style={myStyle}>{this.props.children}</Paper>
        );
    }
}
