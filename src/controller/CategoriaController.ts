// src/controller/CategoriaController.ts
import type { Request, Response } from "express";
import { Categoria } from "../model/Categoria.js";
import type { CategoriaDTO } from "../interface/CategoriaDTO.js";

class CategoriaController {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const lista = await Categoria.listarCategorias();
            if (lista === null) return res.status(500).json({ mensagem: "Erro ao listar categorias." });
            return res.status(200).json(lista);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao listar categorias." });
        }
    }

    static async categoria(req: Request, res: Response): Promise<Response> {
        try {
            const { idCategoria } = req.params;
            const categoria = await Categoria.buscarCategoria(Number(idCategoria));
            if (!categoria) return res.status(404).json({ mensagem: "Categoria não encontrada." });
            return res.status(200).json(categoria);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao buscar categoria." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dados: CategoriaDTO = req.body;
            if (!dados.nome) return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
            const sucesso = await Categoria.cadastrarCategoria(dados);
            if (sucesso) return res.status(201).json({ mensagem: "Categoria cadastrada com sucesso." });
            return res.status(400).json({ mensagem: "Erro ao cadastrar categoria." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao cadastrar categoria." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const { idCategoria } = req.params;
            const dados: CategoriaDTO = req.body;
            if (!dados.nome) return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
            const sucesso = await Categoria.atualizarCategoria(Number(idCategoria), dados);
            if (sucesso) return res.status(200).json({ mensagem: "Categoria atualizada com sucesso." });
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao atualizar categoria." });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const { idCategoria } = req.params;
            const sucesso = await Categoria.removerCategoria(Number(idCategoria));
            if (sucesso) return res.status(200).json({ mensagem: "Categoria removida com sucesso." });
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao remover categoria." });
        }
    }
}

export default CategoriaController;