/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */

// utils
import { isDefined, isArray, isObject } from 'd2-utilizr';
import log from 'loglevel';

// rxJs
import { Observable } from 'rxjs/Observable';
import userActions from './actions/UserActions';
import dispatcherActions from './actions/DispatcherActions';
import menuSelectionStore from './stores/menuSelectionsStore';
import selectedStore from './stores/selectedStore';

// constants
import {
    configCodes,
    extensionConstants,
    runTypeConstants,
    latestUpdateIsInitConstant,
    itemTypes,
    itemValueSeperator,
} from './constants/configConstants';

const menuTypes = {
    type: 'type',
    group: 'group',
    item: 'item',
    itemsFilter: 'itemsFilter',
    search: 'search',
    searchItem: 'searchItem',
    reset: 'reset',
};

const whoMenuTypes = {
    category: 1,
    reference: 2,
};

export default class Dispatcher {

    constructor(configData) {
        this.d2 = configData.d2;
        this.modelsConfig = configData.modelsConfig;
        this.setupCommunication();
    }

    setupCommunication() {
        dispatcherActions.resetContents = userActions.reset.map(() => ({
            menuType: menuTypes.reset,
        }));

        Dispatcher.whoActions();
        this.menuActions();
        this.contentActions();
    }

    static whoActions() {
        dispatcherActions.whoCatSet = userActions.setWHOCategory.map(data => ({
            selection: data.data,
            whoMenuType: whoMenuTypes.category,
        }));

        dispatcherActions.whoRefSet = userActions.setWHOReference.map(data => ({
            selection: data.data,
            whoMenuType: whoMenuTypes.reference,
        }));

        dispatcherActions.WHOMenusChanged = Observable.merge(dispatcherActions.whoCatSet, dispatcherActions.whoRefSet, dispatcherActions.resetContents).map((data) => {
            const whoMenuActions = {
                [whoMenuTypes.category]: () => ({
                    categoryId: data.selection,
                    referenceId: null,
                }),
                [whoMenuTypes.reference]: () => ({
                    categoryId: data.selection.categoryId,
                    referenceId: data.selection.referenceId,

                }),
                [menuTypes.reset]: () => ({
                    categoryId: null,
                    referenceId: null,
                }),
            };

            return whoMenuActions[(data.whoMenuType || data.menuType)]();
        });
    }

