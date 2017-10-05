/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

import sectionTableConstants from './SectionTable.constants';
import LoadingIndicator from '../LoadingIndicators/LoadingIndicator.component';


export default React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired,
        onCellClick: React.PropTypes.func,
    },
    contextTypes: {
        muiTheme: React.PropTypes.object,
    },

    getTableHeader(muiTheme) {
        const headerColumns = this.props.data.header.map((h, index) => {
            const style = Object.assign({}, muiTheme.tableHeaderColumn);
            const width = this.props.data.colWidth && this.props.data.colWidth[index];
            if (width) {
                style.width = width;
            }

            return (
                <TableRowColumn key={index} style={style}>
                    {h}
                </TableRowColumn>
            );
        });

        return (<TableRow key="header" style={muiTheme.tableHeaderRow}>{headerColumns}</TableRow>);
    },

    getTableRows(muiTheme) {
        let tableRows = [];
        if (!this.props.data.waitingForContent === true) {
            tableRows = this.props.data.body.map((r, rowIndex) => {
                const rowCols = r.map((c, colIndex) => {
                    const { value, onClickData, ...config } = c;
                    return (
                        <TableRowColumn key={colIndex} {...config} style={muiTheme.tableCell}>
                            {
                                (() => {
                                    if (value === sectionTableConstants.waiting) {
                                        return (
                                            <LoadingIndicator size={20} />
                                        );
                                    }
                                    return this.getCellContents(value, onClickData);
                                })()
                            }
                        </TableRowColumn>
                    );
                });

                return (
                    <TableRow key={rowIndex} style={muiTheme.tableRow}>
                        {rowCols}
                    </TableRow>
                );
            });
        }
        return tableRows;
    },

    getCellContents(value, onClickData) {
        return (onClickData ? <div><label className="clickable-item" style={{ cursor: 'pointer' }} onClick={() => this.handleCellClick(onClickData)}>{value}</label></div> : <div>{value}</div>);
    },

    handleCellClick(onClickData) {
        this.props.onCellClick(onClickData);
    },

    render() {
        const muiTheme = (this.context && this.context.muiTheme) || {};

        return (
            <div>
                <Table selectable={false} style={muiTheme.table} bodyStyle={muiTheme.tableDiv}>
                    <TableBody adjustForCheckbox={false} displayRowCheckbox={false}>
                        {this.getTableHeader(muiTheme)}
                        {this.getTableRows(muiTheme)}
                    </TableBody>
                </Table>
                {
                    (() => {
                        if (this.props.data.waitingForContent === true) {
                            return (<LoadingIndicator size={100} center top={5} />);
                        }
                        return null;
                    })()
                }
            </div>
        );
    },
});
