import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private sqliteConnection: SQLiteConnection;
  private db: SQLiteDBConnection | undefined;

  constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  }

  private async waitForJeepSqliteElement(): Promise<void> {
    return new Promise((resolve, reject) => {
      const maxTries = 20;
      let tries = 0;

      const check = () => {
        const el = document.querySelector('jeep-sqlite');
        if (el) {
          resolve();
        } else if (tries > maxTries) {
          reject('Elemento jeep-sqlite não carregou no DOM');
        } else {
          tries++;
          setTimeout(check, 100);
        }
      };

      check();
    });
  }

  async initializeDatabase(): Promise<void> {
    try {
      console.log('Aguardando jeep-sqlite estar disponível...');
      await this.waitForJeepSqliteElement();
      console.log('✅ jeep-sqlite encontrado.');

      console.log('Inicializando WebStore...');
      await CapacitorSQLite.initWebStore();
      console.log('✅ WebStore inicializado.');

      console.log('Criando conexão com SQLiteConnection...');
      await this.sqliteConnection.createConnection(
        'usuariosDB',
        false,
        'no-encryption',
        1,
        false
      );
      console.log('✅ createConnection concluído.');

      console.log('Recuperando conexão...');
      this.db = await this.sqliteConnection.retrieveConnection('usuariosDB', false);
      console.log('✅ retrieveConnection concluído.');

      if (!this.db) {
        throw new Error('Falha ao recuperar conexão com o banco de dados.');
      }

      console.log('Abrindo banco...');
      await this.db.open();
      console.log('✅ Banco aberto com sucesso!');

      const createTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL,
          active INTEGER DEFAULT 1
        );
      `;
      console.log('Criando tabela users...');
      await this.db.execute(createTable);
      console.log('✅ Tabela criada ou já existia.');
    } catch (error) {
      console.error('❌ Erro ao inicializar o banco:', error);
    }
  }

  async addDefaultUser(): Promise<void> {
    if (!this.db) {
      console.error('Erro: Banco de dados ainda não inicializado.');
      return;
    }

    const res = await this.db.query('SELECT * FROM users WHERE email = ?', ['aluno@email.com']);
    if (res.values && res.values.length === 0) {
      const insert = `
        INSERT INTO users (name, email, password, active) VALUES (?, ?, ?, 1);
      `;
      await this.db.run(insert, ['Aluno', 'aluno@email.com', '123456']);
      console.log('Usuário padrão adicionado!');
    } else {
      console.log('Usuário padrão já existe.');
    }
  }

  async getUsers(): Promise<User[]> {
    if (!this.db) {
      console.error('Erro: Banco de dados ainda não inicializado.');
      return [];
    }

    const res = await this.db.query('SELECT * FROM users;');
    return res.values as User[];
  }
}
