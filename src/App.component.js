/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import PropTypes from 'proptypes';
//import rx from 'rxjs/Rx';
import log from 'loglevel';
import { isDefined } from 'd2-utilizr';

// material-ui
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

// d2-ui
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

// internal ui
import MenuContainer from './components/SideMenuContainer/SideMenuContainer.component';
import TbcMenuContent from './components/TbcMenuContent/TbcMenuContent.component';
import TbcWHOMenuContent from './components/TbcWHOMenuContent/TbcWHOMenuContent.component';
import TbcMobileMenu from './components/TbcMobileMenu/TbcMobileMenu.component';
import MainContent from './components/MainContent/MainContent.component';

// rxJs
import menuStore from './stores/menuStore';
import menuSelectionStore from './stores/menuSelectionsStore';
import selectedStore from './stores/selectedStore';
import userActions from './actions/UserActions';
import dispatcherActions from './actions/DispatcherActions';
import { Subject } from 'rxjs/Subject'

// utils
import dataBuilders from './helpers/dataBuilders';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// theme
//import MuiThemeMixin from './styles/mui-theme.mixin';
import AppTheme from './styles/theme';

// constants
import sectionTypes from './components/Sections/SectionTypes';
import { latestUpdateIsInitConstant, runTypeConstants, itemValueSeperator, viewModes } from './constants/configConstants';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const LeftMenuWidthOnOpen = 290;
const LeftMenuWidthExpanded = 380;
const RigthMenuWidthOnOpen = 290;
const RightMenuWidthExpanded = 380;
const LeftMenuWidthOnClose = 20;
const RigthMenuWidthOnClose = 20;
const mainContentPadding = 20;
const mainContentTopPaddingPhone = 0;

const phoneModeUpperThreshold = 768; // 768
const tabletModeUpperThreshold = 1200; // 1200
const modes = viewModes;

class App extends React.Component {

    static propTypes = {
        d2: PropTypes.object,
        WHOData: PropTypes.object,
    }

    static defaultProps = {
        WHOData: {
            categoriesMenu: [],
            referencesMenu: {},
        },
    }

    static childContextTypes = {
        d2: PropTypes.object,
        muiTheme: PropTypes.object,
    }

    constructor(props) {
        super(props)

        const width = this.getMyWidth();
        const viewMode = this.getViewMode(width);
        const leftMenuOpen = viewMode > modes.phone;
        const rightMenuOpen = viewMode === modes.desktop;

        this.state = {
            typeMenuValue: 'null',
            groupMenuValue: 'null',
            leftMenuOpen,
            leftMenuExpanded: false,
            rightMenuOpen,
            rightMenuExpanded: false,
            mainContent: this.resetMainContent(),
            width,
            height: this.getMyHeight(),
            initialRun: true,
        };
    }




    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    subscriptions = [];

    componentDidMount() {
        // add subscribtions
        this.subscriptions.push(this.getResizeStreamObserver());
        this.subscriptions.push(this.getMenuChangedObserver());
        this.subscriptions.push(this.getSelectionChangedObserver());
        this.subscriptions.push(this.getWaitingForContentObserver());
        this.subscriptions.push(this.getResetContentsObserver());

        // listen to resizeEvent to be able to change pageDesign
        window.addEventListener('resize', this.onDimensionChange);
    }

