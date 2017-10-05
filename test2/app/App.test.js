import jquery from 'jquery';
import React from 'react';
import { shallow } from 'enzyme';
import log from 'loglevel';

import App from '../../src/App';
import HeaderBar from 'd2-ui/lib/header-bar/HeaderBar.component';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

import SideMenuContainer from '../../src/components/SideMenuContainer/SideMenuContainer.component.js';
import TbcMenuContent from '../../src/components/TbcMenuContent/TbcMenuContent.component.js';

import menuStore from '../../src/stores/menuStore.js';
import userActions from '../../src/actions/UserActions.js';
import { Observable } from 'rx';


describe('App', () => {
    
    let appComponent;
    global.$ = jquery;

    var stub = sinon.stub(menuStore, "setState", () => {
        menuStore.state = {};
        menuStore.state.types = [{id: "_1", text: "testType", name: "testType"}];

        menuStore.state.groups = [];
        menuStore.state.groups["_1"] = [];        
        menuStore.state.groups["_1"].push({id: "ALL", text: "ALL" });

        menuStore.state.items = [];
        menuStore.state.items["_1"] = [];
        menuStore.state.items["_1"]["ALL"] = [];
        menuStore.state.items["_1"]["ALL"].push({id: "testItem", text: "testItem"});
    });
    menuStore.setState();
    
    beforeEach(() => {        
        appComponent = shallow(<App />);        
    });

    it('should render two SideMenuContainers', () => {
        expect(appComponent.find(SideMenuContainer)).to.have.length(2);
    });

    it('should render a Header', () => {
        expect(appComponent.find(HeaderBar)).to.have.length(1);
    });

    it('groups and items should be hidden', () => {
        let tbc = appComponent.find(TbcMenuContent);
        var groupVisible = tbc.prop("groupMenuIsVisible");
        expect(tbc.prop("groupMenuIsVisible")).to.be.false;
        expect(tbc.prop("itemMenuIsVisible")).to.be.false;        
    });

    it('choosing type should show groupMenu and render groups', () => {
        let type = "_1";
        appComponent.setState({typeMenuValue: type});
        expect(appComponent.find(TbcMenuContent).prop("groupMenuIsVisible")).to.be.true;
        expect(appComponent.find(TbcMenuContent).prop("groupMenuItems")).to.equal(menuStore.state.groups[type]);
    });  

    it('choosing type and group should show itemMenu and render items', () => {
        let type = "_1";
        let group = "ALL";
        var instance = appComponent.instance();
        instance.selectionChanged({type: type, group: group});
        appComponent.update();
        expect(appComponent.find(TbcMenuContent).prop("groupMenuIsVisible")).to.be.true;
        expect(appComponent.find(TbcMenuContent).prop("itemMenuIsVisible")).to.be.true;    
        expect(appComponent.find(TbcMenuContent).prop("groupMenuItems")).to.equal(menuStore.state.groups[type]);
        expect(appComponent.find(TbcMenuContent).prop("itemMenuItems")).to.equal(menuStore.state.items[type][group]);
    });    

    it('verify data is put on streams when updating tbcMenu', (done) => {

        userActions.called = Observable.merge(
            userActions.setType.map(data => {
                expect(data.data).to.equal("_1");
                return data.data;
            }),
            userActions.setGroup.map(data => {
                expect(data.data).to.equal("ALL");
            }),
            userActions.setItem.map(data => {
                expect(data.data).to.equal("testItem");
            })
        );
        
        var calledCnt = 0;
        userActions.called.subscribe(data => {            
            calledCnt++;
            if(calledCnt === 3){
                done();
            }
        });

        appComponent.find(TbcMenuContent).prop("onTypeUpdate")("_1");
        appComponent.find(TbcMenuContent).prop("onGroupUpdate")("ALL");
        appComponent.find(TbcMenuContent).prop("onItemUpdate")("testItem");
        
    });


   
});
