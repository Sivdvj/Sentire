import pg from "pg";
import crypto from "crypto";
import { DB } from "./db.js";

let { Pool } = pg;

export class PostgresDB extends DB {
	constructor(connectionString) {
		super();
		this.connectionString = connectionString;
		this.pool = null;
	}

	async connect() {
		this.pool = new Pool({
			connectionString: this.connectionString,
		});
	}

	async createUser(username, password, firstname) {
		await this.pool.query(`INSERT INTO users (username, password, name) VALUES ($1, $2, $3)`, [username, password, firstname]);
	}

	async getUserByUsername(username) {
		let result = await this.pool.query(`SELECT id, password FROM users WHERE username = $1`, [username]);
		if (result.rowCount === 0) return null;
		return result.rows[0];
	}

	async createSession(userId, userAgent) {
		let client = await this.pool.connect();
		let sid;
		try {
			await client.query("BEGIN");
			await client.query(`SELECT 1 FROM sessions WHERE user_id = $1 FOR UPDATE`, [userId]);
			let tokenGen = await client.query(`SELECT COALESCE(MAX(token), 0) + 1 as next_token FROM sessions WHERE user_id = $1`, [userId]);
			let token = tokenGen.rows[0].next_token;
			sid = crypto.randomUUID();

			await client.query("INSERT into sessions (user_id, token, session_id, user_agent) VALUES ($1, $2, $3, $4)", [userId, token, sid, userAgent]);
			await client.query("COMMIT");
		} catch (e) {
			await client.query("ROLLBACK");
			throw e;
		} finally {
			client.release();
		}
		return sid;
	}

	async getSession(sid) {
		let result = await this.pool.query(`SELECT user_id, token FROM sessions WHERE session_id = $1`, [sid]);
		if (result.rowCount === 0) return null;
		return result.rows[0];
	}

	async saveEmotion(userId, emotionId, emotion, color) {
		await this.pool.query(`INSERT INTO emotions (user_id, emotion_id, emotion, color) VALUES ($1, $2, $3, $4)`, [userId, emotionId, emotion, color]);
	}

	async getEmotions(userId) {
		let result = await this.pool.query(`SELECT emotion_id, emotion, color FROM emotions WHERE user_id = $1 ORDER BY emotion_id`, [userId]);
		return result.rows;
	}

	async logout(userId, token) {
		await this.pool.query(`DELETE FROM sessions WHERE user_id = $1 AND token = $2`, [userId, token]);
	}

	async getSessions(userId, currentToken) {
		let result = await this.pool.query(`SELECT token, session_id, user_agent, created_at FROM sessions WHERE user_id = $1`, [userId]);
		return result.rows;
	}

	async revokeSession(userId, token) {
		await this.pool.query(`DELETE FROM sessions WHERE token = $1 AND user_id = $2`, [token, userId]);
	}

	async revokeAllSessions(userId, currentToken) {
		await this.pool.query(`DELETE FROM sessions WHERE user_id = $1 AND token > $2`, [userId, currentToken]);
	}
}
