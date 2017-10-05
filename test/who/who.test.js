import WHOMenuBuilder from '../../src/helpers/WHOMenuBuilder';
import testData from './testData/whoData.json';

describe('whoData', () => {  

    let config;

    beforeEach(() => {        
        config = {
            fields: [
                {label: "whoName", dataProp: "name"},
                {label: "whoCode", dataProp: "code"},
                {label: "whoDomain", dataProp: "domain"},
                {label: "whoProgramme", dataProp: "programme"},
                {label: "whoDefinition", dataProp: "description"},
                {label: "whoType", dataProp: "indicatorType.name"},
                {label: "whoNumerator", dataProp: "numeratorDescription"},
                {label: "whoDenominator", dataProp: "denominatorDescription"},    
                {label: "whoDisaggregations", dataProp: "disaggregations"},
                {label: "whoFacilityDataSource", dataProp: "facilityDataSoruce"},
                {label: "whoLevelCollected", dataProp: "levelCollected"},
                {label: "whoComment", dataProp: "comment"}
            ]
        }
    });

    it('buildMenu', () => {       
        let srcIndicators = testData.indicators;

        let menuData = WHOMenuBuilder.build(testData, config);

        expect(menuData.categoriesMenu.length).to.equal(1);
        expect(menuData.referencesMenu.udCrMpFlegu).to.have.length(testData.indicatorGroups[0].indicators.length);
        expect(menuData.references.qFRFe2W8dxE).to.exist;
    }); 

        
});

