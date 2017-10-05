/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import Action from 'd2-ui/lib/action/Action';

const userActions = Action.createActionsFromNames([
    'setType',
    'setGroup',
    'setItem',
    'filterItems',
    'search',
    'setSearchItem',
    'switchContent',
    'reset',
    'setWHOCategory',
    'setWHOReference',
]);

export default userActions;
