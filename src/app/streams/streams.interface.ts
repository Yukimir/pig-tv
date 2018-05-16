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
    _id: number;
    app: string;
    stream: string;
    streamName?: string;
}