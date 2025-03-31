<template>
	<view class="content">
		<view class="greeting-section">
			<view class="greeting-text">
				<text class="greeting-title">你好，打工人！</text>
				<text class="greeting-subtitle">今天是继续提升自己的好日子</text>
			</view>
			<image class="coach-image" src="/static/coach.png" mode="aspectFit"></image>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedType: '',
				selectedTime: 0
			}
		},
		onLoad() {
			// 页面加载时可以获取用户数据或其他初始化操作
		},
		methods: {
			selectWorkoutType(type) {
				this.selectedType = type;
				console.log('选择了锻炼类型:', type);
				// 这里可以根据选择跳转到相应页面或显示相应内容
			},
			selectWorkoutTime(time) {
				this.selectedTime = time;
				console.log('选择了锻炼时间:', time, '分钟');
				// 这里可以根据选择跳转到相应页面或显示相应内容
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
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 20rpx;
		margin-bottom: 30rpx;
	}
	
	.greeting-text {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	
	.coach-image {
		width: 200rpx;
		height: 200rpx;
		object-fit: contain;
	}

	.greeting-title {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.greeting-subtitle {
		font-size: 32rpx;
		color: #666;
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

	.quick-start, .time-selection {
		margin-bottom: 30rpx;
	}
</style>
