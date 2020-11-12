export default {
    instrument(instrument: string) {
        return { instrument };
    },
    pitch(pitch: string) {
        return { pitch };
    },

    brightness(value: string) {
        switch (value) {
            case 'Bright':
                return { 'spectralCentroid.mean': { $gte: 200 } };
            case 'Dark':
                return { 'spectralCentroid.mean': { $lte: 200 } };
            default:
                return {};
        }
    },
};
