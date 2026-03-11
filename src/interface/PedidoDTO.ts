export interface PedidoDTO {
    idPedido?: number;
    codPedido?: string;
    idUsuario: number;
    dataPedido?: string;
    valorTotal: number;
    status?: string;
}