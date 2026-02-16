import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { PostgresDB } from "./classes/postgres.js";
import { MongoDB } from "./classes/mongodb.js";

let db;
if (process.env.DATABASE == "postgres") db = new PostgresDB(process.env.POSTGRES_URL);
else db = new MongoDB(process.env.MONGO_URL);
await db.connect();

const app = express();
const port = 3000;

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

app.post("/signin", async (req, res) => {
	let { firstname, username, password } = req.body;
	if (!username || !password || !firstname) {
		return res.status(400).json({ error: "Missing fields" });
	}

	let hashedPassword = await bcrypt.hash(password, 10);

	try {
		await db.createUser(username, hashedPassword, firstname);
		res.json({ ok: true });
	} catch (err) {
		return res.status(400).json({ error: "Username already exits" });
	}
});

app.post("/login", async (req, res) => {
	let { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ error: "Missing fields" });
	}

	let userData = await db.getUserByUsername(username);

	if (!userData) {
		return res.status(400).json({ error: "Username does not exist" });
	}

	let match = await bcrypt.compare(password, userData.password);
	if (!match) {
		return res.status(400).json({ error: "Invalid Password" });
	}

	let sid = await db.createSession(userData.id, req.headers["user-agent"]);
	console.log(sid);

	res.cookie("Sid", sid, {
		httpOnly: true,
		secure: process.env.FRONTEND_URL.startsWith("https"),
		sameSite: "lax",
	});
	res.json({ ok: true });
});

app.use(async (req, res, next) => {
	let sid = req.cookies.Sid;
	if (!sid) return res.status(401).json({ error: "Unauthorized" });

	let session = await db.getSession(sid);
	if (!session) return res.status(401).json({ error: "Unauthorized" });

	req.userID = session.user_id;
	req.token = session.token;
	next();
});

app.post("/save", async (req, res) => {
	let { Id, emo, color, text, act } = req.body;

	if (text && text.trim().split(/\s+/).length > 160) {
		return res.status(400).json({ error: "Description exceeds 160 words" });
	}

	await db.saveEmotion(req.userID, Id, emo, color, text, act);
	res.json({ ok: true });
});

app.post("/share", async (req, res) => {
	let { Id, emo, color, text, act, viewers } = req.body;

	if (text && text.trim().split(/\s+/).length > 160) {
		return res.status(400).json({ error: "Description exceeds 160 words" });
	}
	//TODO: check if viewers are friends of users
	await db.shareEmotion(req.userID, Id, emo, color, text, act, viewers);
	res.json({ ok: true });
});

app.post("/data", async (req, res) => {
	let rows = await db.getEmotions(req.userID);
	let emotions = {};
	let max_id = 0;
	rows.forEach((row) => {
		emotions[row.emotion_id] = {
			emotion: row.emotion,
			color: row.color,
			text: row.text,
			activity: row.activity,
		};
		max_id = Math.max(max_id, row.emotion_id);
	});
	res.json({ Emotion: emotions, ID: max_id });
});

app.post("/logout", async (req, res) => {
	await db.logout(req.userID, req.token);
	res.clearCookie("Sid");
	res.json({ ok: true });
});

app.post("/sessions", async (req, res) => {
	let sessions = await db.getSessions(req.userID, req.token);
	let list = {};
	sessions.forEach((row) => {
		list[row.token] = {
			userAgent: row.user_agent,
			createdAt: row.created_at,
			isCurrent: row.token === req.token,
		};
	});
	res.json({ ok: true, list });
});

app.post("/revoke", async (req, res) => {
	let { token } = req.body;

	if (token <= req.token) return res.status(401).json({ error: "Forbidden" });
	await db.revokeSession(req.userID, token);
	res.json({ ok: true });
});

app.post("/revokeAll", async (req, res) => {
	await db.revokeAllSessions(req.userID, req.token);
	res.json({ ok: true });
});

app.post("/friend/pair", async (req, res) => {
	try {
		let { code } = req.body;
		let targetUser = await db.getUserByFriendCode(code);
		if (!targetUser) {
			throw new Error("Invalid Friend Code");
		}
		console.log(targetUser);
		await db.pairUsers(targetUser.id, req.userID);
		res.json({ ok: true });
	} catch (err) {
		console.log(err);
		res.status(401).json({ error: err.message });
	}
});

app.post("/friend/getAll", async (req, res) => {
	let list = await db.getFriendsWithEmotions(req.userID);
	console.log(list);
	res.json({ ok: true, list });
});

app.post("/mycode", async (req, res) => {
	let code = await db.getMyCode(req.userID);
	if (!code) {
		return res.status(400).json({ error: "Username does not exist" });
	}
	res.json({ ok: true, code });
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
