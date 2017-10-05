/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-param-reassign */

import log from 'loglevel';
import { isDefined } from 'd2-utilizr';
import dataValueResolver from './dataValueResolver';

export default class WHOMenuBuilder {
    static build(data, whoConfig) {
        if (!data) {
            log.debug('no WHO-data');
            return {};
        }

        this.preProcessData(data);
        this.preProcessAttributes(data);
        return this.buildMenu(data, whoConfig);
    }

    static preProcessData(data) {
        const groupsForIndicators = new Map();
        const groups = new Map();

        const srcIndicatorGroups = data.indicatorGroups;

        if (srcIndicatorGroups) {
            srcIndicatorGroups.forEach((g) => {
                const gId = g.id;
                const gName = g.name;
                if (!gId) {
                    log.debug(`Skipping group without id: ${JSON.stringify(g)}`);
                } else if (!gName) {
                    log.debug(`Skipping group without name: ${JSON.stringify(g)}`);
                } else {
                    if (!groups.has(gId)) {
                        groups.set(gId, g);
                    }
                    const srcIndicators = g.indicators;
                    if (srcIndicators) {
                        srcIndicators.forEach((i) => {
                            const iId = i.id;
                            if (!iId) {
                                log.debug(`Skipping groupIndicator without id: ${JSON.stringify(i)}`);
                            } else {
                                const indicatorGroups = groupsForIndicators.has(iId) ? groupsForIndicators.get(iId) : groupsForIndicators.set(iId, new Set()).get(iId);
                                indicatorGroups.add(gId);
                            }
                        });
                    }
                }
            });
        }

        data.groupsForIndicators = groupsForIndicators;
        data.groups = groups;
    }

    static preProcessAttributes(data) {
        const attributes = new Map();

        const srcAttributes = data.attributes;
        if (srcAttributes) {
            srcAttributes.forEach((a) => {
                const aId = a.id;
                if (!aId) {
                    log.debug(`Skipping attribute without id: ${JSON.stringify(a)}`);
                } else if (!attributes.has(aId)) {
                    attributes.set(a.id, a);
                }
            });
        }

        data.attributes = attributes;
    }

    static buildMenu(data, config) {
        const unspecifiedGroup = { id: '#Unspecified#', text: 'Unspecified' };

        const categories = new Map();
        const referencesMenu = {};
        const references = {};

        if (data.indicators) {
            data.indicators.forEach((i) => {
                const iId = i.id;
                const iName = i.name;
                if (!iId) {
                    log.debug(`Skipping indicator without id: ${JSON.stringify(i)}`);
                } else if (!iName) {
                    log.debug(`Skipping indicator without name: ${JSON.stringify(i)}`);
                } else {
                    const indicatorGroups = data.groupsForIndicators.get(iId);
                    if (!indicatorGroups) {
                        if (!categories.has(unspecifiedGroup.id)) {
                            categories.set(unspecifiedGroup.id, unspecifiedGroup);
                        }

                        if (!referencesMenu[unspecifiedGroup.id]) {
                            referencesMenu[unspecifiedGroup.id] = [];
                        }

                        referencesMenu[unspecifiedGroup.id].push({ id: iId, text: iName });

                        references[iId] = this.buildReference(i, config, data.attributes);
                    } else {
                        indicatorGroups.forEach((ig) => {
                            if (!categories.has(ig)) {
                                const category = data.groups.get(ig);
                                categories.set(ig, { id: category.id, text: category.name });
                            }

                            if (!referencesMenu[ig]) {
                                referencesMenu[ig] = [];
                            }

                            referencesMenu[ig].push({ id: iId, text: iName });

                            references[iId] = this.buildReference(i, config, data.attributes);
                        });
                    }
                }
            });
        }

        let categoriesArray = Array.from(categories.values());
        categoriesArray = this.sortArrayWithObjects(categoriesArray, 'text');

        Object.keys(referencesMenu).forEach((menuItem) => {
            this.sortArrayWithObjects(referencesMenu[menuItem], 'text');
        });

        return { categoriesMenu: categoriesArray, referencesMenu, references };
    }

    static sortArrayWithObjects(array, sortProp) {
        array.sort((a, b) => {
            if (a[sortProp] < b[sortProp]) {
                return -1;
            } else if (a[sortProp] > b[sortProp]) {
                return 1;
            }
            return 0;
        });
        return array;
    }

    static buildReference(refData, config, attributesMap) {
        let refArray = [];

        config.fields.forEach((cf) => {
            const value = dataValueResolver.getDataValue(cf, refData);
            if (value) {
                if (cf.label) {
                    refArray.push({ value: this.translate(cf.label), isLabel: true });
                }
                refArray.push({ value, isLink: cf.isLink });
            }
        });

        const attributeArray = [];
        if (refData.attributeValues) {
            refData.attributeValues.forEach((av) => {
                if (isDefined(av.value)) {
                    const attId = av.attribute && av.attribute.id;
                    if (attId) {
                        const attributeSpec = attributesMap.get(attId);
                        if (attributeSpec && attributeSpec.name) {
                            attributeArray.push({ value: attributeSpec.name, isLabel: true });
                        }
                        attributeArray.push({ value: av.value });
                    }
                }
            });
        }

        if (attributeArray.length > 0) {
            refArray.push({ isDivider: true });
            refArray = refArray.concat(attributeArray);
        }

        return refArray;
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