    menuActions() {
        dispatcherActions.menuTypeSet = userActions.setType.map(data => ({
            selection: data.data,
            menuType: menuTypes.type,
        }));

        dispatcherActions.menuGroupSet = userActions.setGroup.map(data => ({
            selection: data.data,
            menuType: menuTypes.group,
        }));

        dispatcherActions.menuItemSet = userActions.setItem.map(data => ({
            selection: data.data,
            menuType: menuTypes.item,
        }));

        dispatcherActions.menuItemsFiltered = userActions.filterItems.map(data => ({
            selection: data.data,
            menuType: menuTypes.itemsFilter,
        }));

        dispatcherActions.searched = userActions.search.map(data => ({
            selection: data.data,
            menuType: menuTypes.search,
        }));

        dispatcherActions.searchItemSet = userActions.setSearchItem.map(data => ({
            selection: data.data,
            menuType: menuTypes.searchItem,
        }));

        dispatcherActions.menuSelectionsChanged = Observable.merge(dispatcherActions.menuTypeSet, dispatcherActions.menuGroupSet, dispatcherActions.menuItemSet, dispatcherActions.menuItemsFiltered, dispatcherActions.searched, dispatcherActions.searchItemSet, dispatcherActions.resetContents)
        .map((data) => {
            let newState = menuSelectionStore.getState();
            newState = isDefined(newState) ? newState : {};

            function translateEmptyValuesToNull(value) {
                return ((!isDefined(value) || value === null || value === 'null') ? null : value);
            }

            const oldItem = translateEmptyValuesToNull(newState[menuTypes.item]);
            const oldItemSub = translateEmptyValuesToNull(newState.itemSub);
            const oldSearchItem = translateEmptyValuesToNull(newState[menuTypes.searchItem]);

            switch (data.menuType) {
            case menuTypes.reset:
                newState[menuTypes.type] = 'null';
                newState[menuTypes.group] = 'null';
                newState[menuTypes.item] = 'null';
                newState.itemSub = null;
                newState[menuTypes.itemsFilter] = null;
                newState[menuTypes.search] = null;
                newState[menuTypes.searchItem] = null;
                break;
            case menuTypes.type:
                newState[menuTypes.type] = data.selection;
                newState[menuTypes.group] = 'null';
                newState[menuTypes.item] = 'null';
                newState.itemSub = null;
                newState[menuTypes.itemsFilter] = null;
                newState[menuTypes.search] = null;
                newState[menuTypes.searchItem] = null;
                break;
            case menuTypes.group:
                newState[menuTypes.group] = data.selection;
                newState[menuTypes.item] = 'null';
                newState.itemSub = null;
                newState[menuTypes.itemsFilter] = null;
                break;
            case menuTypes.item: {
                const selectedItemArray = data.selection.split(itemValueSeperator);
                newState[menuTypes.item] = selectedItemArray[selectedItemArray.length - 1];
                newState.itemSub = (selectedItemArray.length > 1 ? selectedItemArray[0] : null);
                break;
            }
            case menuTypes.itemsFilter:
                newState[menuTypes.itemsFilter] = data.selection;
                break;
            case menuTypes.search:
                newState[menuTypes.search] = data.selection;
                break;
            case menuTypes.searchItem:
                newState[menuTypes.searchItem] = data.selection;
                break;
            default:
            }

            const newItem = translateEmptyValuesToNull(newState[menuTypes.item]);
            const newItemSub = translateEmptyValuesToNull(newState.itemSub);
            const newSearchItem = translateEmptyValuesToNull(newState[menuTypes.searchItem]);
            newState.loadNewContent = (newItem !== oldItem || newItemSub !== oldItemSub || newSearchItem !== oldSearchItem);

            return newState;
        });

        dispatcherActions.contentSwitched = userActions.switchContent.map((data) => {
            const contentData = data.data;
            const typeConfig = this.modelsConfig.find(configElement => configElement.name === contentData.itemType);
            const typeId = typeConfig && typeConfig.idAsText;

            const currentMenuState = menuSelectionStore.getState();

            const newMenuSelection = {
                [menuTypes.type]: typeId,
                [menuTypes.item]: contentData.id,
                [menuTypes.group]: (currentMenuState[menuTypes.type] !== typeId ? 'ALL' : currentMenuState[menuTypes.group]),
            };

            return newMenuSelection;
        });

        menuSelectionStore.setSource(Observable.merge(dispatcherActions.menuSelectionsChanged, dispatcherActions.contentSwitched));
    }

    contentActions() {
        dispatcherActions.waitingForMainContent = menuSelectionStore.map((menuState) => {
            let itemSelection = null;

            if (menuState.loadNewContent === false) {
                itemSelection = { noContentUpdate: true };
            } else if (menuState[menuTypes.item] && menuState[menuTypes.item] !== 'null') {
                itemSelection = { item: menuState[menuTypes.item], type: menuState[menuTypes.type] };
            } else if (menuState[menuTypes.searchItem]) {
                const [, searchType, searchItem] = menuState[menuTypes.searchItem].split(itemValueSeperator);
                itemSelection = { item: searchItem, type: `_${searchType}` };
            }
            return itemSelection;
        })
        .filter(itemSelection => (itemSelection === null || itemSelection.noContentUpdate !== true))
        .shareReplay(1);

        dispatcherActions.mainSelectionChanged = dispatcherActions.waitingForMainContent
        .switchMap((itemSelection) => {
            if (itemSelection) {
            // retrieve data from api
                return this.getContent(itemSelection.type, itemSelection.item)
                .then(content => Object.assign(content, { latestUpdate: latestUpdateIsInitConstant }))
                .catch((err) => {
                    log.error(`Failed loading data from the server. The following errormessage was retrieved: ${JSON.stringify(err)}`);
                    return { error: 'failed loading data from the server' };
                });
            }

            return Promise.resolve();
        }).shareReplay(1);

        // retrieve extensions when mainSelectionChanged
        dispatcherActions.extensionAdded = dispatcherActions.mainSelectionChanged
        .switchMap((mainSelectionContent) => {
            if (isDefined(mainSelectionContent) && !mainSelectionContent.error) {
                return Observable.merge(...this.getExtensionContent(mainSelectionContent));
            }
            return Observable.fromPromise(Promise.resolve());
        })
        .filter(updatedData => isDefined(updatedData));

        function setupContentUpdate() {
            dispatcherActions.selectedContentUpdated = Observable.merge(dispatcherActions.mainSelectionChanged, dispatcherActions.extensionAdded);
        }

        setupContentUpdate();
        selectedStore.setSource(dispatcherActions.selectedContentUpdated);
    }