    componentWillUnmount() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });

        window.removeEventListener('resize', this.onDimensionChange);
    }

    onDimensionChange = () => {
        this.resizeStream.next(1);
    }

    getResizeStreamObserver = () => {
        const resizeStream = this.resizeStream = new Subject();
        return resizeStream.debounceTime(300)
        .subscribe(
            () => {
                log.debug('handling resize..');
                this.handleDimensionChange();
            },
            (error) => {
                log.error(JSON.stringify(error));
            },
            () => {
                log.debug('resizeStream completed');
            }
        );
    }

    getMenuChangedObserver = () => {
        menuSelectionStore
        .subscribe(
            (selection) => {
                this.selectionChanged(selection);
            },
            (error) => {
                log.error(JSON.stringify(error));
            },
            () => {
                log.debug('menuStream completed');
            }
        );
    }

    getSelectionChangedObserver = () => {
        selectedStore.subscribe(
            ((selectedStoreData) => {
                if (isDefined(selectedStoreData) && !isDefined(selectedStoreData.error)) {
                    const isEmptySection = sectionData => (!isDefined(sectionData.body) || sectionData.body.length === 0 || sectionData.body[0].length === 0);

                    const removeEmptySections = (sectionsContainer) => {
                        const validatedSectionsContainer = [];
                        sectionsContainer.forEach((s) => {
                            if (!isEmptySection(s.data) || (s.data.waitingForContent && s.data.waitingForContent === true)) {
                                validatedSectionsContainer.push(s);
                            }
                        });
                        return validatedSectionsContainer;
                    };

                    const addWaitingForContentPropIfApplicable = (sectionConfig, sectionContainer) => {
                        const modifiedSectionContainer = sectionContainer;
                        if (sectionConfig.loadContentAsExtension) {
                            if (isEmptySection(sectionContainer.data)) {
                                modifiedSectionContainer.data.waitingForContent = true;
                            }
                        }
                        return modifiedSectionContainer;
                    };

                    const buildSection = (sectionConfig, data, runType) => {
                        let sectionContainer;

                        if (isDefined(sectionConfig.fields)) {
                            sectionContainer = { id: sectionConfig.id, type: sectionTypes.bsGrid, data: dataBuilders.buildBsGridDataFromFields(data, sectionConfig, runType) };
                        } else if (isDefined(sectionConfig.list)) {
                            sectionContainer = { id: sectionConfig.id, type: sectionTypes.bsGrid, data: dataBuilders.buildBsGridDataFromList(data, sectionConfig, runType) };
                        } else if (isDefined(sectionConfig.table)) {
                            sectionContainer = { id: sectionConfig.id, type: sectionTypes.table, data: dataBuilders.buildTableData(data, sectionConfig, runType) };
                        } else {
                            log.debug('could not resolve sectionType');
                        }

                        return sectionContainer;
                    };

                    if (selectedStoreData.latestUpdate === latestUpdateIsInitConstant) {
                        let sectionsContainer = selectedStoreData.contentConfig.sections.map((s) => {
                            let builtSection = buildSection(s, selectedStoreData.data, runTypeConstants.init);
                            builtSection = addWaitingForContentPropIfApplicable(s, builtSection);
                            return builtSection;
                        });

                        sectionsContainer = removeEmptySections(sectionsContainer);

                        const header = selectedStoreData.data[selectedStoreData.contentConfig.headerProp];

                        this.setState({ mainContent: { header, subHeader: selectedStoreData.contentConfig.headerSubText, sections: sectionsContainer }, waitingForContent: false });
                        window.scrollTo(0, 0);
                    } else {
                        // update section
                        const sectionConfig = selectedStoreData.contentConfig.sections.find(s => s.id === selectedStoreData.latestUpdate);
                        if (sectionConfig) {
                            const sectionDataContainer = buildSection(sectionConfig, selectedStoreData.data, runTypeConstants.extension);
                            const validatedSections = removeEmptySections([sectionDataContainer]);

                            // retrieve sections from state, remove the section updated and finally insert the updated section in the right position
                            const currentSections = this.state.mainContent.sections.slice();
                            const currentSectionId = currentSections.findIndex(s => s.id === sectionConfig.id);

                            if (currentSectionId >= 0) {
                                if (validatedSections.length > 0) {
                                    currentSections.splice(currentSectionId, 1, sectionDataContainer);
                                } else {
                                    currentSections.splice(currentSectionId, 1);
                                }
                            } else {
                                log.debug('Tried to update section but didnt find the section in the container');
                                currentSections.push(sectionDataContainer);
                            }
                            this.setState({ mainContent: { header: this.state.mainContent.header, subHeader: this.state.mainContent.subHeader, sections: currentSections }, waitingForContent: false });
                        }
                    }
                } else {
                    this.setState({ mainContent: this.resetMainContent((selectedStoreData && selectedStoreData.error)), waitingForContent: false });
                }
            }),
            (error) => {
                log.error(JSON.stringify(error));
            },
            () => {
                log.debug('selectedStore completed');
            }
        );
    }

    getWaitingForContentObserver = () => {
        dispatcherActions.waitingForMainContent.subscribe(
            (data) => {
                if (data) {
                    this.setState(Object.assign({ waitingForContent: true }, (this.state.initialRun ? { initialRun: false } : {})));
                }
            },
            (error) => {
                log.error(JSON.stringify(error));
            },
            () => {
                log.debug('waitingForContent completed');
            }
        );
    }

    getResetContentsObserver = () => {
        dispatcherActions.resetContents.subscribe(
            () => {
                this.setState({ initialRun: true });
            },
            (error) => {
                log.error(JSON.stringify(error));
            },
            () => {
                log.debug('resetContens completed');
            }
        );
    }

    getViewMode = (specifiedWidth) => {
        let mode;

        const width = isDefined(specifiedWidth) ? specifiedWidth : this.state.width;

        if (width >= tabletModeUpperThreshold) {
            mode = modes.desktop;
        } else if (width < phoneModeUpperThreshold) {
            mode = modes.phone;
        } else {
            mode = modes.tablet;
        }
        return mode;
    }

    getMyHeight = () => {
        return $(window).height();
    }

    getMyWidth = () => {
        return $(window).width();
    }

    getGroupMenuItems = (groupMenuVisible) => {
        if (groupMenuVisible) {
            return menuStore.state.groups[this.state.typeMenuValue];
        }
        return [];
    }

    getMenuItems = (groupMenuVisible, itemMenuVisible) => {
        if (itemMenuVisible) {
            return (groupMenuVisible ? this.buildMenuItems() : menuStore.state.items[this.state.typeMenuValue]);
        }
        return [];
    }

    itemMenuIsVisible = (groupMenuVisible) => {
        if (this.state.typeMenuValue !== 'null' && this.state.typeMenuValue !== '_S') {
            if (groupMenuVisible) {
                if (this.state.groupMenuValue !== 'null') {
                    return true;
                }
            } else {
                return true;
            }
        }
        return false;
    }

    buildMenuItems = () => {
        if (this.state.groupMenuValue !== 'ALLBYGROUPS') {
            return menuStore.state.items[this.state.typeMenuValue][this.state.groupMenuValue];
        }

        const menuItems = [];
        menuStore.state.groups[this.state.typeMenuValue].forEach((g) => {
            if (g.id !== 'ALL' && g.id !== 'ALLBYGROUPS') {
                menuItems.push({ id: g.id, header: g && g.text, subItems: menuStore.state.items[this.state.typeMenuValue][g.id] });
            }
        });
        return menuItems;
    }

    groupMenuIsVisible = () => {
        if (this.state.typeMenuValue !== 'null') {
            const groups = menuStore.state.groups[this.state.typeMenuValue];
            if (isDefined(groups) && groups.length > 0) {
                return true;
            }
        }
        return false;
    }

    selectionChanged = (selection) => {
        const newState = {};
        newState.typeMenuValue = selection.type;
        newState.groupMenuValue = selection.group;

        if (selection.item && selection.item !== 'null') {
            newState.itemMenuValue = (selection.itemSub ? selection.itemSub + itemValueSeperator + selection.item : selection.item);
        } else {
            newState.itemMenuValue = selection.item;
        }

        newState.itemsFilter = selection.itemsFilter;
        newState.searchValue = selection.search;
        newState.searchItemMenuValue = selection.searchItem;

        this.setState(newState);
    }

    handleDimensionChange = () => {
        const newWidth = this.getMyWidth();
        const newMode = this.getViewMode(newWidth);
        const oldMode = this.getViewMode(this.state.width);

        const newStateData = { width: newWidth, height: this.getMyHeight() };

        if (newMode !== oldMode) {
            if (newMode === modes.tablet) {
                if (oldMode === modes.phone) {
                    newStateData.leftMenuOpen = true;
                    newStateData.leftMenuExpanded = false;
                    newStateData.rightMenuOpen = false;
                    newStateData.rightMenuExpanded = false;
                } else if (this.state.leftMenuOpen && this.state.rightMenuOpen) {
                    newStateData.rightMenuOpen = false;
                    newStateData.rightMenuExpanded = false;
                }
            } else if (newMode === modes.phone) {
                newStateData.leftMenuOpen = false;
                newStateData.leftMenuExpanded = false;
                newStateData.rightMenuOpen = false;
                newStateData.rightMenuExpanded = false;
            } else if (newMode === modes.desktop) {
                newStateData.leftMenuOpen = newStateData.rightMenuOpen = true;
            }
        }

        this.setState(newStateData);
        log.debug(this.getMyWidth());
    }

    resetMainContent = (error) => {
        const content = { sections: [] };
        if (error) {
            content.error = error;
        }
        return content;
    }

    showSearch = (typeId) => {
        const type = menuStore.state.types.find(t => t.id === typeId);
        return isDefined(type) && isDefined(type.isSearch);
    }

    toggleLeftMenu = () => {
        const newStateData = {};
        if (!this.state.leftMenuOpen) {
            if (this.getViewMode() === modes.tablet) {
                newStateData.rightMenuOpen = false;
            }
        }
        newStateData.leftMenuOpen = !this.state.leftMenuOpen;
        this.setState(newStateData);
    }

    toggleRightMenu = () => {
        const newStateData = {};
        if (!this.state.rightMenuOpen) {
            if (this.getViewMode() === modes.tablet) {
                newStateData.leftMenuOpen = false;
            }
        }
        newStateData.rightMenuOpen = !this.state.rightMenuOpen;
        this.setState(newStateData);
    }

    toggleLeftMenuExpanded = () => {
        this.setState({ leftMenuExpanded: !this.state.leftMenuExpanded });
    }
    toggleRightMenuExpanded = () => {
        this.setState({ rightMenuExpanded: !this.state.rightMenuExpanded });
    }

    handleItemUpdate = (value) => {
        if (this.getViewMode() === modes.phone) {
            this.setState({ leftMenuOpen: false });
        }
        userActions.setItem(value);
    }

    handleSearchItemUpdate = (value) => {
        if (this.getViewMode() === modes.phone) {
            this.setState({ leftMenuOpen: false });
        }
        userActions.setSearchItem(value);
    }

    handleSectionElementClick = (elementData) => {
        userActions.switchContent(elementData);
    }

    toggleMobileMenu = (event, value) => {
        if (value === 'M') {
            this.toggleLeftMenu();
        } else {
            this.toggleRightMenu();
        }
    }

    render() {
        const groupMenuVisible = this.groupMenuIsVisible();
        const itemsMenuVisible = this.itemMenuIsVisible(groupMenuVisible);
        const menuItems = this.getMenuItems(groupMenuVisible, itemsMenuVisible);
        const groupMenuItems = this.getGroupMenuItems(groupMenuVisible);

        let mainContentPaddingLeft;
        if (this.state.leftMenuOpen) {
            if (this.state.leftMenuExpanded) {
                mainContentPaddingLeft = mainContentPadding + LeftMenuWidthExpanded;
            } else {
                mainContentPaddingLeft = LeftMenuWidthOnOpen + mainContentPadding;
            }
        } else {
            mainContentPaddingLeft = LeftMenuWidthOnClose + mainContentPadding;
        }

        let mainContentPaddingRight;
        if (this.state.rightMenuOpen) {
            if (this.state.rightMenuExpanded) {
                mainContentPaddingRight = mainContentPadding + RightMenuWidthExpanded;
            } else {
                mainContentPaddingRight = RigthMenuWidthOnOpen + mainContentPadding;
            }
        } else {
            mainContentPaddingRight = RigthMenuWidthOnClose + mainContentPadding;
        }

        const viewMode = this.getViewMode(this.state.width);
        const mainContentStyle = viewMode !== modes.phone ? { paddingLeft: mainContentPaddingLeft, paddingRight: mainContentPaddingRight, paddingTop: mainContentPadding - 10, paddingBottom: mainContentPadding } : { padding: mainContentPadding, paddingTop: mainContentPadding + mainContentTopPaddingPhone };

        const LeftMenuShowButton = (viewMode !== modes.phone ?
        (
            <div style={{ position: 'fixed', overflow: 'hidden', top: 50, left: 0 }}>
                <IconButton onClick={this.toggleLeftMenu} >
                    <FontIcon className="material-icons" color={AppTheme.fontIcon.color}>keyboard_arrow_right</FontIcon>
                </IconButton>
            </div>
        ) : null);

        const RightMenuShowButton = (viewMode !== modes.phone ?
        (
            <div style={{ position: 'fixed', overflow: 'hidden', top: 50, right: 0 }}>
                <IconButton onClick={this.toggleRightMenu} >
                    <FontIcon className="material-icons" color={AppTheme.fontIcon.color}>keyboard_arrow_left</FontIcon>
                </IconButton>
            </div>
        ) : null);

        const mobileMenu = (viewMode === modes.phone ?
        (
            <TbcMobileMenu
                onSelection={this.toggleMobileMenu}
            />
        ) : null);


        return (
            <MuiThemeProvider muiTheme={AppTheme}>
                <div>
                    <HeaderBar />
                    {mobileMenu}

                    <div className="content-body">
                        <MenuContainer
                            open={this.state.leftMenuOpen}
                            expanded={this.state.leftMenuExpanded}
                            width={LeftMenuWidthOnOpen}
                            expandedWidth={LeftMenuWidthExpanded}
                            onHide={this.toggleLeftMenu}
                            onExpandedChange={this.toggleLeftMenuExpanded}
                            onHome={userActions.reset}
                            docked={viewMode !== modes.phone}
                        >

                            <TbcMenuContent
                                typeMenuItems={menuStore.state.types}
                                groupMenuItems={groupMenuItems}
                                itemMenuItems={menuItems}
                                searchItemMenuItems={menuStore.state.searchData}
                                itemsFilter={this.state.itemsFilter}
                                typeValue={this.state.typeMenuValue}
                                groupValue={this.state.groupMenuValue}
                                itemValue={this.state.itemMenuValue}
                                searchItemValue={this.state.searchItemMenuValue}
                                onTypeUpdate={userActions.setType}
                                onGroupUpdate={userActions.setGroup}
                                onItemUpdate={this.handleItemUpdate}
                                onSearchItemUpdate={this.handleSearchItemUpdate}
                                typeMenuLabel={{ empty: 'Browse By Type', filled: 'Type' }}
                                groupMenuLabel={{ empty: 'Select Group', filled: 'Group' }}
                                onFilterListValues={userActions.filterItems}
                                searchValue={this.state.searchValue}
                                onSearch={userActions.search}
                                showSearch={this.showSearch(this.state.typeMenuValue)}
                                groupMenuIsVisible={groupMenuVisible}
                                itemMenuIsVisible={itemsMenuVisible}
                                appHeight={this.state.height}
                                menuIsExtended={this.state.leftMenuOpen && this.state.leftMenuExpanded}
                            />

                        </MenuContainer>

                        {LeftMenuShowButton}

                        <MainContent
                            style={mainContentStyle}
                            sectionsData={this.state.mainContent.sections}
                            header={this.state.mainContent.header}
                            subHeader={this.state.mainContent.subHeader}
                            onSectionElementClick={this.handleSectionElementClick}
                            error={this.state.mainContent.error}
                            initialState={this.state.initialRun}
                            viewMode={viewMode}
                            waitingForContent={this.state.waitingForContent}
                        />

                        { false && // disabled for now
                            <MenuContainer open={this.state.rightMenuOpen} expanded={this.state.rightMenuExpanded} width={RigthMenuWidthOnOpen} expandedWidth={RightMenuWidthExpanded} onHide={this.toggleRightMenu} onExpandedChange={this.toggleRightMenuExpanded} openRight={viewMode !== modes.phone} docked={viewMode !== modes.phone} showHomeButton={false}>
                                <TbcWHOMenuContent
                                    categoriesMenu={this.props.WHOData.categoriesMenu}
                                    referencesMenu={this.props.WHOData.referencesMenu}
                                    references={this.props.WHOData.references}
                                    aboutWHOreferences={this.props.WHOData.aboutWHOreferences}
                                    isMobileView={viewMode === modes.phone}
                                    menuIsExtended={this.state.rightMenuOpen && this.state.rightMenuExpanded}
                                    appHeight={this.state.height}
                                />
                            </MenuContainer>
                        }

                        {RightMenuShowButton}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}


export default App;