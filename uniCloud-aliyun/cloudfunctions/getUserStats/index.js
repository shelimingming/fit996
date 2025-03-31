'use strict';

/**
 * 获取用户训练统计数据
 * @param {Object} event
 * @param {String} event.user_id - 用户ID，不传则使用当前登录用户ID
 * @returns {Object} - 返回用户训练统计数据
 */
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const dbCmd = db.command;
	
	// 获取用户ID，如果未传入则使用当前登录用户ID
	let userId = event.user_id;
	if (!userId) {
		try {
			const currentUser = await uniCloud.getCurrentUserInfo();
			if (!currentUser || !currentUser.uid) {
				return {
					code: 401,
					msg: '用户未登录'
				};
			}
			userId = currentUser.uid;
		} catch (e) {
			console.error('获取当前用户信息失败:', e);
			return {
				code: 401,
				msg: '获取用户信息失败'
			};
		}
	}
	
	try {
		// 获取用户训练记录
		const workoutRecords = await db.collection('workout_records')
			.where({
				user_id: userId
			})
			.get();
		
		// 获取用户成就
		const userAchievements = await db.collection('user_achievements')
			.where({
				user_id: userId
			})
			.get();
		
		// 计算训练天数（按日期去重）
		const workoutDays = new Set();
		let totalMinutes = 0;
		
		workoutRecords.data.forEach(record => {
			// 添加训练日期（按天计算）
			if (record.start_time) {
				const date = new Date(record.start_time);
				const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
				workoutDays.add(dateStr);
			}
			
			// 累计训练时长（分钟）
			if (record.duration) {
				// duration字段存储的是秒，转换为分钟
				totalMinutes += Math.round(record.duration / 60);
			}
		});
		
		// 获取成就数量
		const achievements = userAchievements.data.length;
		
		return {
			code: 0,
			msg: '获取成功',
			data: {
				workoutDays: workoutDays.size,
				totalMinutes,
				achievements
			}
		};
	} catch (e) {
		return {
			code: 500,
			msg: '获取用户统计数据失败',
			error: e.message
		};
	}
};