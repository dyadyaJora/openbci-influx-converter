const NUMBER_OF_CHANNELS_TAG = 'number_of_channels';
const SAMPLE_RATE_TAG = 'sample_rate';
const BOARD_TAG = 'board';

const SAMPLE_INDEX_FIELD = 'sample_index';
const CHANNEL_PREFIX_FIELD = 'ch_';

class OpenBciInfluxConverter {
    constructor(measurement) {
        this.measurement = measurement;
    }

    convertToInflux() {

    }

    convertToInfluxByLine(lines) {
        let tags = {};
        let points = [];

        lines.forEach(line => {
            if (!line) {
                return;
            }

            if (line.startsWith('%')) {
                let obj = this._parseHeaderLine(line)
                if (!!obj) {
                    Object.assign(tags, obj);
                }
                return;
            }

            let point = this._parseData(line, tags[NUMBER_OF_CHANNELS_TAG]);

            if (!!point) {
                Object.assign(point, {tags: tags }, { measurement: this.measurement });
                points.push(point);
            }
        });

        return points;
    }

    _parseHeaderLine(line) {
        let res = {};

        if (!line.includes('=')) {
            return null;
        }

        if (line.startsWith('%Number of channels')) {
            res[NUMBER_OF_CHANNELS_TAG] = +line.split('=')[1].trim();
            return res;
        }

        if (line.startsWith('%Sample Rate')) {
            res[SAMPLE_RATE_TAG] = this._escape(line.split('=')[1].trim());
            return res;
        }

        if (line.startsWith('%Board')) {
            res[BOARD_TAG] = this._escape(line.split('=')[1].trim());
            return res;
        }

        return null;
    }

    _parseData(line, numberOfChannels) {
        let point = {
            fields: {}
        };
        let data = line.split(',');
        if (data.length !== (1 + numberOfChannels + 3 + 2)) {
            return null;
        }

        point.fields[SAMPLE_INDEX_FIELD] = +data[0];

        for (let i = 1; i <= numberOfChannels; i++) {
            point.fields[CHANNEL_PREFIX_FIELD + i] = data[i].trim();
        }

        // to nanoseconds
        point.timestamp = data[data.length - 1].trim() + "000000";

        return point;
    }

    convertToOpenBci() {

    }

    _escape(str) {
        // @todo implement escaping
        return str;
    }

    convertToOpenBciFormat() {

    }
}

module.exports = {
    NUMBER_OF_CHANNELS_TAG,
    SAMPLE_RATE_TAG,
    BOARD_TAG,
    OpenBciInfluxConverter,
    converter: new OpenBciInfluxConverter('')
}


