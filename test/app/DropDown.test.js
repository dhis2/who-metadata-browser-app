/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import DropDown from '../../src/components/form_fields/DropDown.component';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

describe('DropDown', () => {
    
    
    let dropdownC;

    beforeEach(() => {        
        dropdownC = null;
    });

    
    it('render one SelectField', () => {
        dropdownC = shallow(<DropDown label="test" />);
        expect(dropdownC.find(SelectField)).to.have.length(1);
    });

    it('callback called', () => {
        var callback = sinon.spy();
        dropdownC = shallow(<DropDown label="test" onChange={callback} />);

        dropdownC.find(SelectField).prop("onChange")(undefined, undefined,"1");
        
        expect(callback).to.be.called.once;
        expect(callback).to.have.been.calledWith("1");
    });
    
    it('verify value set', () => {
        let value = "testValue";
        dropdownC = shallow(<DropDown label="test" value={value} menuItems={[{id: value, text: "valueText"}]} />);
        expect(dropdownC.find(SelectField).prop("value")).to.equal(value);
    });

    it('verify empty value when menuItems is missing', () => {
        let value = "testValue";
        dropdownC = shallow(<DropDown label="test" value={value} />);
        expect(dropdownC.find(SelectField).prop("value")).to.equal('');
    });

    it('include empty', () =>{
        dropdownC = shallow(<DropDown label="test" value={"testValue"} menuItems={[{id: "testValue", text: "valueText"}]} includeEmpty={true} />);
        expect(dropdownC.find(MenuItem).find({value:"null"})).to.have.length(1);        
    });
});