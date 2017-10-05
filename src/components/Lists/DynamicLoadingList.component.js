/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import log from 'loglevel';
import { isDefined, isArray } from 'd2-utilizr';
import rx from 'rxjs/Rx';

// material-ui
import { List, ListItem, MakeSelectable } from 'material-ui/List';

import SubHeader from '../SubHeader/SubHeader.component';
import { multiArrayValueSeperator } from './DynamicLoadingList.constants';

class DynamicLoadingList extends Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadMoreItems = this.loadMoreItems.bind(this);
        this.loadItems = this.loadItems.bind(this);
        this.onListScroll = this.onListScroll.bind(this);
        this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);
        this.loadItemsFromSingleArray = this.loadItemsFromSingleArray.bind(this);
        this.loadItemsFromMultiArray = this.loadItemsFromMultiArray.bind(this);


        this.scrollStream = new rx.Subject();
        this.scrollSubscription = this.scrollStream.debounceTime(100).subscribe((target) => {
            this.logIt('handling scroll..');
            this.handleScroll(target);
        });
    }

    componentWillMount() {
        this.loadItems(this.props.loadCntOnInit, this.getDefaultState(this.isMultiArray(this.props.items)), this.props.items);
        this.logIt('Initial load');
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.itemsId && nextProps.itemsId) {
            if (this.props.itemsId !== nextProps.itemsId) {
                this.loadNewItems(nextProps);
            }
        } else {
            const sameArrayType = (this.isMultiArray(this.props.items) === this.isMultiArray(nextProps.items));

            if (sameArrayType) {
                const itemsIsEqual = (this.props.itemsEqualityComparer ? this.props.itemsEqualityComparer(this.props.items, nextProps.items, this.isMultiArray(this.props.items)) : this.props.items === nextProps.items);

                if (!itemsIsEqual) {
                    this.loadNewItems(nextProps);
                }
            }
        }
    }

    componentWillUnmount() {
        this.scrollSubscription.unsubscribe();
    }


    loadNewItems(nextProps) {
        this.logIt('received new props');
        this.loadItems(nextProps.loadCntOnInit, this.getDefaultState(this.isMultiArray(nextProps.items)), nextProps.items);

        // scroll to top
        const thisDom = findDOMNode(this);
        thisDom.scrollTop = 0;
    }

    getDefaultState(isMultiArray) {
        const defaultState = {
            loadedCnt: 0,
            loadedSubCnt: -1,
            loadedItems: [],
            loadDone: false,
        };

        if (isMultiArray) {
            Object.assign(defaultState, { loadedSubCnt: 0 });
        }

        return defaultState;
    }

    isMultiArray(items) {
        return !!(items && items[0] && items[0].subItems && isArray(items[0].subItems));
    }

    loadItems(toLoadCnt, currentState, allItems) {
        if (!currentState.loadDone) {
            const loadMethod = (currentState.loadedSubCnt < 0 ? this.loadItemsFromSingleArray : this.loadItemsFromMultiArray);
            const newState = Object.assign({}, currentState, loadMethod(toLoadCnt, currentState, allItems));

            this.setState(newState);
        }
    }

    loadItemsFromSingleArray(toLoadCnt, currentState, allItems) {
        const newItems = this.getItemsFromArray(toLoadCnt, currentState.loadedCnt, allItems);

        const loadedItems = currentState.loadedItems.concat(newItems);
        const loadedCnt = currentState.loadedCnt + newItems.length;

        let isDone = false;
        if (loadedCnt === allItems.length) {
            isDone = true;
        }

        return { loadedCnt, loadDone: isDone, loadedItems };
    }

    getItemsFromArray(toLoadCnt, prevLoadCnt, itemsArray) {
        const newItems = [];

        for (let i = 0; (i < toLoadCnt && i + prevLoadCnt < itemsArray.length); i++) {
            newItems.push(itemsArray[i + prevLoadCnt]);
        }

        return newItems;
    }

    loadItemsFromMultiArray(toLoadCnt, currentState, allItems) {
        let currentlyLoadedCnt = 0;
        let loadedInSubCnt = currentState.loadedCnt;
        const loadedItems = currentState.loadedItems;
        let currentSub;
        for (currentSub = currentState.loadedSubCnt; (currentlyLoadedCnt < toLoadCnt && currentSub < allItems.length); currentSub++) {
            if (allItems[currentSub].subItems &&
               allItems[currentSub].subItems.length > 0 &&
               allItems[currentSub].subItems[loadedInSubCnt]) {
                if (loadedItems.length === currentSub) {
                    loadedItems.push({ id: allItems[currentSub].id, header: allItems[currentSub].header, subItems: [] });
                }

                const subToLoadCnt = toLoadCnt - currentlyLoadedCnt;
                const newItems = this.getItemsFromArray(subToLoadCnt, loadedInSubCnt, allItems[currentSub].subItems);
                loadedItems[currentSub].subItems = loadedItems[currentSub].subItems.concat(newItems);

                currentlyLoadedCnt += newItems.length;
                loadedInSubCnt = (currentlyLoadedCnt === toLoadCnt ? loadedInSubCnt + newItems.length : 0);
            } else {
                loadedInSubCnt = 0;
            }
        }

        let isDone = false;
        if (currentlyLoadedCnt < toLoadCnt && currentSub === allItems.length) {
            isDone = true;
        }

        return { loadedCnt: loadedInSubCnt, loadedSubCnt: currentSub - 1, loadDone: isDone, loadedItems };
    }

    loadMoreItems() {
        this.loadItems(this.props.loadCntOnScroll, this.state, this.props.items);
    }

    handleScroll(target) {
        if (!target) {
            this.logIt('scroll event occured, but could not get target object', 'error');
            return;
        }
        if (!isDefined(target.scrollTop) || !isDefined(target.scrollHeight) || !isDefined(target.clientHeight)) {
            this.logIt('scroll event occured, but could not determine one or more of the target values', 'error');
            return;
        }

        if ((target.scrollTop + target.clientHeight + 5) > target.scrollHeight) {
            this.logIt('scrolled to bottom');
            this.loadMoreItems();
        }
    }

    onListScroll(event) {
        this.scrollStream.next(event.target);
    }

    logIt(message, level) {
        const composedMessage = `DynamicLoadingList ${this.props.id || ''} says: ${message}`;
        log.trace(composedMessage);

        if (isDefined(level) && level !== 'trace') {
            log[level](composedMessage);
        }
    }

    getContainerStyle() {
        const containerStyle = {
            marginTop: 10,
            overflow: 'auto',
            height: 400,
        };

        if (this.context && this.context.muiTheme && this.context.muiTheme.dynamicLoadingListContainer) {
            Object.assign(containerStyle, this.context.muiTheme.dynamicLoadingListContainer);
        }

        if (this.props.containerStyle) {
            Object.assign(containerStyle, this.props.containerStyle);
        }

        return containerStyle;
    }

    getItemStyle() {
        const itemStyle = {
            whiteSpace: 'nowrap',
            fontSize: 14,
        };

        if (this.context && this.context.muiTheme && this.context.muiTheme.dynamicLoadingListItem) {
            Object.assign(itemStyle, this.context.muiTheme.dynamicLoadingListItem);
        }

        if (this.props.itemStyle) {
            Object.assign(itemStyle, this.props.itemStyle);
        }

        return itemStyle;
    }

    getTextContainerStyle() {
        const textContainerStyle = {
        };

        if (this.context && this.context.muiTheme && this.context.muiTheme.dynamicLoadingListTextContainer) {
            Object.assign(textContainerStyle, this.context.muiTheme.dynamicLoadingListTextContainer);
        }

        return textContainerStyle;
    }

    handleSelectionUpdate(e, itemId) {
        if (itemId !== this.props.value) {
            this.props.onValueChange(itemId);
        }
    }

    render() {
        const SelectableList = MakeSelectable(List);
        const value = this.props.value !== 'null' ? this.props.value : null;
        let items = [];
        if (this.state.loadedSubCnt >= 0) {
            this.state.loadedItems.forEach((item, itemIndex) => {
                items.push(<SubHeader key={itemIndex}>{item.header}</SubHeader>);

                const subItems = item.subItems.map((subItem, subItemIndex) => (<ListItem innerDivStyle={this.getTextContainerStyle()} value={item.id + multiArrayValueSeperator + subItem.id} primaryText={subItem.text} style={this.getItemStyle()} key={`${itemIndex}_${subItemIndex}`} />));

                items = items.concat(subItems);
            });
        } else {
            items = this.state.loadedItems.map((item, index) => (<ListItem innerDivStyle={this.getTextContainerStyle()} value={item.id} primaryText={item.text} style={this.getItemStyle()} key={index} />));
        }

        return (
            <div onScroll={this.onListScroll} style={this.getContainerStyle()}>
                <SelectableList value={value} onChange={this.handleSelectionUpdate}>
                    {items}
                </SelectableList>
                {
                    (() => {
                        if (items.length === 0) {
                            return 'no items found';
                        }
                        return null;
                    })()
                }
            </div>
        );
    }
}

DynamicLoadingList.propTypes = {
    items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, text: PropTypes.string.isRequired })),
        PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, header: PropTypes.string.isRequired, subItems: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, text: PropTypes.string.isRequired })) })),
    ]).isRequired,
    itemsId: PropTypes.string, // an id used to determine if the itemlist should update (if not given the itemsEqualityComparer will be used)
    id: PropTypes.string,  // some id used for logging
    loadCntOnInit: PropTypes.number,
    loadCntOnScroll: PropTypes.number,
    value: PropTypes.string,
    onValueChange: PropTypes.func.isRequired,
    itemsEqualityComparer: PropTypes.func,
    containerStyle: PropTypes.object,
    itemStyle: PropTypes.object,
};

DynamicLoadingList.defaultProps = {
    loadCntOnInit: 10,
    loadCntOnScroll: 10,
    items: [],
};

DynamicLoadingList.contextTypes = {
    muiTheme: React.PropTypes.object,
};

export default DynamicLoadingList;
