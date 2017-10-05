/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import MenuContent from '../../src/components/TbcMenuContent/TbcMenuContent.component';
import DropDown from '../../src/components/form_fields/DropDown.component';
import SearchableList from '../../src/components/Lists/SearchableList.component';
import DynamicLoadingList from '../../src/components/Lists/DynamicLoadingList.component';


describe('TbcMenuContent', () => {

    let mcComponent;

    beforeEach(() => {        
        mcComponent = shallow(<MenuContent />);        
    });

    it('verify one dropdown found', () => {       
        expect(mcComponent.find(DropDown)).to.have.length(1);
    });

    it('verify two dropdowns when group is visible', () => {
        mcComponent = shallow(<MenuContent groupMenuIsVisible={true} />);
        expect(mcComponent.find(DropDown)).to.have.length(2);
    });

    it('verify one list when itemMenu is visible', () => {
        mcComponent = shallow(<MenuContent groupMenuIsVisible={true} itemMenuIsVisible={true} />);
        expect(mcComponent.find(SearchableList)).to.have.length(1);
    });

    it('verify type update callback', () => {
        let typeSpy = sinon.spy();
        mcComponent = shallow(<MenuContent typeValue={1} onTypeUpdate={typeSpy} />);
        
        mcComponent.find(DropDown).find("#typeSelector").prop("onChange")({target: {value: 2}});
        expect(typeSpy).to.be.called.once;
    });

    it('verify group update callback', () => {
        let groupSpy = sinon.spy();
        mcComponent = shallow(<MenuContent onGroupUpdate={groupSpy} groupMenuIsVisible={true} groupValue={2} />);
        
        mcComponent.find(DropDown).find("#groupSelector").prop("onChange")({target: {value: 1}});
        expect(groupSpy).to.be.called.once;
    });

    it('verify item update callback', () => {
        let itemSpy = sinon.spy();
        mcComponent = shallow(<MenuContent onItemUpdate={itemSpy} itemMenuIsVisible={true} />);
        
        mcComponent.find(DynamicLoadingList).prop("onValueChange")();
        expect(itemSpy).to.be.called.once;
    });

        
});


