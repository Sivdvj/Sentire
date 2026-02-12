import { MongoClient, ObjectId } from "mongodb";
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
		await this.db.collection("users").createIndex({ friendCode: 1 }, { unique: true });
		await this.db.collection("friendships").createIndex({ user1: 1, user2: 1 }, { unique: true });
	}

	async getMyCode(userID) {
		let user = await this.db.collection("users").findOne({ _id: new ObjectId(userID) });
		if (!user) return null;
		return user.friendCode;
	}

	async createUser(username, password, firstname) {
		let friendCode = crypto.randomBytes(4).toString("base64url").toUpperCase();

		await this.db.collection("users").insertOne({
			username,
			password,
			name: firstname,
			friendCode,
			created_at: new Date(),
		});
	}

	async getUserByUsername(username) {
		let user = await this.db.collection("users").findOne({ username });
		if (!user) return null;
		return { id: user._id.toString(), password: user.password };
	}

	async getUserByFriendCode(code) {
		let user = await this.db.collection("users").findOne({ friendCode: code });
		if (!user) return null;
		return { id: user._id.toString(), name: user.name };
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

	async pairUsers(user1, user2) {
		if (user1 == user2) throw new Error("Cannot friend yourself");
		[user1, user2] = [user1, user2].sort();

		let existing = await this.db.collection("friendships").findOne({ user1, user2 });
		if (existing) return;

		await this.db.collection("friendships").insertOne({ user1, user2, created_at: new Date() });
	}

	async saveEmotion(userId, emotionId, emotion, color) {
		await this.db.collection("emotions").insertOne({
			user_id: userId,
			emotion_id: emotionId,
			emotion,
			color,
		});
	}

	async getFriends(userId) {
		let friends = await this.db
			.collection("friendships")
			.find({
				$or: [{ user1: userId }, { user2: userId }],
			})
			.toArray();
		let ids = friends.map((r) => (r.user1 == userId ? r.user2 : r.user1)).map((id) => new ObjectId(id));

		let users = await this.db
			.collection("users")
			.find({ _id: { $in: ids } })
			.toArray();

		return users.map((u) => ({ id: u._id.toString(), name: u.name }));
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
