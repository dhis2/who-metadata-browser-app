/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary*/

import React from 'react';
import PropTypes from 'proptypes';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { isString } from 'd2-utilizr';

class DropDown extends React.Component {


    getDefaultProps() {
        return {
            includeEmpty: false,
            emptyLabel: 'Not specified',
        };
    }

    handleChange = (event, index, value) => {
        if (this.props.value !== value) {
            this.props.onChange(value);
        }
    }

    renderMenuItems = (menuItems) => {
        if (this.props.includeEmpty) {
            menuItems.unshift({ id: 'null', displayName: this.props.emptyLabel });
        }

        return menuItems.map(item => (<MenuItem key={item.id} value={item.id} primaryText={item.text} />));
    }

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
    }
}

DropDown.prototype.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    onChange: PropTypes.func,
    menuItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.string,
    })),
    includeEmpty: PropTypes.bool,
    emptyLabel: PropTypes.string,
    noOptionsLabel: PropTypes.string,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            empty: PropTypes.string,
            filled: PropTypes.string,
            noContent: PropTypes.string,
        }),
    ]).isRequired,
    fullWidth: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default DropDown
