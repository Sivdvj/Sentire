export class DB {
	async connect() {}
	async createUser(username, password, firstname) {}
	async getUserByUsername(username) {}
	async createSession(userId, userAgent) {}
	async getSession(sid) {}
	async getMyCode(id) {}
	async getUserByFriendCode(code) {}
	async pairUsers(user1, user2) {}
	async getFriends(userId) {}
	async saveEmotion(userId, emotionId, emotion, color) {}
	async getEmotions(userId) {}
	async getActivityEmotionAnalytics(userId) {}
	async logout(userId, token) {}
	async getSessions(userId, currentToken) {}
	async revokeSession(userId, token) {}
	async revokeAllSessions(userId, currentToken) {}
	async getUserActivities(userId) {}
	async addUserActivity(userId, activity, category) {}
}
