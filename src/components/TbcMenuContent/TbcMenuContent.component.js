/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'proptypes';
import DropDown from '../form_fields/DropDown.component';
import DynamicList from '../Lists/DynamicLoadingList.component';
import SearchableList from '../Lists/SearchableList.component';

export default class extends React.Component {

    static propTypes = {
        typeMenuItems: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            text: PropTypes.string,
        })),
        groupMenuItems: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            text: PropTypes.string,
        })),
        itemMenuItems: PropTypes.array,
        searchItemMenuItems: PropTypes.array,

        itemsFilter: PropTypes.string,
        searchValue: PropTypes.string,

        typeValue: PropTypes.string,
        groupValue: PropTypes.string,
        itemValue: PropTypes.string,
        searchItemValue: PropTypes.string,

        onTypeUpdate: PropTypes.func,
        onGroupUpdate: PropTypes.func,
        onItemUpdate: PropTypes.func,
        onSearchItemUpdate: PropTypes.func,
        onFilterListValues: PropTypes.func,
        onSearch: PropTypes.func,

        typeMenuLabel: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                empty: PropTypes.string,
                filled: PropTypes.string,
            }),
        ]),
        groupMenuLabel: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                empty: PropTypes.string,
                filled: PropTypes.string,
            }),
        ]),

        groupMenuIsVisible: PropTypes.bool,
        itemMenuIsVisible: PropTypes.bool,
        showSearch: PropTypes.bool,
        appHeight: PropTypes.number,
        menuIsExtended: PropTypes.bool,
    }

    getMenuItemsHeight() {
        const aboveContentsHeight = 390;
        return this.getListHeight(aboveContentsHeight);
    }

    getSearchItemsHeight() {
        const aboveContentsHeight = 315;
        return this.getListHeight(aboveContentsHeight);
    }

    getListHeight(aboveContentsHeight) {
        const minHeight = 280;
        const maxHeight = 950;

        const calculatedMenuHeight = this.props.appHeight - aboveContentsHeight;
        const height = (calculatedMenuHeight > minHeight ? (calculatedMenuHeight > maxHeight ? maxHeight : calculatedMenuHeight) : minHeight);
        return height;
    }

    isItemsEqual(prevItems, newItems, isMulitArray) {
        if (!isMulitArray) {
            return prevItems === newItems;
        }

        if (prevItems.length !== newItems.length) {
            return false;
        }

        for (let i = 0; i < prevItems.length; i++) {
            if (prevItems[i].subItems !== newItems[i].subItems) {
                return false;
            }
        }
        return true;
    }

    render() {
        const elements = [];

        if (this.props.showSearch) {
            elements.push(
                <SearchableList
                    onSearch={this.props.onSearch}
                    searchValue={this.props.searchValue}
                    waitForSearchCharCnt={2}
                    searchLabel={'Type here to search'}
                    key="searchSelector"
                >

                    <DynamicList
                        items={this.props.searchItemMenuItems}
                        itemsId={'-'}
                        id="searchItems"
                        loadCntOnInit={20}
                        value={this.props.searchItemValue}
                        onValueChange={this.props.onSearchItemUpdate}
                        containerStyle={{ height: this.getSearchItemsHeight() }}
                    />

                </SearchableList>
            );
        } else {
            if (this.props.groupMenuIsVisible) {
                elements.push(
                    <DropDown
                        menuItems={this.props.groupMenuItems}
                        value={this.props.groupValue}
                        onChange={this.props.onGroupUpdate}
                        label={this.props.groupMenuLabel}
                        key="groupSelector"
                        id="groupSelector"
                        fullWidth={this.props.menuIsExtended}
                    />
                );
            }

            if (this.props.itemMenuIsVisible) {
                elements.push(
                    <SearchableList onSearch={this.props.onFilterListValues} searchValue={this.props.itemsFilter} searchLabel="Type here to search the list" key="itemSelector">
                        <DynamicList
                            items={this.props.itemMenuItems}
                            itemsId={`${this.props.typeValue}_${this.props.groupValue}`}
                            id="menuItems"
                            loadCntOnInit={20}
                            value={this.props.itemValue}
                            onValueChange={this.props.onItemUpdate}
                            containerStyle={{ height: this.getMenuItemsHeight() }}
                            itemsEqualityComparer={this.isItemsEqual}
                        />
                    </SearchableList>
                );
            }
        }

        return (
            <div>
                <div style={{ fontSize: 16, fontWeight: 'bold', paddingTop: 7, paddingBottom: 7, textAlign: 'center' }}>
                    Metadata Browser
                </div>
                <DropDown menuItems={this.props.typeMenuItems} value={this.props.typeValue} onChange={this.props.onTypeUpdate} label={this.props.typeMenuLabel} id="typeSelector" fullWidth={this.props.menuIsExtended} />
                {elements}
            </div>
        );
    }


}
