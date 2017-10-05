/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import { multiArrayValueSeperator } from '../components/Lists/DynamicLoadingList.constants';

export const configCodes = {
    main: '#MAIN#',
    twoYearsAgo: '#2YEARSAGO#',
    lastYear: '#LASTYEAR#',
    currentYear: '#CURRENTYEAR#',
};

export const delimiters = {
    valueSpecDelimiter: '#',
    propertyDelimiter: '.',
};

export const booleanValues = {
    true: 'Yes',
    false: 'No',
};

export const extensionConstants = {
    yes: 'yes',
    only: 'only',
};

export const runTypeConstants = {
    init: 1,
    extension: 2,
};

export const latestUpdateIsInitConstant = Symbol('updateIsInit');

export const itemTypes = {
    indicator: 'indicators',
    dataElement: 'dataElements',
    dataSet: 'dataSets',
};

export const viewModes = { phone: 1, tablet: 2, desktop: 3 };

export const itemValueSeperator = multiArrayValueSeperator;
