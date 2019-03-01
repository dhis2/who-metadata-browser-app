/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { isArray } from 'd2-utilizr';
import TextField from 'material-ui/TextField';

class SearchableList extends Component {
    constructor(props) {
        super(props);
    }

    handleSearch = (searchValue) => {
        this.props.onSearch(searchValue);
    }

    onSearch = (event) => {
        const searchValue = event.target.value;
        this.handleSearch(searchValue);
    }

    filterSingleArray(items) {
        return items.filter(i => i.text.toLowerCase().indexOf(this.props.searchValue.toLowerCase()) !== -1);
    }

    filterMultiArray(items) {
        const filterItems = [];
        items.forEach((i) => {
            const filterSubItems = this.filterSingleArray(i.subItems);
            if (filterSubItems && filterSubItems.length > 0) {
                filterItems.push(Object.assign({}, i, { subItems: filterSubItems }));
            }
        });

        return filterItems;
    }

    isMultiArray(items) {
        return !!(items && items[0] && items[0].subItems && isArray(items[0].subItems));
    }

    getListElement = () => {
        if (this.props.waitForSearchCharCnt) {
            if (!this.props.searchValue || this.props.searchValue.length < this.props.waitForSearchCharCnt) {
                return null;
            }
        }

        let list = this.props.children;

        if (this.props.searchValue) {
            const items = list.props.items;
            const updatedItemsId = `${list.props.itemsId}_${this.props.searchValue}`;
            const filteredItems = (this.isMultiArray(items) ? this.filterMultiArray(items) : this.filterSingleArray(items));
            list = React.cloneElement(list, { items: filteredItems, itemsId: updatedItemsId });
        }

        return list;
    }

    getContainerStyle = () => {
        const containerStyle = {
            padding: 5,
            borderStyle: 'solid',
            borderWidth: 1,
        };

        if (this.context && this.context.muiTheme && this.context.muiTheme.searchableList) {
            Object.assign(containerStyle, this.context.muiTheme.searchableList);
        }

        if (this.props.containerStyle) {
            Object.assign(containerStyle, this.props.containerStyle);
        }

        return containerStyle;
    }

    render() {
        const searchValue = this.props.searchValue || '';
        return (
            <div style={this.getContainerStyle()}>
                <TextField value={searchValue} onChange={this.onSearch} floatingLabelText={this.props.searchLabel} fullWidth />
                {this.getListElement()}
            </div>
        );
    }
}

SearchableList.propTypes = {
    onSearch: PropTypes.func.isRequired,
    searchValue: PropTypes.string,
    searchLabel: PropTypes.string,
    waitForSearchCharCnt: PropTypes.number,
    containerStyle: PropTypes.object,
    children: PropTypes.node,
};

SearchableList.defaultProps = {
    searchValue: '',
};

SearchableList.contextTypes = {
    muiTheme: PropTypes.object,
};

export default SearchableList;
