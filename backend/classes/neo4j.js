import neo4j from "neo4j-driver";
import { DB } from "./db.js";

export class Neo4jDB extends DB {
	constructor(url) {
		super();
		let parsed = new URL(url);
		this.driver = neo4j.driver(`${parsed.protocol}//${parsed.hostname}:${parsed.port}`, neo4j.auth.basic(parsed.username, parsed.password));
	}

	async connect() {
		await this.driver.verifyConnectivity();
		console.log("Neo4j connected");
	}
	async saveEmotion(userId, emotionId, emotion, color, text, activities) {
		const session = this.driver.session();

		try {
			await session.run(
				`
		MERGE (u:User {id: $userId})

		CREATE (e:Emotion {
			emotion_id: $emotionId,
			emotion: $emotion,
			color: $color,
			text: $text,
			created_at: datetime()
		})

		MERGE (u)-[:LOGGED]->(e)

		WITH e

		UNWIND $activities AS act

		MERGE (a:Activity {name: act})

		MERGE (e)-[:TRIGGERED_BY]->(a)
		`,
				{
					userId,
					emotionId,
					emotion,
					color,
					text,
					activities,
				},
			);
		} finally {
			await session.close();
		}
	}

	async getActivityEmotionAnalytics(userId) {
		const session = this.driver.session();
		try {
			const result = await session.run(
				`
			MATCH (u:User {id: $userId})-[:LOGGED]->(e:Emotion)-[:TRIGGERED_BY]->(a:Activity)
	
			RETURN
				a.name AS activity,
				e.emotion AS emotion,
				e.color AS color,
				COUNT(*) AS frequency
	
			ORDER BY frequency DESC
			`,
				{ userId },
			);

			return result.records.map((r) => ({
				activity: r.get("activity"),
				emotion: r.get("emotion"),
				color: r.get("color"),
				frequency: r.get("frequency").toNumber(),
			}));
		} finally {
			await session.close();
		}
	}
}
