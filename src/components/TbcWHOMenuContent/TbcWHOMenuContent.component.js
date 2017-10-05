/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable class-methods-use-this */

import React, { Component, PropTypes } from 'react';

// materialUI
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

// actions
import userActions from '../../actions/UserActions';
import dispatcherActions from '../../actions/DispatcherActions';

// custom
import DropDown from '../form_fields/DropDown.component';

class TbcWHOMenuContent extends Component {
    constructor(props) {
        super(props);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.handleReferenceSelect = this.handleReferenceSelect.bind(this);
        this.closeReferenceDialog = this.closeReferenceDialog.bind(this);
        this.showReferenceDialog = this.showReferenceDialog.bind(this);

        this.state = {
            refDialogOpen: false,
        };
    }

    componentDidMount() {
        this.subscriptions = [];
        this.subscriptions.push(dispatcherActions.WHOMenusChanged.subscribe((menuValues) => {
            this.setState(menuValues);
        }));
    }

    componentWillUnmount() {
        this.subscriptions.forEach((sub) => {
            sub.dispose();
        });
    }

    getContentHeader() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: 2, paddingBottom: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                    WHO Reference &nbsp;
                </div>
                <div>
                    <IconButton tooltip="About WHO reference indicators" tooltipPosition="bottom-left" onClick={this.showReferenceDialog} style={{ width: 28, height: 28, padding: 0 }}>
                        <FontIcon className="material-icons" color={this.context.muiTheme.infoIcon.color}>info</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }

    handleReferenceSelect(value) {
        userActions.setWHOReference({ categoryId: this.state.categoryId, referenceId: value });
    }

    showReferenceDialog() {
        this.setState({ refDialogOpen: true });
    }

    closeReferenceDialog() {
        this.setState({ refDialogOpen: false });
    }

    handleCategorySelect(value) {
        userActions.setWHOCategory(value);
    }

    render() {
        return (
            <div>
                {this.getContentHeader()}

                <DropDown
                    menuItems={this.props.categoriesMenu}
                    value={this.state.categoryId}
                    onChange={this.handleCategorySelect}
                    label={{ empty: 'Select Category', filled: 'Category', noContent: 'WHO data missing' }}
                    id="categorySelector"
                    fullWidth={this.props.menuIsExtended}
                />

                {
                    (
                        () => {
                            if (this.state.categoryId) {
                                return (
                                    <DropDown
                                        menuItems={this.props.referencesMenu[this.state.categoryId]}
                                        value={this.state.referenceId}
                                        onChange={this.handleReferenceSelect}
                                        label={{ empty: 'Select Reference Indicator', filled: 'Reference Indicator' }}
                                        id="referenceSelector"
                                        fullWidth={this.props.menuIsExtended}
                                    />
                                );
                            }
                            return null;
                        }
                    )()
                }

                {
                    (
                        () => {
                            if (this.state.referenceId) {
                                return (
                                    <Paper style={{ padding: 10, backgroundColor: 'white' }}>
                                        <div style={{ overflow: 'auto', height: ((this.props.appHeight - 315) > 300 ? (this.props.appHeight - 315) : 300) }}>
                                            {this.props.references[this.state.referenceId].map((i, index) => {
                                                if (i.isDivider) {
                                                    return (<div key={index} style={{ marginBottom: 10 }}><Divider /></div>);
                                                }

                                                let style = {};
                                                if (i.isLabel) {
                                                    style = Object.assign({}, this.context && this.context.muiTheme && this.context.muiTheme.whoReferenceLabel);
                                                } else {
                                                    style = Object.assign({}, { marginBottom: 10 });
                                                }

                                                if (i.isLink) {
                                                    return (<div key={index} style={style}><a href={i.value} target="_blank" rel="noopener noreferrer">{i.value}</a></div>);
                                                }

                                                return (<div key={index} style={style}>{i.value}</div>);
                                            })}
                                        </div>
                                    </Paper>
                                );
                            }
                            return null;
                        }
                    )()
                }

                <Dialog
                    title="About WHO reference indicators"
                    actions={<FlatButton label="Close" primary onTouchTap={this.closeReferenceDialog} />}
                    modal={false}
                    open={this.state.refDialogOpen}
                    onRequestClose={this.closeReferenceDialog}
                >
                    {this.props.aboutWHOreferences}
                </Dialog>

            </div>
        );
    }
}

TbcWHOMenuContent.propTypes = {
    categoriesMenu: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, text: PropTypes.string })),
    referencesMenu: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, text: PropTypes.string }))),
    references: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, isLabel: PropTypes.bool }))),
    aboutWHOreferences: PropTypes.string,
    menuIsExtended: PropTypes.bool,
    appHeight: PropTypes.number,
};

TbcWHOMenuContent.contextTypes = {
    muiTheme: PropTypes.object,
};

TbcWHOMenuContent.defaultProps = {
    categoriesMenu: [],
    referencesMenu: {},
    references: {},
    aboutWHOreferences: '',
};

export default TbcWHOMenuContent;
