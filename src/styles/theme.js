/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import {
    blue700,
    blue500,
    blue100,
    orange500,
    orange300,
    grey500,
    darkBlack,
    white,
    grey100,
    grey400 }
    from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import Spacing from 'material-ui/styles/spacing';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const theme = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: blue700,
        primary2Color: blue500,
        primary3Color: blue100,
        accent1Color: orange500,
        accent2Color: orange300,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: grey100,
        borderColor: grey400,
        disabledColor: fade(darkBlack, 0.3),
    },
};

const muiTheme = getMuiTheme(theme, { zIndex: { drawer: 14, drawerOverlay: 13 } });

const customStyles = {
    headerFontSize: 15,
    tableHeaderFontSize: 15,
    headerPaddingTop: 5,
    headerPaddingBottom: 5,
    cellPaddingTop: 5,
    cellPaddingBottom: 5,
    cellPaddingLeft: 15,
    cellPaddingRight: 15,
};


export default Object.assign({}, muiTheme, {
    paper: Object.assign({}, muiTheme.paper, { backgroundColor: white }),
    forms: {
        minWidth: 350,
        maxWidth: 750,
    },
    formInput: {
        fontWeight: 100,
    },
    menuContainer: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingBottom: 10,
        paddingTop: 0,
        bannerHeight: 44,
        zIndex: 14,
    },
    bsGridCell: {
        borderBottom: '1px solid',
        borderColor: theme.palette.primary3Color,
        labelBackgroundColor: theme.palette.primary2Color,
        labelColor: theme.palette.alternateTextColor,
        paddingTop: customStyles.cellPaddingTop,
        paddingBottom: customStyles.cellPaddingBottom,
    },
    sectionWrapper: {
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 30,
    },
    sectionHeader: {
        fontSize: customStyles.headerFontSize,
        color: theme.palette.alternateTextColor,
        backgroundColor: theme.palette.primary1Color,
        paddingTop: customStyles.headerPaddingTop,
        paddingBottom: customStyles.headerPaddingBottom,
    },
    tableDiv: {
        overflowX: 'auto',
    },
    table: {
        backgroundColor: 'inherit',
        width: 'inherit',
        minWidth: '100%',
    },
    tableHeader: {
        backgroundColor: theme.palette.primary1Color,
    },
    tableHeaderRow: {
        height: 'inherit',
        backgroundColor: theme.palette.primary1Color,
    },
    tableHeaderColumn: {
        textAlign: 'left',
        fontSize: customStyles.tableHeaderFontSize,
        color: theme.palette.alternateTextColor,
        paddingTop: customStyles.headerPaddingTop,
        paddingBottom: customStyles.headerPaddingBottom,
        paddingLeft: customStyles.cellPaddingLeft,
        paddingRight: customStyles.cellPaddingRight,
        textOverflow: 'clip',
        height: 'inherit',
    },
    tableRow: {
        borderBottom: '1px solid',
        borderColor: theme.palette.primary3Color,
    },
    tableCell: {
        paddingTop: customStyles.cellPaddingTop,
        paddingBottom: customStyles.cellPaddingBottom,
        height: 'inherit',
        whiteSpace: 'normal',
        paddingLeft: customStyles.cellPaddingLeft,
        paddingRight: customStyles.cellPaddingRight,
        fontSize: 14,
    },
    dynamicLoadingListContainer: {
    },
    dynamicLoadingListItem: {
    },
    dynamicLoadingListTextContainer: {
        paddingLeft: 2,
    },
    subHeader: {
        color: theme.palette.accent3Color,
    },
    searchableList: {
        borderColor: theme.palette.borderColor,
    },
    fontIcon: {
        color: theme.palette.accent2Color,
    },
    infoIcon: {
        color: theme.palette.primary2Color,
    },
    whoReferenceLabel: {
        fontWeight: 'bold',
    },
    labelShapes: {
        fill: '#276696',
        textColor: theme.palette.alternateTextColor,
        borderColor: theme.palette.primary3Color,
    },
});
