// src/model/Pedido.ts
import { DatabaseModel } from "./DatabaseModel.js";
import type { PedidoDTO } from "../interface/PedidoDTO.js";

const database = new DatabaseModel().pool;

export class Pedido {

    static async listarPedidos(): Promise<PedidoDTO[] | null> {
        try {
            const resposta = await database.query(`
                SELECT id, cod_pedido, usuario_id, total, status, created_at
                FROM pedidos
                ORDER BY created_at DESC
            `);
            return resposta.rows.map((row) => ({
                idPedido:   row.id,
                codPedido:  row.cod_pedido,
                idUsuario:  row.usuario_id,
                valorTotal: Number(row.total),
                status:     row.status,
                dataPedido: row.created_at,
            }));
        } catch (error) {
            console.error("[Pedido] Erro ao listar:", error);
            return null;
        }
    }

    static async buscarPedido(id: number): Promise<PedidoDTO | null> {
        try {
            const resposta = await database.query(
                `SELECT id, cod_pedido, usuario_id, total, status, created_at FROM pedidos WHERE id = $1`,
                [id]
            );
            if (resposta.rows.length === 0) return null;
            const row = resposta.rows[0];
            return {
                idPedido: row.id, codPedido: row.cod_pedido, idUsuario: row.usuario_id,
                valorTotal: Number(row.total), status: row.status, dataPedido: row.created_at,
            };
        } catch (error) {
            console.error("[Pedido] Erro ao buscar:", error);
            return null;
        }
    }

    static async cadastrarPedido(pedido: PedidoDTO): Promise<boolean> {
        try {
            const resposta = await database.query(
                `INSERT INTO pedidos (usuario_id, total, status) VALUES ($1, $2, $3) RETURNING id`,
                [pedido.idUsuario, pedido.valorTotal, pedido.status ?? "PENDENTE"]
            );
            return resposta.rows.length > 0;
        } catch (error) {
            console.error("[Pedido] Erro ao cadastrar:", error);
            return false;
        }
    }

    static async atualizarPedido(id: number, pedido: PedidoDTO): Promise<boolean> {
        try {
            const resposta = await database.query(
                `UPDATE pedidos SET total = $1, status = $2 WHERE id = $3 RETURNING id`,
                [pedido.valorTotal, pedido.status, id]
            );
            return resposta.rows.length > 0;
        } catch (error) {
            console.error("[Pedido] Erro ao atualizar:", error);
            return false;
        }
    }

    static async removerPedido(id: number): Promise<boolean> {
        try {
            const resposta = await database.query(
                `DELETE FROM pedidos WHERE id = $1 RETURNING id`, [id]
            );
            return resposta.rows.length > 0;
        } catch (error) {
            console.error("[Pedido] Erro ao remover:", error);
            return false;
        }
    }
}

export default Pedido;