/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import Sections from '../Sections/Sections.component';
import LoadingIndicatorPage from '../LoadingIndicators/LoadingIndicatorPage.component';
import InitialMainContent from './InitialMainContent.component';

const MainContent = React.createClass({
    propTypes: {
        style: React.PropTypes.object,
        sectionsData: React.PropTypes.array,
        header: React.PropTypes.string,
        subHeader: React.PropTypes.string,
        onSectionElementClick: React.PropTypes.func,
        error: React.PropTypes.string,
        waitingForContent: React.PropTypes.bool,
        initialState: React.PropTypes.bool,
        viewMode: React.PropTypes.number,
    },
    contextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getDefaultProps() {
        return {
            style: {},
            sectionsData: [],
            waitingForContent: false,
        };
    },
    render() {
        let contents;

        if (this.props.waitingForContent) {
            contents = (<LoadingIndicatorPage />);
        } else if (this.props.initialState) {
            contents = (<InitialMainContent viewMode={this.props.viewMode} />);
        } else {
            contents = (
                <div>
                    <div style={{ fontSize: 24, fontWeight: 300, paddingLeft: 10 }}>
                        {this.props.header}
                    </div>
                    <div style={{ paddingLeft: 10, color: ((this.context.muiTheme && this.context.muiTheme.subHeader && this.context.muiTheme.subHeader.color) || null) }}>
                        {this.props.subHeader}
                    </div>
                    <Sections sectionsData={this.props.sectionsData} onElementClick={this.props.onSectionElementClick} />
                </div>
            );
        }

        return (
            <div style={this.props.style}>
                {contents}
                {
          (() => {
              if (this.props.error) {
                  return (<div>{this.props.error}</div>);
              }
              return null;
          })()
        }
            </div>
        );
    },
});

export default MainContent;
