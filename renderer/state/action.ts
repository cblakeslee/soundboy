export type ActionType = 'analyzer_start' | 'analyzer_update' | 'fetch_sounds_request' | 'fetch_sounds_response';

export default interface Action {
    type: ActionType;
    payload?: Record<string, any>;
}