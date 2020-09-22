const chai = require('chai');
const expect = chai.expect;

const Converter = require('../index');
const OpenBciInfluxConverter = Converter.OpenBciInfluxConverter;
let defaultConverter = require('../index').converter;
let workingConverter;

describe('Converter testing', () => {
    before(() => {
        workingConverter = new OpenBciInfluxConverter('some_measurement');
    });

    it('Default converter exists', () => {
        expect(defaultConverter).to.not.equal(null);
    });

    it('Converter by lines create correct points array', () => {
        let lines = [
            '%OpenBCI data',
            '%Number of channels = 4',
            '%Sample Rate = 250 HZ',
            '%Board = Some board',
            '0, 61379.36, 49492.89, -16597.06, -21309.75, 0.040, 0.420, 0.238, 12:00:53.329, 1557936053329',
            '1, 60973.46, 48972.47, -16279.02, -21050.13, 0.000, 0.000, 0.000, 12:00:53.336, 1557936053336',
            '2, 61433.45, 49486.27, -16245.72, -20920.25, 0.000, 0.000, 0.000, 12:00:53.336, 1557936053336',
            '3, 61788.96, 49917.57, -16488.30, -21147.99, 0.000, 0.000, 0.000, 12:00:53.343, 1557936053343'
        ];

        let points = workingConverter.convertToInfluxByLine(lines);

        expect(points).to.have.lengthOf(4);
        let onePoint = points[0];
        expect(onePoint.tags).to.have.deep.property(Converter.SAMPLE_RATE_TAG, '250 HZ');
        expect(onePoint.tags).to.have.deep.property(Converter.NUMBER_OF_CHANNELS_TAG, 4);
        expect(onePoint.tags).to.have.deep.property(Converter.BOARD_TAG, 'Some board');
        expect(onePoint.fields).to.own.include({
            'ch_1': '61379.36',
            'ch_2': '49492.89',
            'ch_3': '-16597.06',
            'ch_4': '-21309.75',
            'sample_index': 0
        });
        expect(onePoint.timestamp).to.equal('1557936053329000000');
    });

})
