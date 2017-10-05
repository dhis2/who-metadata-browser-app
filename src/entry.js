/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-new */
/* eslint-disable no-param-reassign */

import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import moment from 'moment';
import log from 'loglevel';
import { isDefined } from 'd2-utilizr';

// d2
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import addD2Extensions from './d2/d2Extensions';

// project components
import LoadingIndicatorApp from './components/LoadingIndicators/LoadingIndicatorApp.component';
import App from './App.component';

// project
import Dispatcher from './Dispatcher';
import { modelsConfig, settings, WHOModelsConfig } from './config';
import dataBuilders from './helpers/dataBuilders';
import dataValueResolver from './helpers/dataValueResolver';
import WHOMenuBuilder from './helpers/WHOMenuBuilder';
import './styles/app.scss';

// stores
import menuStore from './stores/menuStore';

// The react-tap-event-plugin is required by material-ui to make touch screens work properly with onClick events
injectTapEventPlugin();

log.setLevel(process.env.NODE_ENV === 'production' ? log.levels.ERROR : log.levels.TRACE);
const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line
let whoLocale = 'en';

function setMomentLocale(locale) {
    moment.locale(locale);
}

function configI18n({ keyUiLocale, keyDbLocale }) {
    const locale = keyUiLocale || 'en';
    config.i18n.sources.add(`i18n/module/i18n_module_${locale}.properties`);
    setMomentLocale(locale);

    whoLocale = keyDbLocale || whoLocale;
}

// Render the a LoadingMask to show the user the app is in loading
// The consecutive render after we did our setup will replace this loading mask
// with the rendered version of the application.
render(<LoadingIndicatorApp />, document.getElementById('app'));

/**
 * Renders the application into the page.
 *
 * @param d2 Instance of the d2 library that is returned by the `init` function.
 */
function startApp(d2, WHOData) {
    render(<App d2={d2} WHOData={WHOData} />, document.querySelector('#app'));
}

function extendD2(d2) {
    addD2Extensions(d2, log);

    return d2.currentUser.getOrganisationUnits().then((orgUnits) => {
        d2.currentUser.organisationUnits = orgUnits;
        return d2;
    });
}

function setTranslatorForDataBuilder(d2) {
    dataBuilders.translator = d2.i18n;
    dataValueResolver.translator = d2.i18n;
    WHOMenuBuilder.translator = d2.i18n;
    return d2;
}

// Load the application manifest to be able to determine the location of the Api
// After we have the location of the api, we can set it onto the d2.config object
// and initialise the library. We use the initialised library to pass it into the app
// to make it known on the context of the app, so the sub-components (primarily the d2-ui components)
// can use it to access the api, translations etc.

