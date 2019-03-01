/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'proptypes';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import isDefined from 'd2-utilizr/lib/isDefined';

class MenuContainer extends React.Component {

    static propTypes = {
        open: PropTypes.bool,
        expanded: PropTypes.bool,
        width: PropTypes.number,
        expandedWidth: PropTypes.number,
        onHide: PropTypes.func.isRequired,
        onExpandedChange: PropTypes.func,
        onHome: PropTypes.func,
        openRight: PropTypes.bool,
        docked: PropTypes.bool,
        children: PropTypes.node,
    }
    
    static contextTypes = {
        muiTheme: PropTypes.object,
    }

    static defaultProps = {
        open: true,
        expanded: false,
        width: 256,
        openRight: false,
        docked: true,
        expandedWidth: 356,
    }

    getHeader = () => {
        const fontColor = ((this.context && this.context.muiTheme && this.context.muiTheme.fontIcon && this.context.muiTheme.fontIcon.color) || null);

        const homeButton = this.props.onHome ? (
            <IconButton tooltip="Home" tooltipPosition={this.props.openRight ? 'bottom-left' : 'bottom-right'} onClick={this.props.onHome} >
                <FontIcon className="material-icons" color={fontColor}>home</FontIcon>
            </IconButton>) : null;

        const closeButton = (
            <IconButton key={`closeBtn${this.props.expanded}`} tooltip={(this.props.docked && this.props.expanded) ? 'Shrink menu' : 'Hide menu'} tooltipPosition={this.props.openRight ? 'bottom-right' : 'bottom-left'} onClick={this.narrow} disableTouchRipple>
                <FontIcon className="material-icons" color={fontColor}>{this.props.openRight ? 'keyboard_arrow_right' : 'keyboard_arrow_left'}</FontIcon>
            </IconButton>);

        let expandButton;
        if (this.props.docked && !this.props.expanded) {
            expandButton = (<IconButton key={'expandBtn'} tooltip="Expand menu" tooltipPosition={this.props.openRight ? 'bottom-right' : 'bottom-left'} onClick={this.expand} disableTouchRipple >
                <FontIcon className="material-icons" color={fontColor}>{this.props.openRight ? 'keyboard_arrow_left' : 'keyboard_arrow_right'}</FontIcon>
            </IconButton>);
        }

        const leftButton = !this.props.openRight ? homeButton : (expandButton ? [expandButton, closeButton] : closeButton);
        const rightButton = leftButton === homeButton ? (expandButton ? [closeButton, expandButton] : closeButton) : homeButton;

        return (
            <div style={{}}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div >
                        {leftButton}
                    </div>
                    <div >
                        {rightButton}
                    </div>
                </div>
                <div style={{ marginLeft: -15, marginRight: -15 }}>
                    <Divider />
                </div>
            </div>
        );
    }

    expand = () => {
        this.props.onExpandedChange();
    }

    narrow = () =>  {
        if (this.props.expanded) {
            this.props.onExpandedChange();
        } else {
            this.props.onHide();
        }
    }

    render() {
        const zIndexDefault = 1000;
        const contentMarginTopDefault = 10;

        let muiStyle = {};
        // get muiThemeSpecifications if set
        if (isDefined(this.context.muiTheme) && isDefined(this.context.muiTheme.menuContainer)) {
            muiStyle = this.context.muiTheme.menuContainer;
        }

        const { zIndex, bannerHeight, ...style } = muiStyle;
        const calculatedZIndex = zIndex || zIndexDefault;
        const contentMarginTop = bannerHeight || contentMarginTopDefault;
    //---------------------------------

        const menuContainerHeader = this.getHeader();
        const width = this.props.expanded ? this.props.expandedWidth : this.props.width;
        const transition = 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, width 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms';

        const renderData = (
            <Drawer
                open={this.props.open}
                width={width}
                openSecondary={this.props.openRight}
                docked={this.props.docked}
                style={{ zIndex: calculatedZIndex }}
                onRequestChange={this.narrow}
                overlayStyle={{ zIndex: calculatedZIndex - 1 }}
                containerStyle={{ transition }}
            >
                <div style={{ paddingTop: contentMarginTop }}>
                    <div style={style}>
                        <div>
                            {menuContainerHeader}
                        </div>
                        <div>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </Drawer>
        );
        return renderData;
    }
}



export default MenuContainer;
