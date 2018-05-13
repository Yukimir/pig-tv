export interface StreamPublishEventDto {
    action: string;
    client_id: number;
    ip: string;
    vhost: string;
    app: string;
    stream: string;
}