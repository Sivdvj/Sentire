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
		await this.db.collection("shared").createIndex({ user_id: 1, viewer_id: 1 }, { unique: true });
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
		if (existing) throw new Error("Already Friends");

		await this.db.collection("friendships").insertOne({ user1, user2, created_at: new Date() });
	}

	async saveEmotion(userId, emotionId, emotion, color, text, act) {
		let result = await this.db.collection("emotions").insertOne({
			user_id: userId,
			emotion_id: emotionId,
			emotion,
			color,
			text,
			activity: act,
			created_at: new Date(),
		});

		return result.insertedId.toString();
	}

	async shareEmotion(userId, emotionId, emotion, color, text, act, viewers) {
		await this.saveEmotion(userId, emotionId, emotion, color, text, act);
		for (let v of viewers) {
			await this.db.collection("shared").updateOne(
				{
					user_id: userId,
					viewer_id: v,
				},
				{
					$set: {
						emotion,
						color,
						text,
						activity: act,
						created_at: new Date(),
					},
				},
				{ upsert: true },
			);
		}
	}

	async getFriendsWithEmotions(userId) {
		let friends = await this.db
			.collection("friendships")
			.find({
				$or: [{ user1: userId }, { user2: userId }],
			})
			.toArray();
		let ids = friends.map((r) => (r.user1 == userId ? r.user2 : r.user1));

		let objectIds = ids.map((id) => new ObjectId(id));
		let users = await this.db
			.collection("users")
			.find({ _id: { $in: objectIds } }, { projection: { name: 1 } })
			.toArray();

		console.log(ids);
		let sharedEmotions = await this.db
			.collection("shared")
			.find({
				viewer_id: userId,
				user_id: { $in: ids },
				created_at: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
			})
			.toArray();
		let emotionMap = {};
		for (let e of sharedEmotions) {
			emotionMap[e.user_id] = e;
		}

		return users.map((u) => {
			let emotionData = emotionMap[u._id.toString()];

			return {
				id: u._id.toString(),
				name: u.name,
				currentEmotion: emotionData
					? {
							emotion: emotionData.emotion,
							color: emotionData.color,
							text: emotionData.text,
							activity: emotionData.activity,
							createdAt: emotionData.created_at,
						}
					: null,
			};
		});
	}

	async getActivityEmotionAnalytics(userId) {
		let result = await this.db
			.collection("emotions")
			.aggregate([
				{
					$match: { user_id: userId },
				},

				{
					$group: {
						_id: {
							activity: "$activity",
							emotion: "$emotion",
							color: "$color",
						},
						frequency: { $sum: 1 },
					},
				},

				{
					$project: {
						_id: 0,
						activity: "$_id.activity",
						emotion: "$_id.emotion",
						color: "$_id.color",
						frequency: 1,
					},
				},

				{
					$sort: { frequency: -1 },
				},
			])
			.toArray();

		return result;
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
