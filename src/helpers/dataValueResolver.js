/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable consistent-return */

import moment from 'moment';
import log from 'loglevel';
import { isDefined, isArray, isString, isBoolean } from 'd2-utilizr';
import { configCodes, delimiters, booleanValues } from '../constants/configConstants';

export default class dataValueResolver {

    static getDataValueFromRootData(fieldConfig, sectionConfig, rootData) {
        return this.getDataValue(fieldConfig, this.getContainerData(rootData, sectionConfig, fieldConfig));
    }

    static getContainerData(rootData, sectionConfig, fieldConfig = {}) {
        let containerData;

        if (isDefined(fieldConfig.containerProperty)) {
            if (fieldConfig.containerProperty === configCodes.main) {
                containerData = rootData;
            } else {
                containerData = this.getPropValueFromString(rootData, fieldConfig.containerProperty);
            }
        } else if (isDefined(sectionConfig.containerProperty)) {
            containerData = this.getPropValueFromString(rootData, sectionConfig.containerProperty);
        } else {
            containerData = rootData;
        }

        return containerData;
    }

    static getDataValue(fieldConfig, containerData) {
        const valueSpecDelimiter = delimiters.valueSpecDelimiter || '#';

        let dataProp = fieldConfig.dataProp;
        let valueSpec;

        const valueSpecIndex = dataProp.indexOf(valueSpecDelimiter);
        if (valueSpecIndex >= 0) {
            [dataProp, valueSpec] = dataProp.split(valueSpecDelimiter);
        }

        const dataValue = this.getPropValueFromString(containerData, dataProp);

        return this.getStringValue(dataValue, fieldConfig, valueSpec);
    }

    static getOnClickData(clickConfig, containerData) {
        const idValue = this.getPropValueFromString(containerData, clickConfig.idProp);
        if (!idValue) {
            return;
        }

        const type = clickConfig.itemType || this.getPropValueFromString(containerData, clickConfig.typeProp);
        if (!type) {
            return;
        }

        return { id: idValue, itemType: type };
    }

    static getPropValueFromString(dataObject, propString) {
        const propertyDelimiter = delimiters.propertyDelimiter || '.';

        if (propString.includes(propertyDelimiter)) {
            const properties = propString.split(propertyDelimiter);
            const propValue = properties.reduce((data, propName) => (isDefined(data) ? data[propName] : data), dataObject);
            return propValue;
        }
        return dataObject[propString];
    }

    static getStringValue(value, config = {}, valueSpec) {
        if (!isDefined(value) || (isArray(value) && value.length === 0)) {
            if (config.defaultValue) {
                return config.defaultValue;
            }
            return value;
        }

        if (isArray(value)) {
            if (valueSpec) {
                const stringArray = [];
                value.forEach((obj) => {
                    let v = obj && obj[valueSpec];
                    if (isDefined(v)) {
                        v = this.formatValue(v, config.format);
                        stringArray.push(v);
                    }
                });
                return stringArray.join(', ');
            }

            return value.map(v => this.formatValue(v, config.format)).join(', ');
        }

        return this.formatValue(value, config.format);
    }

    static formatValue(value, formatConfig) {
        if (formatConfig) {
            if (formatConfig.translateData) {
                return (this.translate(value) || value);
            }

            if (value === 0 && formatConfig.zeroValue) {
                return formatConfig.zeroValue;
            } else if (formatConfig.type && formatConfig.type.toUpperCase() === 'DATE') {
                return moment(value).format('LL');
            }
        }

        if (isBoolean(value)) {
            return (value ? booleanValues.true : booleanValues.false);
        }

        if (!isString(value)) {
            return value.toString();
        }

        return value;
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
