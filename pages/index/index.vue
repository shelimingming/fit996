<template>
	<view class="content">
		<view class="greeting-section">
			<view class="coach-image-container" @click="navigateToChat">
				<view class="speech-bubble">
					<text class="bubble-text">需要健身指导吗？点击咨询我吧！</text>
					<view class="bubble-arrow"></view>
				</view>
				<image class="coach-image" src="/static/coach.png" mode="aspectFit"></image>
			</view>
		</view>
		
		<view class="quick-start">
			<text class="section-title">快速开始</text>
			<view class="card-list">
				<view class="card" @click="selectWorkoutType('office')">
					<view class="card-icon office-icon">
						<text class="icon-text">🏢</text>
					</view>
					<view class="card-content">
						<text class="card-title">办公室健身</text>
						<text class="card-desc">利用办公环境锻炼</text>
					</view>
				</view>
				<view class="card" @click="selectWorkoutType('home')">
					<view class="card-icon home-icon">
						<text class="icon-text">🏠</text>
					</view>
					<view class="card-content">
						<text class="card-title">居家健身</text>
						<text class="card-desc">在家轻松锻炼</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="time-selection">
			<text class="section-title">按时间选择</text>
			<view class="time-list">
				<view class="time-item" @click="selectWorkoutTime(5)">
					<view class="time-icon purple-icon">
						<text class="icon-text">⏱️</text>
					</view>
					<text class="time-text">5分钟</text>
				</view>
				<view class="time-item" @click="selectWorkoutTime(15)">
					<view class="time-icon blue-icon">
						<text class="icon-text">⏱️</text>
					</view>
					<text class="time-text">15分钟</text>
				</view>
				<view class="time-item" @click="selectWorkoutTime(30)">
					<view class="time-icon green-icon">
						<text class="icon-text">⏱️</text>
					</view>
					<text class="time-text">30分钟</text>
				</view>
			</view>
		</view>
		
		<view class="daily-recommendation">
			<view class="section-header">
				<text class="section-title">今日推荐</text>
				<text class="view-all" @click="navigateToAllWorkouts">查看全部</text>
			</view>
			<view class="workout-card">
				<view class="workout-image">
					<text class="placeholder-text">图片</text>
				</view>
				<view class="workout-info">
					<text class="workout-title">办公室拉伸组合</text>
					<view class="workout-meta">
						<view class="meta-item">
							<text class="meta-icon">⏱️</text>
							<text class="meta-text">10分钟</text>
						</view>
						<view class="meta-item">
							<text class="meta-icon">🔥</text>
							<text class="meta-text">初级</text>
						</view>
					</view>
					<text class="workout-desc">专为久坐办公人群设计的拉伸组合，缓解颈肩腰背疲劳，提高工作效率。</text>
					<button class="start-btn" @click="startWorkout('office-stretch')">开始训练</button>
				</view>
			</view>
		</view>
		
		<view class="workout-stats">
			<text class="section-title">训练数据</text>
			<view class="time-filter">
				<view class="filter-item" :class="{active: timeRange === 'week'}" @click="changeTimeRange('week')">本周</view>
				<view class="filter-item" :class="{active: timeRange === 'month'}" @click="changeTimeRange('month')">本月</view>
				<view class="filter-item" :class="{active: timeRange === 'year'}" @click="changeTimeRange('year')">全年</view>
			</view>
			<view class="stats-chart">
				<text class="placeholder-text">图表区域</text>
			</view>
			<view class="stats-summary">
				<view class="stats-item">
					<text class="stats-value">{{workoutStats.count}}</text>
					<text class="stats-label">训练次数</text>
				</view>
				<view class="stats-item">
					<text class="stats-value">{{workoutStats.duration}}分钟</text>
					<text class="stats-label">总时长</text>
				</view>
				<view class="stats-item">
					<text class="stats-value">{{workoutStats.calories}}</text>
					<text class="stats-label">消耗热量</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedType: '',
				selectedTime: 0,
				timeRange: 'week', // 默认显示本周数据
				workoutStats: {
					count: 4,
					duration: 45,
					calories: 320
				}
			}
		},
		onLoad() {
			// 页面加载时可以获取用户数据或其他初始化操作
			this.loadWorkoutStats();
		},
		methods: {
			selectWorkoutType(type) {
				this.selectedType = type;
				if (this.selectedTime > 0) {
					this.navigateToWorkout();
				}
			},
			selectWorkoutTime(time) {
				this.selectedTime = time;
				if (this.selectedType) {
					this.navigateToWorkout();
				}
			},
			navigateToWorkout() {
				uni.navigateTo({
					url: `/pages/workout/workout?type=${this.selectedType}&time=${this.selectedTime}`,
					fail: (err) => {
						console.error('页面跳转失败:', err);
						uni.showToast({
							title: '页面跳转失败',
							icon: 'none'
						});
					}
				});
			},
			navigateToChat() {
				uni.navigateTo({
					url: '/pages/chat/chat'
				});
			},
			navigateToAllWorkouts() {
				uni.navigateTo({
					url: '/pages/exercises/exercises'
				});
			},
			startWorkout(workoutId) {
				console.log('开始训练:', workoutId);
				// 这里可以跳转到训练详情页或开始训练
				// uni.navigateTo({
				// 	url: `/pages/workout/workout?id=${workoutId}`
				// });
			},
			changeTimeRange(range) {
				this.timeRange = range;
				this.loadWorkoutStats();
			},
			loadWorkoutStats() {
				// 这里可以根据选择的时间范围加载相应的训练数据
				// 模拟数据，实际应用中可以从服务器获取
				const statsData = {
					week: { count: 4, duration: 45, calories: 320 },
					month: { count: 12, duration: 180, calories: 1200 },
					year: { count: 120, duration: 1800, calories: 12000 }
				};
				
				this.workoutStats = statsData[this.timeRange];
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

	.greeting-section {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		padding: 40rpx 20rpx;
		margin-bottom: 30rpx;
	}
	
	.coach-image-container {
		position: relative;
		width: 240rpx;
		height: 240rpx;
		transition: all 0.3s ease;
		cursor: pointer;
	}
	
	.coach-image-container:active {
		transform: scale(0.95);
	}
	
	.coach-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.speech-bubble {
		position: absolute;
		top: 20rpx;
		left: -350rpx;
		background-color: #ffffff;
		padding: 15rpx 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		max-width: 300rpx;
		z-index: 10;
	}
	
	.bubble-text {
		color: #333333;
		font-size: 26rpx;
		font-weight: bold;
		line-height: 1.4;
	}
	
	.bubble-arrow {
		position: absolute;
		top: 50%;
		right: -16rpx;
		width: 0;
		height: 0;
		transform: translateY(-50%);
		border-top: 16rpx solid transparent;
		border-bottom: 16rpx solid transparent;
		border-left: 16rpx solid #ffffff;
	}

	.section-title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		color: #333;
	}

	.card-list {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}

	.card {
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		width: 48%;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: all 0.3s ease;
	}

	.card:active {
		transform: scale(0.98);
		background-color: #f8f8f8;
	}

	.card-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.office-icon {
		background-color: #e6f0ff;
	}

	.home-icon {
		background-color: #e6ffef;
	}

	.icon-text {
		font-size: 48rpx;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.card-desc {
		font-size: 24rpx;
		color: #666;
	}

	.time-selection {
		margin-bottom: 40rpx;
	}

	.time-list {
		display: flex;
		justify-content: space-between;
	}

	.time-item {
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		width: 30%;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: all 0.3s ease;
	}

	.time-item:active {
		transform: scale(0.98);
		background-color: #f8f8f8;
	}

	.time-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.purple-icon {
		background-color: #f0e6ff;
	}

	.blue-icon {
		background-color: #e6f0ff;
	}

	.green-icon {
		background-color: #e6ffef;
	}

	.time-text {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.quick-start, .time-selection, .daily-recommendation, .workout-stats {
		margin-bottom: 30rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.view-all {
		font-size: 28rpx;
		color: #1296db;
	}
	
	.workout-card {
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.workout-image {
		height: 300rpx;
		background-color: #f0f0f0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.placeholder-text {
		color: #999;
		font-size: 28rpx;
	}
	
	.workout-info {
		padding: 30rpx;
	}
	
	.workout-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.workout-meta {
		display: flex;
		margin-bottom: 20rpx;
	}
	
	.meta-item {
		display: flex;
		align-items: center;
		margin-right: 30rpx;
	}
	
	.meta-icon {
		margin-right: 10rpx;
		font-size: 28rpx;
	}
	
	.meta-text {
		font-size: 26rpx;
		color: #666;
	}
	
	.workout-desc {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
		margin-bottom: 30rpx;
	}
	
	.start-btn {
		background-color: #1296db;
		color: #ffffff;
		font-size: 30rpx;
		padding: 20rpx 0;
		border-radius: 50rpx;
		text-align: center;
		width: 100%;
	}
	
	.time-filter {
		display: flex;
		background-color: #f0f0f0;
		border-radius: 12rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	
	.filter-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #666;
	}
	
	.filter-item.active {
		background-color: #ffffff;
		color: #1296db;
		font-weight: bold;
	}
	
	.stats-chart {
		height: 300rpx;
		background-color: #f9f9f9;
		border-radius: 12rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.stats-summary {
		display: flex;
		justify-content: space-between;
	}
	
	.stats-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		margin: 0 10rpx;
	}
	
	.stats-item:first-child {
		margin-left: 0;
	}
	
	.stats-item:last-child {
		margin-right: 0;
	}
	
	.stats-value {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.stats-label {
		font-size: 24rpx;
		color: #666;
	}
</style>