    getExtensionContent(currentContent) {
        const sectionConfig = currentContent.contentConfig.sections;
        const extraPromises = [];
        sectionConfig.forEach((s) => {
            if (s.loadContentAsExtension) {
                const func = s.getContentFunc || s.getFinalContentFunc;
                extraPromises.push(this[func](currentContent.data, s.containerProperty, currentContent.commonData, runTypeConstants.extension)
                    .then((promiseData) => {
                        Object.assign(currentContent.data, promiseData);
                        return Object.assign(currentContent, { latestUpdate: s.id });
                    })
                );
            }
        });

        return extraPromises;
    }

    getContent(typeIdAsText, itemId) {
        const typeContentConfig = this.modelsConfig.find(m => m.idAsText === typeIdAsText).config.content;
        const mainDataModel = typeContentConfig.mainDataModel;
        const fieldsQuery = typeContentConfig.mainDataFieldsQuery && { fields: typeContentConfig.mainDataFieldsQuery };
        const d2 = this.d2;

        const commonData = {};
        const content = { contentConfig: typeContentConfig, commonData };

        const promise = d2.models[mainDataModel].get(itemId, fieldsQuery)
      .then((result) => {
          content.data = result;
          const extraPromises = [];
          const sections = typeContentConfig.sections;
          sections.forEach((s) => {
              if (isDefined(s.getContentFunc) && (!s.loadContentAsExtension || s.loadContentAsExtension !== extensionConstants.only)) {
                  extraPromises.push(this[s.getContentFunc](result, s.containerProperty, commonData, runTypeConstants.init));
              }
          });

          return Promise.all(extraPromises).then((results) => {
              results.forEach((r) => {
                  if (isArray(r)) {
                      r.forEach((rItem) => {
                          Object.assign(content.data, rItem);
                      });
                  } else if (isObject(r)) {
                      Object.assign(content.data, r);
                  } else {
                      log.debug(`getContentFunc returned unacceptable data. Returned data was: ${JSON.stringify(r)}`);
                  }
              });

              return content;
          });
      })
      .then((contentWithData) => {
          const sections = typeContentConfig.sections;
          let lastPromise;

          sections.forEach((s) => {
              if (isDefined(s.getFinalContentFunc) && (!s.loadContentAsExtension || s.loadContentAsExtension !== extensionConstants.only)) {
                  if (isDefined(lastPromise)) {
                      lastPromise = lastPromise.then((result) => {
                          Object.assign(contentWithData.data, result);
                          return this[s.getFinalContentFunc](contentWithData.data, s.containerProperty, commonData, runTypeConstants.init);
                      });
                  } else {
                      lastPromise = this[s.getFinalContentFunc](contentWithData.data, s.containerProperty, commonData);
                  }
              }
          });

          if (isDefined(lastPromise)) {
              return lastPromise.then((result) => {
                  Object.assign(contentWithData.data, result);
                  return contentWithData;
              });
          }
          return contentWithData;
      });
        return promise;
    }

    getIndicatorDefinitionData(indicatorData, containerProperty) {
        const promises = [];
        const d2 = this.d2;

        promises.push(d2.models.indicatorType.get(indicatorData.indicatorType.id)
            .catch((error) => {
                log.error(`could not retrieve data for indicatorType: ${error}`);
            })
        );

        promises.push(d2.formula.get(indicatorData.numerator)
            .then(formula => ({ numeratorExpression: formula }))
            .catch((error) => {
                log.error(`could not retrieve numeratorExpression: ${error}`);
            })
        );

        promises.push(d2.formula.get(indicatorData.denominator)
            .then(formula => ({ denominatorExpression: formula }))
            .catch((error) => {
                log.error(`could not retrieve denominatorExpression: ${error}`);
            })
        );

        return Promise.all(promises).then((results) => {
            const defData = {};
            results.forEach((r) => {
                Object.assign(defData, r);
            });
            return { [containerProperty]: defData };
        });
    }

