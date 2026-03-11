// src/model/Produto.ts
import { DatabaseModel } from "./DatabaseModel.js";
import type { ProdutoDTO } from "../interface/ProdutoDTO.js";

const database = new DatabaseModel().pool;

export class Produto {

    static async listarProdutos(): Promise<ProdutoDTO[] | null> {
        try {
            const resposta = await database.query(`
                SELECT id, cod_produto, nome, descricao, preco, estoque, categoria_id
                FROM produtos
                ORDER BY nome ASC
            `);
            return resposta.rows.map((row) => ({
                idProduto:   row.id,
                codProduto:  row.cod_produto,
                nome:        row.nome,
                descricao:   row.descricao,
                preco:       Number(row.preco),
                estoque:     row.estoque,
                idCategoria: row.categoria_id,
            }));
        } catch (error) {
            console.error("[Produto] Erro ao listar:", error);
            return null;
        }
    }

    static async buscarProduto(id: number): Promise<ProdutoDTO | null> {
        try {
            const resposta = await database.query(
                `SELECT id, cod_produto, nome, descricao, preco, estoque, categoria_id FROM produtos WHERE id = $1`,
                [id]
            );
            if (resposta.rows.length === 0) return null;
            const row = resposta.rows[0];
            return {
                idProduto: row.id, codProduto: row.cod_produto, nome: row.nome,
                descricao: row.descricao, preco: Number(row.preco),
                estoque: row.estoque, idCategoria: row.categoria_id,
            };
        } catch (error) {
            console.error("[Produto] Erro ao buscar:", error);
            return null;
        }
    }

    static async cadastrarProduto(produto: ProdutoDTO): Promise<boolean> {
        try {
            const resposta = await database.query(
                `INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id)
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [produto.nome, produto.descricao ?? null, produto.preco, produto.estoque, produto.idCategoria]
            );
            return resposta.rows.length > 0;
        } catch (error) {
            console.error("[Produto] Erro ao cadastrar:", error);
            return false;
        }
    }

    static async atualizarProduto(id: number, produto: ProdutoDTO): Promise<boolean> {
        try {
            const resposta = await database.query(
                `UPDATE produtos SET nome = $1, descricao = $2, preco = $3, estoque = $4, categoria_id = $5
                 WHERE id = $6 RETURNING id`,
                [produto.nome, produto.descricao ?? null, produto.preco, produto.estoque, produto.idCategoria, id]
            );
            return resposta.rows.length > 0;
        } catch (error) {
            console.error("[Produto] Erro ao atualizar:", error);
            return false;
        }
    }

    static async removerProduto(id: number): Promise<boolean> {
        try {
            const resposta = await database.query(
                `DELETE FROM produtos WHERE id = $1 RETURNING id`, [id]
            );
            return resposta.rows.length > 0;
        } catch (error) {
            console.error("[Produto] Erro ao remover:", error);
            return false;
        }
    }
}

export default Produto;