import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export class DatabaseModel {
  private pool: any;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  public async testarConexao(): Promise<boolean> {
    try {
      await this.pool.connect();
      console.log("✅ Conectado ao banco com sucesso!");
      return true;
    } catch (error) {
      console.error("❌ Erro ao conectar no banco:", error);
      return false;
    }
  }
}