    getIndicatorSourceData(indicatorData, containerProperty, commonData) {
        const d2 = this.d2;
        const numeratorDataElements = Dispatcher.getDataElementsFromExpression(indicatorData.numerator);
        const denominatorDataElements = Dispatcher.getDataElementsFromExpression(indicatorData.denominator);

        const dataElements = numeratorDataElements.concat(denominatorDataElements);

        const dataElementsUnique = [];
        dataElements.forEach((d) => {
            if (!isDefined(dataElementsUnique.find(u => u === d))) {
                dataElementsUnique.push(d);
            }
        });

      // add array for dataElements and dataSets to commonData
        Object.assign(commonData, { dataElements: [], dataSets: [] });

        const promises = dataElementsUnique.map(dId =>
            d2.models.dataElement
            .get(dId, { fields: 'id,valueType,displayName,dataSetElements[dataSet[id,displayName,periodType,organisationUnits::size]]' })
            .then((d) => {
                const sourceData = [];

                // add to commonData
                commonData.dataElements.push(d);

                d.dataSetElements.forEach((dsE) => {
                // add to commonData
                    commonData.dataSets.push(dsE.dataSet);

                    sourceData.push({ dataElementName: d.displayName, dataElementId: d.id, dataSetName: dsE.dataSet.displayName, dataSetId: dsE.dataSet.id, frequency: dsE.dataSet.periodType, expectedReports: dsE.dataSet.organisationUnits });
                });
                return sourceData;
            })
            .catch((error) => {
                log.error(`error retrieving dataElement with id ${dId}: ${error}`);
                return [{ dataElementName: `${dId} NOT FOUND` }];
            })
        );

        return Promise.all(promises).then((results) => {
            let sourceData = [];
            results.forEach((r) => {
                sourceData = sourceData.concat(r);
            });
            return { [containerProperty]: sourceData };
        });
    }

