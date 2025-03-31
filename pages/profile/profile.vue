<template>
	<view class="content">
		<view class="user-info">
			<view class="avatar-box">
				<image class="avatar" :src="userInfo.avatar || '/static/logo.png'"></image>
			</view>
			<view class="user-detail">
				<text class="username">{{userInfo.nickname || '未登录'}}</text>
				<text class="user-desc">{{userInfo.signature || '点击登录账号'}}</text>
			</view>
			<view class="edit-btn">
				<text>编辑</text>
			</view>
		</view>
		
		<view class="stats-panel">
			<view class="stat-item">
				<text class="stat-num">{{userStats.workoutDays}}</text>
				<text class="stat-label">训练天数</text>
			</view>
			<view class="stat-item">
				<text class="stat-num">{{userStats.totalMinutes}}</text>
				<text class="stat-label">总时长(分钟)</text>
			</view>
			<view class="stat-item">
				<text class="stat-num">{{userStats.achievements}}</text>
				<text class="stat-label">获得成就</text>
			</view>
		</view>
		
		<view class="menu-list">
			<view class="menu-group">
				<view class="menu-item" v-for="(item, index) in menuItems.personal" :key="index">
					<text class="menu-icon">{{item.icon}}</text>
					<text class="menu-text">{{item.text}}</text>
					<text class="menu-arrow">></text>
				</view>
			</view>
			
			<view class="menu-group">
				<view class="menu-item" v-for="(item, index) in menuItems.settings" :key="index">
					<text class="menu-icon">{{item.icon}}</text>
					<text class="menu-text">{{item.text}}</text>
					<text class="menu-arrow">></text>
				</view>
			</view>
		</view>
		
		<view class="version-info">
			<text>打工人健身 v1.0.0</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					nickname: '打工人',
					avatar: '',
					signature: '每天抽出一点时间，健康工作每一天'
				},
				userStats: {
					workoutDays: 0,
					totalMinutes: 0,
					achievements: 0
				},
				menuItems: {
					personal: [
						{ icon: '📋', text: '我的计划' },
						{ icon: '📊', text: '训练记录' },
						{ icon: '🏆', text: '我的成就' },
						{ icon: '❤️', text: '收藏动作' }
					],
					settings: [
						{ icon: '⚙️', text: '设置' },
						{ icon: '📱', text: '关于我们' },
						{ icon: '🔔', text: '消息通知' }
					]
				}
			}
		},
		onLoad() {
			// 获取用户信息和统计数据
			this.getUserInfo();
			this.getUserStats();
		},
		methods: {
			getUserInfo() {
				// 这里可以从服务器或本地存储获取用户信息
				// 示例数据
			},
			getUserStats() {
				// 获取用户统计数据
				// 示例数据
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.user-info {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		margin-bottom: 30rpx;
	}

	.avatar-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		overflow: hidden;
		margin-right: 30rpx;
	}

	.avatar {
		width: 100%;
		height: 100%;
	}

	.user-detail {
		flex: 1;
	}

	.username {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}

	.user-desc {
		font-size: 28rpx;
		color: #666;
		display: block;
	}

	.edit-btn {
		padding: 10rpx 30rpx;
		background-color: #f0f0f0;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #666;
	}

	.stats-panel {
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		margin-bottom: 30rpx;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.stat-num {
		font-size: 40rpx;
		font-weight: bold;
		color: #1296db;
		margin-bottom: 10rpx;
	}

	.stat-label {
		font-size: 24rpx;
		color: #666;
	}

	.menu-list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		margin-bottom: 30rpx;
	}

	.menu-group {
		background-color: #ffffff;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.menu-item:last-child {
		border-bottom: none;
	}

	.menu-icon {
		margin-right: 20rpx;
		font-size: 36rpx;
	}

	.menu-text {
		flex: 1;
		font-size: 30rpx;
		color: #333;
	}

	.menu-arrow {
		color: #ccc;
		font-size: 30rpx;
	}

	.version-info {
		text-align: center;
		padding: 40rpx 0;
		color: #999;
		font-size: 24rpx;
	}
</style>