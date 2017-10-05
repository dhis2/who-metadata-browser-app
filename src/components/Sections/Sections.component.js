/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import SectionBsGrid from '../SectionBsGrid/SectionBsGrid.component';
import SectionTable from '../SectionTable/SectionTable.component';
import SectionWrapper from './SectionWrapper.component';
import sectionTypes from './SectionTypes';

export default React.createClass({
    propTypes: {
        sectionsData: React.PropTypes.array.isRequired,
        onElementClick: React.PropTypes.func,
    },
    render() {
        const sections = this.props.sectionsData.map((sd, index) => {
            let section;
            switch (sd.type) {
            case sectionTypes.bsGrid:
                section = (<SectionBsGrid data={sd.data} />);
                break;
            case sectionTypes.table:
                section = (<SectionTable data={sd.data} onCellClick={this.props.onElementClick} />);
                break;
            default:

            }
            return (<SectionWrapper key={index}>{section}</SectionWrapper>);
        });

        return (
            <div>
                {sections}
            </div>
        );
    },
});