getManifest('./manifest.webapp')
    .then((manifest) => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then(extendD2)
    .then(setTranslatorForDataBuilder)
    .then((d2) => {
        const menuData = {};

        function hasGroupsInConfig(modelCfg) {
            return isDefined(modelCfg.menu.groups) && isDefined(modelCfg.menu.groups.name);
        }

        function groupsFound(model) {
            return isDefined(model.groups);
        }

        let modelsConfigRebuilt = Object.keys(modelsConfig)
        .map((configElement, idCnt) => ({
            id: idCnt,
            idAsText: `_${idCnt.toString()}`,
            name: configElement,
            label: modelsConfig[configElement].label,
            config: modelsConfig[configElement],
        }));

        menuData.types = modelsConfigRebuilt.map(c => ({ id: c.idAsText, text: c.label, name: c.name }));

      // get data
        return Promise.all((() => {
            const promises = [];
            modelsConfigRebuilt.forEach((model) => {
                if (hasGroupsInConfig(model.config)) {
                    const groups = model.config.menu.groups;
                    promises.push(d2.models[groups.name].list({ paging: false, fields: groups.fields, order: groups.order }));
                }
            });
            return promises;
        })())
      .then((groupResults) => {
          let resultCnt = 0;
          modelsConfigRebuilt = modelsConfigRebuilt.map((model) => {
              const modifiedModel = model;
              if (hasGroupsInConfig(model.config)) {
                  const groupConfig = model.config.menu.groups;
                  const groupResult = groupResults[resultCnt];

                  if (groupResult.size > 0) {
                      modifiedModel.groups = [];
                      groupResult.forEach((group) => {
                          const groupItem = { id: group[groupConfig.id], text: group[groupConfig.text] };
                          modifiedModel.groups.push(groupItem);
                          modifiedModel.groups[group[groupConfig.id]] = groupItem;
                      });
                  }
                  resultCnt += 1;
              }
              return modifiedModel;
          });

          return Promise.all((() => modelsConfigRebuilt.map((model) => {
              const modelCfg = model.config;
              const menuCfg = modelCfg.menu;
              return d2.models[model.name].list({ paging: false, fields: (groupsFound(model) ? `${menuCfg.fields},${menuCfg.groups.name}` : menuCfg.fields), order: menuCfg.order });
          }))());
      })
      .then((results) => {
          menuData.items = [];
          menuData.groups = [];
          menuData.searchData = [];

          const allGroupsDefinition = { id: 'ALL', text: 'ALL' };
          const allInGroupsDefinition = { id: 'ALLBYGROUPS', text: 'ALL BY GROUPS' };
          const uncatogorizedGroupDefinition = { id: 'UNCATEGORIZED', text: 'UNCATEGORIZED' };

          for (let i = 0; i < results.length; i++) {
              const result = results[i];
              const model = modelsConfigRebuilt[i];
              const hasGroups = groupsFound(model);

              menuData.items[model.idAsText] = [];
              menuData.groups[model.idAsText] = [];
              menuData.searchData.push({ id: model.idAsText, header: model.label, subItems: [] });

              if (result.size > 0) {
                  if (hasGroups) {
                      menuData.items[model.idAsText][allGroupsDefinition.id] = [];
                      menuData.groups[model.idAsText].push(allGroupsDefinition);
                  }

                  result.forEach((item) => {
                      const menuDataItem = { id: item[model.config.menu.id], text: item[model.config.menu.text] };

                      if (hasGroups) {
                          menuData.items[model.idAsText][allGroupsDefinition.id].push(menuDataItem);

                          const groupsCfg = model.config.menu.groups;

                          if (item[groupsCfg.name].size > 0) {
                              item[groupsCfg.name].forEach((group) => {
                                  if (!isDefined(menuData.items[model.idAsText][group.id])) {
                                      menuData.items[model.idAsText][group.id] = [];

                                      const groupDef = model.groups[group.id];
                                      if (isDefined(groupDef)) {
                                          menuData.groups[model.idAsText].push({ id: groupDef.id, text: groupDef.text });
                                      }
                                  }
                                  menuData.items[model.idAsText][group.id].push(menuDataItem);
                              });
                          } else {
                              if (!isDefined(menuData.items[model.idAsText][uncatogorizedGroupDefinition.id])) {
                                  menuData.items[model.idAsText][uncatogorizedGroupDefinition.id] = [];
                                  menuData.groups[model.idAsText].push(uncatogorizedGroupDefinition);
                              }
                              menuData.items[model.idAsText][uncatogorizedGroupDefinition.id].push(menuDataItem);
                          }
                      } else {
                          menuData.items[model.idAsText].push(menuDataItem);
                      }
                  });

            // sort groups
                  if (hasGroups) {
                      menuData.groups[model.idAsText].push(allInGroupsDefinition);
                      menuData.groups[model.idAsText].sort((a, b) => {
                          if (a.id === allGroupsDefinition.id) {
                              return -1;
                          }
                          if (b.id === allGroupsDefinition.id) {
                              return 1;
                          }
                          if (a.id === allInGroupsDefinition.id) {
                              return -1;
                          }
                          if (b.id === allInGroupsDefinition.id) {
                              return 1;
                          }
                          if (a.id === uncatogorizedGroupDefinition.id) {
                              return 1;
                          }
                          if (b.id === uncatogorizedGroupDefinition.id) {
                              return -1;
                          }

                          if (a.text > b.text) {
                              return 1;
                          }
                          if (a.text === b.text) {
                              return 0;
                          }
                          return -1;
                      });
                  }

            // add to searchData
                  menuData.searchData[i].subItems = (hasGroups ? menuData.items[model.idAsText][allGroupsDefinition.id] : menuData.items[model.idAsText]);
              }
          }
      })
      .then(() => {
          if (isDefined(settings.enableSearch) && settings.enableSearch === true) {
              menuData.types.push({ id: '_S', text: 'Search', isSearch: true });
          }
          menuStore.setState(menuData);
          return { d2, modelsConfig: modelsConfigRebuilt };
      });
    })
    .then(configData =>
        axios.get('runtimeConfig.json').then(response => Object.assign(configData, { runtimeConfig: response.data }))
        .catch((error) => {
            log.error(`runtimeConfig.json could not be retrieved:${JSON.stringify(error)}`);
            return configData;
        })
    )
    .then((configData) => {
      // get WHO data
        if (configData.runtimeConfig && configData.runtimeConfig.whoDataJson) {
            const dataJsonSplit = configData.runtimeConfig.whoDataJson.split('.');
            let whoDataFile = dataJsonSplit[0];
            whoDataFile += (configData.runtimeConfig.useLocale ? `_${whoLocale}` : '');
            whoDataFile += (dataJsonSplit.length > 1 ? `.${dataJsonSplit[1]}` : '.json');

            const aboutWhoRefIndicators = configData.runtimeConfig.aboutWHOreferences;

            return axios
            .get(whoDataFile)
            .then(whoData => ({ configData, WHOData: Object.assign(WHOMenuBuilder.build(whoData.data, WHOModelsConfig), { aboutWHOreferences: aboutWhoRefIndicators }) }))
            .catch((error) => {
                if (configData.runtimeConfig.useLocale && whoLocale !== 'en') {
                    log.debug(`WHO data for ${whoLocale} could not be retrieved. Will fallback to 'en'...: ${JSON.stringify(error)}`);
                    const whoDataFileFallback = `${dataJsonSplit[0]}_en${dataJsonSplit.length > 1 ? `.${dataJsonSplit[1]}` : '.json'}`;
                    return axios.get(whoDataFileFallback)
                .then(whoDataFallback => ({ configData, WHOData: Object.assign(WHOMenuBuilder.build(whoDataFallback.data, WHOModelsConfig), { aboutWHOreferences: aboutWhoRefIndicators }) }))
                .catch((innerError) => {
                    log.error(`WHO data could not be retrieved: ${JSON.stringify(innerError)}`);
                    return { configData, WHOData: { aboutWHOreferences: aboutWhoRefIndicators } };
                });
                }
                log.error(`WHO data could not be retrieved: ${JSON.stringify(error)}`);
                return { configData, WHOData: { aboutWHOreferences: aboutWhoRefIndicators } };
            });
        } else if (configData.runtimeConfig) {
            const aboutWhoRefIndicators = configData.runtimeConfig.aboutWHOreferences;
            return { configData, WHOData: { aboutWHOreferences: aboutWhoRefIndicators } };
        }
        return { configData };
    })
    .then((configDataContainer) => {
        new Dispatcher(configDataContainer.configData);
        startApp(configDataContainer.configData.d2, configDataContainer.WHOData);
    })
    .catch((error) => {
        log.error(error);

        let message = 'The application could not be loaded.';
        if (process.env.NODE_ENV !== 'production') {
            message += ' Please verify that the server is running.';
        }
        render(<div>{message}</div>, document.getElementById('app'));
    });
