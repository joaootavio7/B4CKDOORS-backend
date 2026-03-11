// src/controller/PedidoController.ts
import type { Request, Response } from "express";
import { Pedido } from "../model/Pedido.js";
import type { PedidoDTO } from "../interface/PedidoDTO.js";

class PedidoController {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const lista = await Pedido.listarPedidos();
            if (lista === null) return res.status(500).json({ mensagem: "Erro ao listar pedidos." });
            return res.status(200).json(lista);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao listar pedidos." });
        }
    }

    static async pedido(req: Request, res: Response): Promise<Response> {
        try {
            const { idPedido } = req.params;
            const pedido = await Pedido.buscarPedido(Number(idPedido));
            if (!pedido) return res.status(404).json({ mensagem: "Pedido não encontrado." });
            return res.status(200).json(pedido);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao buscar pedido." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dados: PedidoDTO = req.body;
            if (!dados.idUsuario || dados.valorTotal === undefined) {
                return res.status(400).json({ mensagem: "Campos obrigatórios: idUsuario, valorTotal." });
            }
            const sucesso = await Pedido.cadastrarPedido(dados);
            if (sucesso) return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso." });
            return res.status(400).json({ mensagem: "Erro ao cadastrar pedido." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao cadastrar pedido." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const { idPedido } = req.params;
            const dados: PedidoDTO = req.body;
            if (dados.valorTotal === undefined || !dados.status) {
                return res.status(400).json({ mensagem: "Campos obrigatórios: valorTotal, status." });
            }
            const sucesso = await Pedido.atualizarPedido(Number(idPedido), dados);
            if (sucesso) return res.status(200).json({ mensagem: "Pedido atualizado com sucesso." });
            return res.status(404).json({ mensagem: "Pedido não encontrado." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao atualizar pedido." });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const { idPedido } = req.params;
            const sucesso = await Pedido.removerPedido(Number(idPedido));
            if (sucesso) return res.status(200).json({ mensagem: "Pedido removido com sucesso." });
            return res.status(404).json({ mensagem: "Pedido não encontrado." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao remover pedido." });
        }
    }
}

export default PedidoController;