/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary*/

import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { isString } from 'd2-utilizr';

export default React.createClass({
    propTypes: {
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
        ]),
        onChange: React.PropTypes.func,
        menuItems: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
            text: React.PropTypes.string,
        })),
        includeEmpty: React.PropTypes.bool,
        emptyLabel: React.PropTypes.string,
        noOptionsLabel: React.PropTypes.string,
        label: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.shape({
                empty: React.PropTypes.string,
                filled: React.PropTypes.string,
                noContent: React.PropTypes.string,
            }),
        ]).isRequired,
        fullWidth: React.PropTypes.bool,
        width: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    },

    getDefaultProps() {
        return {
            includeEmpty: false,
            emptyLabel: 'Not specified',
        };
    },

    handleChange(event, index, value) {
        if (this.props.value !== value) {
            this.props.onChange(value);
        }
    },

    renderMenuItems(menuItems) {
        if (this.props.includeEmpty) {
            menuItems.unshift({ id: 'null', displayName: this.props.emptyLabel });
        }

        return menuItems.map(item => (<MenuItem key={item.id} value={item.id} primaryText={item.text} />));
    },

    render() {
        const { onChange, value, menuItems, label, includeEmpty, emptyLabel, noOptionsLabel, ...other } = this.props;
        const menuItemArray = menuItems ? (Array.isArray(menuItems) ? menuItems : menuItems.toArray()) : [];
        const hasOptions = menuItemArray.length > 0;
        const calculatedValue = hasOptions ? (value === 'null' ? '' : value) : '';
        const calculatedLabel = (!hasOptions ? (label.noContent || label.empty) : (isString(label) ? label : (calculatedValue && calculatedValue !== '' ? label.filled : label.empty)));

        return (
            <SelectField
                value={calculatedValue}
                style={{ overflow: 'hidden' }}
                onChange={this.handleChange}
                floatingLabelText={calculatedLabel}
                disabled={!hasOptions}
                fullWidth={this.props.fullWidth || false}
                autoWidth={false}
                {...other}
            >
                {hasOptions
                    ? this.renderMenuItems(menuItemArray)
                    : <MenuItem defaultValue={1} primaryText={noOptionsLabel || '-'} />
                }
            </SelectField>
        );
    },
});
