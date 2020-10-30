import * as tf from '@tensorflow/tfjs';
import meyda from 'meyda/dist/node/main';

import { ArrayFeature, Feature, Sound } from '../@types';

const FEATURES = [
    'chroma',
    'loudness',
    'mfcc',
    'perceptualSharpness',
    'perceptualSpread',
    'spectralCentroid',
    'spectralFlatness',
    // 'spectralFlux',
    'spectralSlope',
    'spectralRolloff',
    'spectralSpread',
    'spectralSkewness',
    'spectralKurtosis',
];

interface FeatureExtractorOptions {
    frameSize?: number;
    hopSize?: number;
}

interface FeatureTracks {
    chroma?: number[][];
    loudness?: number[];
    mfcc?: number[][];
    perceptualSharpness?: number[];
    perceptualSpread?: number[];
    spectralCentroid?: number[];
    spectralFlatness?: number[];
    spectralFlux?: number[];
    spectralSlope?: number[];
    spectralRolloff?: number[];
    spectralSpread?: number[];
    spectralSkewness?: number[];
    spectralKurtosis?: number[];
}

const initialFeatureTracks = (): FeatureTracks => ({
    chroma: [],
    loudness: [],
    mfcc: [],
    perceptualSharpness: [],
    perceptualSpread: [],
    spectralCentroid: [],
    spectralFlatness: [],
    // spectralFlux: [],
    spectralSlope: [],
    spectralRolloff: [],
    spectralSpread: [],
    spectralSkewness: [],
    spectralKurtosis: [],
});

/**
 * Feaure Extractor class
 * - allows configuration to be shared between sounds
 * - holds the core signal processes logic for Soundboy
 */
export default class FeatureExtractor {
    frameSize = 2048;
    hopSize = 512;

    constructor(config: FeatureExtractorOptions = {}) {
        this.frameSize = config.frameSize || 2048;
        this.hopSize = config.hopSize || 512;
    }

    /**
     * hops through buffer analyzing each window
     * @param buffer
     */
    getFeatureTracks(buffer: Float32Array): FeatureTracks {
        const results = initialFeatureTracks();
        meyda.bufferSize = this.frameSize;
        let prevFrame = new Float32Array();

        // hop through buffer
        for (let offset = 0; offset < buffer.length; offset += this.hopSize) {
            // get frame from buffer
            const end = Math.min(buffer.length, offset + this.frameSize);
            const frame = new Float32Array(this.frameSize).fill(0);
            frame.set(buffer.slice(offset, end));

            const features = meyda.extract(FEATURES, frame, prevFrame);
            prevFrame = frame;

            // push features to appropriate tracks
            FEATURES.forEach((feature) => {
                const val = features[feature];

                if (feature === 'loudness') {
                    results[feature]?.push(val.total);
                } else {
                    results[feature]?.push(val);
                }
            });
        }

        return results;
    }

    /**
     * computes stats for each feature
     * @param featureTracks
     */
    computeFeatureStats(featureTracks: FeatureTracks): Partial<Sound> {
        return Object.keys(featureTracks).reduce((result, feature) => {
            const featureTrack = featureTracks[feature].map((item) =>
                Array.isArray(item) || !Number.isNaN(item) ? item : 0
            );
            const t = tf.tensor(featureTrack);
            // compute stats
            const stats = tf.moments(t, [0]);
            const mean = stats.mean.dataSync();
            const variance = stats.mean.dataSync();
            let data: Feature | ArrayFeature | undefined;

            if (['chroma', 'mfcc'].includes(feature)) {
                // convert array featurs to plain array
                data = {
                    mean: Array.from(mean),
                    variance: Array.from(variance),
                };
            } else {
                // get single value for regular features
                data = {
                    mean: mean[0],
                    variance: variance[0],
                };
            }

            return { ...result, [feature]: data };
        }, {});
    }

    /**
     * Main algorithm that takes a signal buffer and returns feature stats
     * @param buffer
     */
    getFeatures(buffer: Float32Array): Partial<Sound> {
        const featureTracks = this.getFeatureTracks(buffer);
        return this.computeFeatureStats(featureTracks);
    }
}