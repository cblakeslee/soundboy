/**
 * This file defines the UI filters and their corresponding DB queries
 */
export default {
    brightness(value: string) {
        const mid = 0.2;
        switch (value) {
            case 'Bright':
                return { 'spectralCentroid.mean': { $gte: mid } };
            case 'Dark':
                return { 'spectralCentroid.mean': { $lte: mid } };
            default:
                return {};
        }
    },

    fullness(value: string) {
        const mid = 0.5;
        switch (value) {
            case 'Full':
                return { 'perceptualSpread.mean': { $gte: mid } };
            case 'Hollow':
                return { 'perceptualSpread.mean': { $lte: mid } };
            default:
                return {};
        }
    },

    instrument(instrument: string) {
        return { instrument };
    },

    loudness(value: string) {
        const mid = 12.0;
        switch (value) {
            case 'Loud':
                return { 'loudness.mean': { $gte: mid } };
            case 'Quiet':
                return { 'loudness.mean': { $lte: mid } };
            default:
                return {};
        }
    },

    name(value: string) {
        if (!value) {
            return {};
        }

        return { filename: { $regex: new RegExp(value, 'i') } };
    },

    noisiness(value: string) {
        const mid = 0.1;
        switch (value) {
            case 'Noisy':
                return { 'spectralFlatness.mean': { $gte: mid } };
            case 'Soft':
                return { 'spectralFlatness.mean': { $lte: mid } };
            default:
                return {};
        }
    },

    pitch(pitch: string) {
        return { pitch };
    },

    pitchiness(value: string) {
        const mid = 0.4;
        switch (value) {
            case 'Tonal':
                return { 'spectralKurtosis.mean': { $gte: mid } };
            case 'Atonal':
                return { 'spectralKurtosis.mean': { $lte: mid } };
            default:
                return {};
        }
    },

    roughness(value: string) {
        const mid = 0.05;
        switch (value) {
            case 'Rough':
                return { 'spectralFlux.mean': { $gte: mid } };
            case 'Smooth':
                return { 'spectralFlux.mean': { $lte: mid } };
            default:
                return {};
        }
    },

    sharpness(value: string) {
        const mid = 0.6;
        switch (value) {
            case 'Sharp':
                return { 'perceptualSharpness.mean': { $gte: mid } };
            case 'Dull':
                return { 'perceptualSharpness.mean': { $lte: mid } };
            default:
                return {};
        }
    },
};
