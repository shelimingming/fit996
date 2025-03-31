<template>
	<view class="content">
		<view class="user-info" @click="handleUserInfoClick">
			<view class="avatar-box">
				<image class="avatar" :src="userInfo.avatar || '/static/logo.png'"></image>
			</view>
			<view class="user-detail">
				<text class="username">{{userInfo.nickname || '未登录'}}</text>
				<text class="user-desc">{{userInfo.signature || '点击登录账号'}}</text>
			</view>
			<view class="edit-btn" v-if="hasLogin" @click.stop="toUserInfo">
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
				<view class="menu-item" v-for="(item, index) in menuItems.personal" :key="index" @click="handleMenuClick(item)">
					<text class="menu-icon">{{item.icon}}</text>
					<text class="menu-text">{{item.text}}</text>
					<text class="menu-arrow">></text>
				</view>
			</view>
			
			<view class="menu-group">
				<view class="menu-item" v-for="(item, index) in filteredSettingsMenuItems" :key="index" @click="handleMenuClick(item)">
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
	// 导入uni-id-pages的用户状态管理模块
	import { store, mutations } from '@/uni_modules/uni-id-pages/common/store.js'
	
	export default {
		data() {
			return {
				userInfo: {
					nickname: '',
					avatar: '',
					signature: '点击登录账号'
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
						{ icon: '🔔', text: '消息通知' },
						{ icon: '🚪', text: '退出登录', show: 'hasLogin' }
					]
				},
				hasLogin: false
			}
		},
		onLoad() {
			// 获取用户信息和统计数据
			this.getUserInfo();
			this.getUserStats();
		},
		onShow() {
			// 每次显示页面时检查登录状态
			this.getUserInfo();
		},
		computed: {
			// 根据登录状态过滤设置菜单项
			filteredSettingsMenuItems() {
				return this.menuItems.settings.filter(item => {
					// 如果菜单项有show属性且值为hasLogin，则根据登录状态显示
					if (item.show === 'hasLogin') {
						return this.hasLogin;
					}
					// 其他菜单项始终显示
					return true;
				});
			}
		},
		methods: {
			getUserInfo() {
				// 从uni-id-pages获取用户信息
				if (store.hasLogin) {
					this.hasLogin = true;
					// 获取头像，优先使用avatar_file.url，其次是avatar，最后是默认头像
					let avatarUrl = '/static/logo.png';
					if (store.userInfo.avatar_file && store.userInfo.avatar_file.url) {
						avatarUrl = store.userInfo.avatar_file.url;
					} else if (store.userInfo.avatar) {
						avatarUrl = store.userInfo.avatar;
					}
					this.userInfo = {
						nickname: store.userInfo.nickname || store.userInfo.username || '打工人',
						avatar: avatarUrl,
						signature: store.userInfo.signature || '每天抽出一点时间，健康工作每一天'
					};
				} else {
					this.hasLogin = false;
					this.userInfo = {
						nickname: '未登录',
						avatar: '',
						signature: '点击登录账号'
					};
				}
			},
			getUserStats() {
				// 获取用户统计数据
				if (this.hasLogin) {
					// 调用云函数获取用户的训练数据
					uniCloud.callFunction({
						name: 'getUserStats',
						success: (res) => {
							if (res.result && res.result.code === 0) {
								this.userStats = res.result.data;
							} else {
								console.error('获取用户统计数据失败:', res.result);
								// 获取失败时使用默认数据
								this.userStats = {
									workoutDays: 0,
									totalMinutes: 0,
									achievements: 0
								};
							}
						},
						fail: (err) => {
							console.error('调用getUserStats云函数失败:', err);
							// 调用失败时使用默认数据
							this.userStats = {
								workoutDays: 0,
								totalMinutes: 0,
								achievements: 0
							};
						}
					});
				} else {
					// 未登录时使用默认数据
					this.userStats = {
						workoutDays: 0,
						totalMinutes: 0,
						achievements: 0
					};
				}
			},
			handleUserInfoClick() {
				// 如果未登录，点击头像区域跳转到登录页
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd',
						events: {
							// 监听登录成功事件
							loginSuccess: (data) => {
								// 登录成功后刷新用户信息
								this.getUserInfo();
								this.getUserStats();
							}
						}
					});
				}
			},
			toUserInfo() {
				// 跳转到用户信息编辑页
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
				});
			},
			logout() {
				// 退出登录
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							mutations.logout();
							this.getUserInfo();
							this.getUserStats();
						}
					}
				});
			},
			handleMenuClick(item) {
				// 处理菜单项点击
				switch(item.text) {
					case '退出登录':
						this.logout();
						break;
					case '设置':
						// 跳转到设置页面
						break;
					case '我的计划':
						// 如果未登录，先跳转到登录页
						if (!this.hasLogin) {
							uni.navigateTo({
								url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd',
								events: {
									// 监听登录成功事件
									loginSuccess: (data) => {
										// 登录成功后刷新用户信息
										this.getUserInfo();
										this.getUserStats();
									}
								}
							});
							return;
						}
						// 跳转到我的计划页面
						break;
					default:
						// 其他菜单项处理
						if (!this.hasLogin) {
							uni.navigateTo({
								url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd',
								events: {
									// 监听登录成功事件
									loginSuccess: (data) => {
										// 登录成功后刷新用户信息
										this.getUserInfo();
										this.getUserStats();
									}
								}
							});
							return;
						}
						uni.showToast({
							title: '功能开发中',
							icon: 'none'
						});
						break;
				}
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