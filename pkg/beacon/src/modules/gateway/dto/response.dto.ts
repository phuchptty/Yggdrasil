export class GatewayResponseBlock<T> {
    success: boolean;
    message?: string;
    data?: T;
}