    static getDataElementsFromExpression(expr) {
        const dataElements = expr.match(/#\{[A-Za-z0-9]+[\}.]/g);
        if (dataElements === null) {
            return [];
        }

        return dataElements.map((d) => {
            const dFormatted = d.replace(/[#\{\}.]/g, '');
            return dFormatted;
        });
    }

    getIndicatorSummaryData(indicatorData, containerProperty, commonData, runType) {
        return this.getSummaryData((orgUnitNames, summaryTypeNames) => {
            const dataAsMap = new Map();
            const orgUnitsAsString = orgUnitNames.join(', ');

            dataAsMap.set(indicatorData.id, { variableName: indicatorData.displayName, typeName: summaryTypeNames.indicator, orgUnitName: orgUnitsAsString });

            commonData.dataElements.forEach((d) => {
                dataAsMap.set(d.id, { variableName: d.displayName, typeName: summaryTypeNames.dataElement, orgUnitName: orgUnitsAsString, metaData: { typeName: itemTypes.dataElement, id: d.id } });
            });

            commonData.dataSets.forEach((ds) => {
                dataAsMap.set(ds.id, { variableName: ds.displayName, typeName: `${summaryTypeNames.dataSet} (completeness)`, orgUnitName: orgUnitsAsString, metaData: { typeName: itemTypes.dataSet, id: ds.id }, dxRequestId: `${ds.id}.REPORTING_RATE` });
            });

            return dataAsMap;
        }, runType)
        .then(summaryData => ({ [containerProperty]: summaryData }));
    }

    getDataElementRelatedIndicators(dataElementData, containerProperty, commonData) {
        const dataElementId = dataElementData.id;

        const querySpecificaton = {
            fields: 'id,displayName,numerator',
            filter: [`numerator:like:{${dataElementId}`],
            order: 'displayName',
        };

        return this.d2.models.indicators.list(Object.assign(querySpecificaton, { paging: false }))
        .then(result => ({ [containerProperty]: result }))
        .catch((error) => {
            log.error(`Retrieving related indicators failed with the following error: ${JSON.stringify(error)}`);
        });
    }

    getDataElementSummaryData(dataElementData, containerProperty, commonData, runType) {
        return this.getSummaryData((orgUnitNames, summaryTypeNames) => {
            const dataAsMap = new Map();
            const orgUnitsAsString = orgUnitNames.join(', ');

            dataAsMap.set(dataElementData.id, { variableName: dataElementData.displayName, typeName: summaryTypeNames.dataElement, orgUnitName: orgUnitsAsString });

            if (dataElementData.dataSetElements) {
                dataElementData.dataSetElements.forEach((dsE) => {
                    dataAsMap.set(dsE.dataSet.id, { variableName: dsE.dataSet.displayName, typeName: `${summaryTypeNames.dataSet} (completeness)`, orgUnitName: orgUnitsAsString, metaData: { typeName: itemTypes.dataSet, id: dsE.dataSet.id }, dxRequestId: `${dsE.dataSet.id}.REPORTING_RATE` });
                });
            }

            return dataAsMap;
        }, runType)
        .then(summaryData => ({ [containerProperty]: summaryData }));
    }

    getDataSetSummaryData(dataSetData, containerProperty, commonData, runType) {
        return this.getSummaryData((orgUnitNames, summaryTypeNames) => {
            const dataAsMap = new Map();
            const orgUnitsAsString = orgUnitNames.join(', ');

            dataAsMap.set(dataSetData.id, { variableName: dataSetData.displayName, typeName: summaryTypeNames.dataSet, orgUnitName: orgUnitsAsString, dxRequestId: `${dataSetData.id}.REPORTING_RATE` });

            return dataAsMap;
        }, runType)
        .then(summaryData => ({ [containerProperty]: summaryData }));
    }

    getSummaryData(getDataAsMapFn, runType) {
        const d2 = this.d2;
        const periods = { map: new Map(), set: new Set() };
        const ids = new Set();

        // summaryTypes
        const summaryTypeNames = {
            indicator: 'Indicator',
            dataElement: 'Data element',
            dataSet: 'Data set',
        };

        // periods
        const currentYear = new Date().getFullYear();
        periods.map.set(configCodes.currentYear, currentYear.toString());
        periods.map.set(configCodes.lastYear, (currentYear - 1).toString());
        periods.map.set(configCodes.twoYearsAgo, (currentYear - 2).toString());

        periods.set
        .add(periods.map.get(configCodes.twoYearsAgo))
        .add(periods.map.get(configCodes.lastYear))
        .add(periods.map.get(configCodes.currentYear));

        // organisationUnits
        const orgUnitIds = new Set();
        const orgUnitNames = [];
        d2.currentUser.organisationUnits.forEach((org) => {
            orgUnitIds.add(org.id);
            orgUnitNames.push(org.name);
        });

        // data as map
        const dataAsMap = getDataAsMapFn(orgUnitNames, summaryTypeNames);

        let runTypeDependantPromise;

        if (runType === runTypeConstants.extension) {
            // ids
            for (const entry of dataAsMap.entries()) {
                if (entry[1].dxRequestId) {
                    ids.add(entry[1].dxRequestId);
                } else {
                    ids.add(entry[0]);
                }
            }

            // get analytics data
            runTypeDependantPromise = d2.analytics
            .get(ids, orgUnitIds, periods.set)
            .then((result) => {
                result.rows.forEach((r) => {
                    if (r.length >= 3) {
                        const itemId = r[0].split('.')[0];
                        const dataInst = dataAsMap.get(itemId);
                        if (dataInst) {
                            let value = r[2];
                            if (/[0-9]+[.]0$/.test(value)) {
                                value = value.substring(0, value.length - 2);
                            }
                            dataInst[r[1]] = value;
                        } else {
                            log.debug(`got unknown id from analytics data: ${JSON.stringify(r)}`);
                        }
                    } else {
                        log.debug(`analytics datarow contains too few elements: ${JSON.stringify(r)}`);
                    }
                });

                return dataAsMap;
            })
            .catch((error) => {
                log.error(error);
                return dataAsMap;
            });
        } else {
            runTypeDependantPromise = Promise.resolve(dataAsMap);
        }

        return runTypeDependantPromise
        .then((dataMap) => {
            const summaryData = { data: [], metaData: {} };
            dataMap.forEach((dataInst) => {
                summaryData.data.push(dataInst);
            });

            for (const entry of periods.map.entries()) {
                summaryData.metaData[entry[0]] = { id: entry[1], label: entry[1] };
            }

            return summaryData;
        });
    }

}
