/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import PropTypes from 'prop-types';
import Sections from '../Sections/Sections.component';
import LoadingIndicatorPage from '../LoadingIndicators/LoadingIndicatorPage.component';
import InitialMainContent from './InitialMainContent.component';

class MainContent extends React.Component {

    static defaultProps = {
        style: {},
        sectionsData: [],
        waitingForContent: false,
    }

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
                {this.props.error &&
                  <div>{this.props.error}</div>
                }
            </div>
        );
    }
}

MainContent.propTypes = {
    style: PropTypes.object,
    sectionsData: PropTypes.array,
    header: PropTypes.string,
    subHeader: PropTypes.string,
    onSectionElementClick: PropTypes.func,
    error: PropTypes.string,
    waitingForContent: PropTypes.bool,
    initialState: PropTypes.bool,
    viewMode: PropTypes.number,
};

MainContent.contextTypes = {
    muiTheme: PropTypes.object,
};

export default MainContent;
