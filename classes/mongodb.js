import { MongoClient } from "mongodb";
import crypto from "crypto";
import { DB } from "./db.js";

export class MongoDB extends DB {
	constructor(url) {
		super();
		this.url = url;
		this.client = null;
		this.db = null;
	}

	async connect() {
		this.client = new MongoClient(this.url);
		await this.client.connect();
		this.db = this.client.db();
		await this.db.collection("users").createIndex({ username: 1 }, { unique: true });
		await this.db.collection("sessions").createIndex({ session_id: 1 }, { unique: true });
	}

	async createUser(username, password, firstname) {
		await this.db.collection("users").insertOne({
			username,
			password,
			name: firstname,
			created_at: new Date(),
		});
	}

	async getUserByUsername(username) {
		let user = await this.db.collection("users").findOne({ username });
		if (!user) return null;
		return { id: user._id.toString(), password: user.password };
	}

	async createSession(userId, userAgent) {
		let sessions = this.db.collection("sessions");
		let counter = await sessions.findOneAndUpdate({ _id: "SESSION_COUNTER" }, { $inc: { value: 1 } }, { upsert: true, returnDocument: "after" });
		let token = counter.value;
		let sid = crypto.randomUUID();

		await sessions.insertOne({
			user_id: userId,
			token,
			session_id: sid,
			user_agent: userAgent,
			created_at: new Date(),
		});
		return sid;
	}

	async getSession(sid) {
		let session = await this.db.collection("sessions").findOne({ session_id: sid });
		return session ? { user_id: session.user_id, token: session.token } : null;
	}

	async saveEmotion(userId, emotionId, emotion, color) {
		await this.db.collection("emotions").insertOne({
			user_id: userId,
			emotion_id: emotionId,
			emotion,
			color,
		});
	}

	async getEmotions(userId) {
		return await this.db.collection("emotions").find({ user_id: userId }).sort({ emotion_id: 1 }).toArray();
	}

	async logout(userId, token) {
		await this.db.collection("sessions").deleteOne({ user_id: userId, token: token });
	}

	async getSessions(userId, currentToken) {
		return await this.db.collection("sessions").find({ user_id: userId }).toArray();
	}

	async revokeSession(userId, token) {
		await this.db.collection("sessions").deleteOne({ token: token, user_id: userId });
	}

	async revokeAllSessions(userId, currentToken) {
		await this.db.collection("sessions").deleteMany({
			user_id: userId,
			token: { $gt: currentToken },
		});
	}
}
