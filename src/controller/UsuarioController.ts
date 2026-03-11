// src/controller/UsuarioController.ts
import type { Request, Response } from "express";
import { Usuario } from "../model/Usuario.js";
import type { UsuarioDTO } from "../interface/UsuarioDTO.js";

class UsuarioController {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const lista = await Usuario.listarUsuarios();
            if (lista === null) return res.status(500).json({ mensagem: "Erro ao listar usuários." });
            return res.status(200).json(lista);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao listar usuários." });
        }
    }

    static async usuario(req: Request, res: Response): Promise<Response> {
        try {
            const { idUsuario } = req.params;
            const usuario = await Usuario.buscarUsuario(Number(idUsuario));
            if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado." });
            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao buscar usuário." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dados: UsuarioDTO = req.body;
            if (!dados.nome || !dados.email || !dados.senha) {
                return res.status(400).json({ mensagem: "Os campos nome, email e senha são obrigatórios." });
            }
            const sucesso = await Usuario.cadastrarUsuario(dados);
            if (sucesso) return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso." });
            return res.status(400).json({ mensagem: "Erro ao cadastrar usuário." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao cadastrar usuário." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const { idUsuario } = req.params;
            const dados: UsuarioDTO = req.body;
            if (!dados.nome || !dados.email) {
                return res.status(400).json({ mensagem: "Os campos nome e email são obrigatórios." });
            }
            const sucesso = await Usuario.atualizarUsuario(Number(idUsuario), dados);
            if (sucesso) return res.status(200).json({ mensagem: "Usuário atualizado com sucesso." });
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao atualizar usuário." });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const { idUsuario } = req.params;
            const sucesso = await Usuario.removerUsuario(Number(idUsuario));
            if (sucesso) return res.status(200).json({ mensagem: "Usuário removido com sucesso." });
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno ao remover usuário." });
        }
    }
}

export default UsuarioController;