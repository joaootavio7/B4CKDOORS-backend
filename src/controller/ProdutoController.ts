// src/controller/ProdutoController.ts
import type { Request, Response } from "express";
import { Produto } from "../model/Produto.js";
import type { ProdutoDTO } from "../interface/ProdutoDTO.js";

class ProdutoController {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const lista = await Produto.listarProdutos();
            if (lista === null) return res.status(500).json({ mensagem: "Erro ao listar produtos." });
            return res.status(200).json(lista);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao listar produtos." });
        }
    }

    static async produto(req: Request, res: Response): Promise<Response> {
        try {
            const { idProduto } = req.params;
            const produto = await Produto.buscarProduto(Number(idProduto));
            if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado." });
            return res.status(200).json(produto);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao buscar produto." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dados: ProdutoDTO = req.body;
            if (!dados.nome || dados.preco === undefined || dados.estoque === undefined || !dados.idCategoria) {
                return res.status(400).json({ mensagem: "Campos obrigatórios: nome, preco, estoque, idCategoria." });
            }
            const sucesso = await Produto.cadastrarProduto(dados);
            if (sucesso) return res.status(201).json({ mensagem: "Produto cadastrado com sucesso." });
            return res.status(400).json({ mensagem: "Erro ao cadastrar produto." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao cadastrar produto." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const { idProduto } = req.params;
            const dados: ProdutoDTO = req.body;
            if (!dados.nome || dados.preco === undefined || dados.estoque === undefined || !dados.idCategoria) {
                return res.status(400).json({ mensagem: "Campos obrigatórios: nome, preco, estoque, idCategoria." });
            }
            const sucesso = await Produto.atualizarProduto(Number(idProduto), dados);
            if (sucesso) return res.status(200).json({ mensagem: "Produto atualizado com sucesso." });
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao atualizar produto." });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const { idProduto } = req.params;
            const sucesso = await Produto.removerProduto(Number(idProduto));
            if (sucesso) return res.status(200).json({ mensagem: "Produto removido com sucesso." });
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao remover produto." });
        }
    }
}

export default ProdutoController;