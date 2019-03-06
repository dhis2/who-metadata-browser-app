/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const TbcMobileMenu = props => (
    <div style={{ position: 'fixed', top: 0, zIndex: 1401, height: 44 }}>
        <IconMenu
            iconButtonElement={<IconButton><FontIcon className="material-icons" color="#FFFFFF">menu</FontIcon></IconButton>}
            onChange={props.onSelection}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            <MenuItem value="M" primaryText="Main menu" />
            <MenuItem value="W" primaryText="WHO menu" />
        </IconMenu>
    </div>
);

TbcMobileMenu.propTypes = {
    onSelection: PropTypes.func,
};

export default TbcMobileMenu;
