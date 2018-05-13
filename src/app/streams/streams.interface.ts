export interface StreamPublishEventDto {
    action: string;
    client_id: number;
    ip: string;
    vhost: string;
    app: string;
    stream: string;
}
export interface Stream {
    id: string;
    app: string;
    stream: string;
    streamName?: string;
}

export class StreamEventMap {
    'publish': Stream;
    'unpublish': string;
}