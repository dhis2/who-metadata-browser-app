/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-param-reassign */

import log from 'loglevel';
import { isDefined, isObject } from 'd2-utilizr';
import ModelCollection from 'd2/lib/model/ModelCollection';
import dataValueResolver from './dataValueResolver';
import { runTypeConstants } from '../constants/configConstants';
import sectionTableConstants from '../components/SectionTable/SectionTable.constants';

export default class dataBuilders {

    static buildBsGridDataFromFields(data, sectionConfig) {
        function addColConfigIfFound(colConfig, cellConfig, option) {
            if (isDefined(colConfig[option])) {
                if (isDefined(cellConfig.label)) {
                    cellConfig.label[option] = colConfig[option][0];
                    cellConfig.data[option] = colConfig[option][1];
                } else {
                    cellConfig.data[option] = colConfig[option];
                }
            }
        }

        const fieldsConfig = sectionConfig.fields;
        const gridData = {};
        gridData.header = sectionConfig.header;
        const cells = [];

        fieldsConfig.forEach(((fc) => {
            const cellConfigs = { data: {} };
            let label;

            if (isDefined(fc.label)) {
                label = this.translate(fc.label);
                cellConfigs.label = {};
            }

            if (isDefined(fc.colConfig)) {
                addColConfigIfFound(fc.colConfig, cellConfigs, 'xs');
                addColConfigIfFound(fc.colConfig, cellConfigs, 'sm');
                addColConfigIfFound(fc.colConfig, cellConfigs, 'md');
                addColConfigIfFound(fc.colConfig, cellConfigs, 'lg');
                addColConfigIfFound(fc.colConfig, cellConfigs, 'className');
            }

            if (isDefined(label)) {
                cells.push(Object.assign({}, cellConfigs.label, { isLabel: true, value: label }));
            }
            cells.push(Object.assign({}, cellConfigs.data, { value: dataValueResolver.getDataValueFromRootData(fc, sectionConfig, data) }));
        }));

        gridData.body = [cells];
        return gridData;
    }

    static buildBsGridDataFromList(data, config) {
        const listConfig = config.list;
        const gridData = {};

        gridData.header = config.header;

        if (isDefined(data[listConfig.listProp])) {
            const dataList = data[listConfig.listProp];

            let labelPropA = [listConfig.labelProp];
            if (listConfig.labelProp.includes('.')) {
                labelPropA = listConfig.labelProp.split('.');
            }

            const labelPropName = labelPropA.reduce((accDef, propName, index) => {
                if (index > 0) {
                    accDef += '.';
                }
                accDef += propName;
                return accDef;
            }, '');

            gridData.body = dataList.map((i) => {
                const row = [];
                row.push({ sm: 4, value: dataValueResolver.getPropValueFromString(i, labelPropName), isLabel: true });
                row.push({ sm: 8, value: i[listConfig.dataProp] });
                return row;
            });
        }

        return gridData;
    }

    static buildTableData(data, config, runType) {
        const tableData = {};

        const dataSrc = dataValueResolver.getContainerData(data, config);
        const tableConfig = config.table;

        let dataSrcA = [];

        if (isObject(dataSrc)) {
            if (dataSrc instanceof ModelCollection) {
                dataSrcA = Array.from(dataSrc).map(el => el[1]);
            } else {
                dataSrcA = dataSrc.data;
                const metaData = dataSrc.metaData;
                tableConfig.forEach((tc) => {
                    if (metaData[tc.header]) {
                        tc.header = metaData[tc.header].label;
                    }
                    if (metaData[tc.dataProp]) {
                        tc.dataProp = metaData[tc.dataProp].id;
                    }
                });
            }
        } else if (isDefined(dataSrc)) {
            dataSrcA = dataSrc;
        }

        let mergeFound = false;
        tableData.body = dataSrcA.map(srcData => tableConfig.map((cellConfig) => {
            if (isDefined(cellConfig.mergeEqual) && cellConfig.mergeEqual === true) {
                mergeFound = true;
            }

            let value;
            let onClickData;
            if (isDefined(cellConfig.dataFromExtension) && cellConfig.dataFromExtension === true && runType === runTypeConstants.init) {
                value = sectionTableConstants.waiting;
            } else {
                value = dataValueResolver.getDataValue(cellConfig, srcData);
                if (cellConfig.clickable) {
                    onClickData = dataValueResolver.getOnClickData(cellConfig.clickable, srcData);
                }
            }

            return { value, onClickData };
        }));

        if (mergeFound) {
            this.mergeTableCells(tableData.body, tableConfig);
        }

        tableData.header = tableConfig.map(tc => (!tc.skipHeaderTranslate ? this.translate(tc.header) : tc.header));
        tableData.colWidth = tableConfig.map(tc => tc.width);
        return tableData;
    }

    static mergeTableCells(rows, tableConfig) {
        for (let i = tableConfig.length - 1; i >= 0; i--) {
            const cellConfig = tableConfig[i];
            if (isDefined(cellConfig.mergeEqual) && cellConfig.mergeEqual === true) {
                let firstMergeRow = -1;
                rows.forEach((rowData, index, allRows) => {
                    if (index > 0) {
                        const prevValue = allRows[index - 1][i].value;
                        if (prevValue && prevValue === rowData[i].value) {
                            if (firstMergeRow < 0) {
                                firstMergeRow = index - 1;
                            }

                            if (index === (allRows.length - 1)) {
                                Object.assign(allRows[firstMergeRow][i], { rowSpan: index - firstMergeRow + 1 });

                                for (let rowLoopIndex = firstMergeRow + 1; rowLoopIndex <= index; rowLoopIndex++) {
                                    allRows[rowLoopIndex].splice(i, 1);
                                }

                                firstMergeRow = -1;
                            }
                        } else if (firstMergeRow >= 0) {
                            Object.assign(allRows[firstMergeRow][i], { rowSpan: index - firstMergeRow });

                            for (let rowLoopIndex = firstMergeRow + 1; rowLoopIndex < index; rowLoopIndex++) {
                                allRows[rowLoopIndex].splice(i, 1);
                            }

                            firstMergeRow = -1;
                        }
                    }
                });
            }
        }
    }

    static translate(text) {
        let translatedText;
        if (!this.translator) {
            log.debug('Please set translator before building component data');
            translatedText = text;
        } else if (this.translator.getTranslation) {
            translatedText = this.translator.getTranslation(text);
        } else {
            translatedText = this.translator(text);
        }

        return translatedText;
    }
}

dataBuilders.translator = (text) => {
    log.debug('Please set translator before building component data');
    return text;
};
