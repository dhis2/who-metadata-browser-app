/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import { configCodes, extensionConstants, itemTypes } from './constants/configConstants';

export const modelsConfig = {
    indicators: {
        label: 'Indicators',
        menu: {
            fields: 'id, displayName',
            order: 'displayName:asc',
            id: 'id',
            text: 'displayName',
            groups: {
                name: 'indicatorGroups',
                id: 'id',
                text: 'displayName',
                fields: 'id, displayName',
                order: 'displayName:asc',
            },
        },
        content: {
            mainDataModel: 'indicator',
            headerProp: 'displayName',
            headerSubText: 'Indicator',
            sections: [
                {
                    name: 'basic',
                    fields: [
                        {
                            dataProp: 'displayName', label: 'name', colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'displayShortName', label: 'shortname', colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'code', label: 'code', colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'id', label: 'uid', colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'displayDescription', label: 'description', colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'created', label: 'created', colConfig: { sm: [2, 4] }, format: { type: 'Date' },
                        },
                        {
                            dataProp: 'lastUpdated',
                            label: 'lastUpdated',
                            colConfig: { sm: [2, 4] },
                            format: { type: 'Date' },
                        },
                    ],
                },
                {
                    name: 'attributes',
                    header: 'Attributes',
                    list: {
                        listProp: 'attributeValues',
                        labelProp: 'attribute.displayName',
                        dataProp: 'value',
                    },
                },
                {
                    name: 'indicatorDefinitions',
                    getContentFunc: 'getIndicatorDefinitionData',
                    containerProperty: 'indicatorDefs',
                    header: 'Indicator definition',
                    fields: [
                        {
                            dataProp: 'displayName', label: 'type', colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'factor', label: 'factor', colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'numeratorDescription',
                            label: 'numerator',
                            containerProperty: configCodes.main,
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'numeratorExpression', colConfig: { sm: 6, className: 'left-border' },
                        },
                        {
                            dataProp: 'denominatorDescription',
                            label: 'denominator',
                            containerProperty: configCodes.main,
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'denominatorExpression', colConfig: { sm: 6, className: 'left-border' },
                        },
                    ],
                },
                {
                    name: 'sourceData',
                    getContentFunc: 'getIndicatorSourceData',
                    containerProperty: 'sourceDefs',
                    table: [
                        {
                            header: 'dataElement',
                            dataProp: 'dataElementName',
                            clickable: { itemType: itemTypes.dataElement, idProp: 'dataElementId' },
                            mergeEqual: true,
                            width: '30%',
                        },
                        {
                            header: 'dataSet',
                            dataProp: 'dataSetName',
                            clickable: { itemType: itemTypes.dataSet, idProp: 'dataSetId' },
                            width: '30%',
                        },
                        { header: 'frequency', dataProp: 'frequency', width: '15%' },
                        { header: 'expectedReports', dataProp: 'expectedReports', width: '25%' },
                    ],
                },
                {
                    id: 'summaryData',
                    name: 'summaryData',
                    getFinalContentFunc: 'getIndicatorSummaryData',
                    loadContentAsExtension: extensionConstants.yes,
                    containerProperty: 'summaryDefs',
                    table: [
                        {
                            header: 'variable',
                            dataProp: 'variableName',
                            clickable: { typeProp: 'metaData.typeName', idProp: 'metaData.id' },
                            width: '25%',
                        },
                        { header: 'type', dataProp: 'typeName', width: '15%' },
                        { header: 'orgUnit', dataProp: 'orgUnitName', width: '15%' },
                        {
                            header: configCodes.twoYearsAgo,
                            dataProp: configCodes.twoYearsAgo,
                            skipHeaderTranslate: true,
                            width: '15%',
                            dataFromExtension: true,
                        },
                        {
                            header: configCodes.lastYear,
                            dataProp: configCodes.lastYear,
                            skipHeaderTranslate: true,
                            width: '15%',
                            dataFromExtension: true,
                        },
                        {
                            header: configCodes.currentYear,
                            dataProp: configCodes.currentYear,
                            skipHeaderTranslate: true,
                            width: '15%',
                            dataFromExtension: true,
                        },
                    ],
                },
            ],
        },

    },
    dataElements: {
        label: 'Data Elements',
        menu: {
            fields: 'id, displayName',
            order: 'displayName:asc',
            id: 'id',
            text: 'displayName',
            groups: {
                name: 'dataElementGroups',
                id: 'id',
                text: 'displayName',
                fields: 'id, displayName',
                order: 'displayName:asc',
            },
        },
        content: {
            mainDataModel: 'dataElement',
            headerProp: 'displayName',
            headerSubText: 'Data Element',
            mainDataFieldsQuery: ':all,optionSet[id,displayName],attributeValues[id,value,attribute[id,displayName]],categoryCombo[id,displayName,categories[id,displayName,categoryOptions[id,displayName]]],dataSetElements[dataSet[id,displayName,periodType,organisationUnits::size]]',
            sections: [
                {
                    name: 'basic',
                    fields: [
                        {
                            dataProp: 'displayName',
                            label: 'name',
                            colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'displayShortName',
                            label: 'shortname',
                            colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'formName',
                            label: 'formName',
                            colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'code',
                            label: 'code',
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'id',
                            label: 'uid',
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'displayDescription',
                            label: 'description',
                            colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'domainType',
                            label: 'domainType',
                            colConfig: { sm: [2, 4] },
                            format: { translateData: true },
                        },
                        {
                            dataProp: 'valueType',
                            label: 'valueType',
                            colConfig: { sm: [2, 4] },
                            format: { translateData: true },
                        },
                        {
                            dataProp: 'aggregationType',
                            label: 'aggregationType',
                            colConfig: { sm: [2, 4] },
                            format: { translateData: true },
                        },
                        {
                            dataProp: 'zeroIsSignificant',
                            label: 'storeZeroValues',
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'categoryCombo.displayName',
                            label: 'categoryCombination',
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'optionSet.displayName',
                            label: 'optionSet',
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'aggregationLevels',
                            label: 'aggregationLevels',
                            colConfig: { sm: [2, 10] },
                            defaultValue: 'N/A',
                        },
                        {
                            dataProp: 'created',
                            label: 'created',
                            colConfig: { sm: [2, 4] },
                            format: { type: 'Date' },
                        },
                        {
                            dataProp: 'lastUpdated',
                            label: 'lastUpdated',
                            colConfig: { sm: [2, 4] },
                            format: { type: 'Date' },
                        },
                    ],
                },
                {
                    name: 'attributes',
                    header: 'Attributes',
                    list: {
                        listProp: 'attributeValues',
                        labelProp: 'attribute.displayName',
                        dataProp: 'value',
                    },
                },
                {
                    name: 'category',
                    containerProperty: 'categoryCombo.categories',
                    table: [
            { header: 'category', dataProp: 'displayName', width: '50%' },
            { header: 'options', dataProp: 'categoryOptions#displayName', width: '50%' },
                    ],
                },
                {
                    name: 'dataset',
                    containerProperty: 'dataSetElements',
                    table: [
                        {
                            header: 'dataSet',
                            dataProp: 'dataSet.displayName',
                            clickable: { itemType: itemTypes.dataSet, idProp: 'dataSet.id' },
                            width: '45%',
                        },
                        {
                            header: 'frequency',
                            dataProp: 'dataSet.periodType',
                            width: '30%',
                        },
                        {
                            header: 'expectedReports',
                            dataProp: 'dataSet.organisationUnits',
                            width: '25%',
                        },
                    ],
                },
                {
                    name: 'Related Indicators',
                    containerProperty: 'relatedIndicators',
                    getContentFunc: 'getDataElementRelatedIndicators',
                    table: [
                        {
                            header: 'relatedIndicators',
                            dataProp: 'displayName',
                            clickable: { itemType: itemTypes.indicator, idProp: 'id' },
                            width: '100%',
                        },
                    ],
                },
                {
                    name: 'summaryDataDataElements',
                    id: 'summaryData',
                    getContentFunc: 'getDataElementSummaryData',
                    containerProperty: 'summaryDefs',
                    loadContentAsExtension: extensionConstants.yes,
                    table: [
                        {
                            header: 'variable',
                            dataProp: 'variableName',
                            clickable: { typeProp: 'metaData.typeName', idProp: 'metaData.id' },
                            width: '25%',
                        },
                        {
                            header: 'type',
                            dataProp: 'typeName',
                            width: '15%',
                        },
                        {
                            header: 'orgUnit',
                            dataProp: 'orgUnitName',
                            width: '15%',
                        },
                        {
                            header: configCodes.twoYearsAgo,
                            dataProp: configCodes.twoYearsAgo,
                            skipHeaderTranslate: true,
                            dataFromExtension: true,
                            width: '15%',
                        },
                        {
                            header: configCodes.lastYear,
                            dataProp: configCodes.lastYear,
                            skipHeaderTranslate: true,
                            dataFromExtension: true,
                            width: '15%',
                        },
                        {
                            header: configCodes.currentYear,
                            dataProp: configCodes.currentYear,
                            skipHeaderTranslate: true,
                            dataFromExtension: true,
                            width: '15%',
                        },
                    ],
                },
            ],
        },
    },
    dataSets: {
        label: 'Data Sets',
        menu: {
            fields: 'id, displayName',
            order: 'displayName:asc',
            id: 'id',
            text: 'displayName',
        },
        content: {
            mainDataModel: 'dataSet',
            headerProp: 'displayName',
            headerSubText: 'Data Set',
            mainDataFieldsQuery: ':all,categoryCombo[id,displayName],attributeValues[value,attribute[displayName]],dataSetElements[dataElement[id,displayName]],indicators[id,displayName]',
            sections: [
                {
                    name: 'basic',
                    fields: [
                        {
                            dataProp: 'displayName', label: 'name', colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'displayShortName', label: 'shortname', colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'code', label: 'code', colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'id', label: 'uid', colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'displayDescription', label: 'description', colConfig: { sm: [2, 10] },
                        },
                        {
                            dataProp: 'periodType', label: 'frequency', colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'timelyDays', label: 'timelySubmissionDays', colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'expiryDays',
                            label: 'expiryDays',
                            colConfig: { sm: [2, 4] },
                            format: { zeroValue: 'Disabled' },
                        },
                        {
                            dataProp: 'categoryCombo.displayName',
                            label: 'categoryCombination',
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'validCompleteOnly',
                            label: 'validRequiredForCompletion',
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'noValueRequiresComment',
                            label: 'commentRequiredOnCompleteWithMissingValue',
                            colConfig: { sm: [2, 4] },
                        },
                        {
                            dataProp: 'created',
                            label: 'created',
                            colConfig: { sm: [2, 4] },
                            format: { type: 'Date' },
                        },
                        {
                            dataProp: 'lastUpdated',
                            label: 'lastUpdated',
                            colConfig: { sm: [2, 4] },
                            format: { type: 'Date' },
                        },
                    ],
                },
                {
                    name: 'attributes',
                    header: 'Attributes',
                    list: {
                        listProp: 'attributeValues',
                        labelProp: 'attribute.displayName',
                        dataProp: 'value',
                    },
                },
                {
                    name: 'dataElements',
                    containerProperty: 'dataSetElements',
                    table: [
                        {
                            header: 'dataElements',
                            dataProp: 'dataElement.displayName',
                            clickable: { itemType: itemTypes.dataElement, idProp: 'dataElement.id' },
                            width: '100%',
                        },
                    ],
                },
                {
                    name: 'indicators',
                    containerProperty: 'indicators',
                    table: [
                        {
                            header: 'indicators',
                            dataProp: 'displayName',
                            clickable: { itemType: itemTypes.indicator, idProp: 'id' },
                            width: '100%',
                        },
                    ],
                },
                {
                    name: 'summaryDataSet',
                    id: 'summaryData',
                    getContentFunc: 'getDataSetSummaryData',
                    loadContentAsExtension: extensionConstants.yes,
                    containerProperty: 'summaryDefs',
                    table: [
                        {
                            header: 'datasetCompleteness',
                            dataProp: 'variableName',
                            width: '30%',
                        },
                        {
                            header: 'orgUnit',
                            dataProp: 'orgUnitName',
                            width: '25%',
                        },
                        {
                            header: configCodes.twoYearsAgo,
                            dataProp: configCodes.twoYearsAgo,
                            skipHeaderTranslate: true,
                            dataFromExtension: true,
                            width: '15%',
                        },
                        {
                            header: configCodes.lastYear,
                            dataProp: configCodes.lastYear,
                            skipHeaderTranslate: true,
                            dataFromExtension: true,
                            width: '15%',
                        },
                        {
                            header: configCodes.currentYear,
                            dataProp: configCodes.currentYear,
                            skipHeaderTranslate: true,
                            dataFromExtension: true,
                            width: '15%',
                        },
                    ],
                },
            ],
        },
    },
};

export const WHOModelsConfig = {
    fields: [
    { label: 'whoName', dataProp: 'name' },
    { label: 'whoShortname', dataProp: 'shortName' },
    { label: 'whoCode', dataProp: 'code' },
    { label: 'whoDescription', dataProp: 'description' },
    { label: 'whoType', dataProp: 'indicatorType.name' },
    { label: 'whoNumerator', dataProp: 'numeratorDescription' },
    { label: 'whoDenominator', dataProp: 'denominatorDescription' },
    { label: 'whoUrl', dataProp: 'url', isLink: true },
    ],
};

export const settings = {
    enableSearch: true,
};
