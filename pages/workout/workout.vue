<template>
	<view class="workout-container">
		<!-- 顶部信息区域 -->
		<view class="workout-header">
			<view class="header-info">
				<text class="workout-type">{{ workoutType === 'office' ? '办公室健身' : '居家健身' }}</text>
				<text class="workout-duration">时长：{{ selectedTime }}分钟</text>
			</view>
			<view class="progress-info">
				<text class="current-progress">{{ currentExerciseIndex + 1 }}/{{ exercises.length }}</text>
			</view>
		</view>

		<!-- 训练内容区域 -->
		<view class="exercise-content">
			<view class="exercise-image">
				<image :src="currentExercise.image" mode="aspectFit"></image>
			</view>
			<view class="exercise-info">
				<text class="exercise-name">{{ currentExercise.name }}</text>
				<text class="exercise-desc">{{ currentExercise.description }}</text>
			</view>
			<view class="timer-container">
				<text class="timer">{{ formatTime(currentTime) }}</text>
				<view class="timer-progress">
					<view class="progress-bar" :style="{ width: progressWidth + '%' }"></view>
				</view>
			</view>
		</view>

		<!-- 控制按钮区域 -->
		<view class="control-buttons">
			<view class="button-group">
				<button class="control-btn prev" @click="previousExercise" :disabled="currentExerciseIndex === 0">
					<text class="btn-text">上一个</text>
				</button>
				<button class="control-btn main" @click="togglePause">
					<text class="btn-text">{{ isPaused ? '继续' : '暂停' }}</text>
				</button>
				<button class="control-btn next" @click="nextExercise" :disabled="currentExerciseIndex === exercises.length - 1">
					<text class="btn-text">下一个</text>
				</button>
			</view>
		</view>

		<!-- 完成弹窗 -->
		<uni-popup ref="finishPopup" type="center">
			<view class="finish-popup">
				<view class="popup-title">
					<text>训练完成！</text>
				</view>
				<view class="workout-stats">
					<view class="stats-item">
						<text class="stats-value">{{ selectedTime }}</text>
						<text class="stats-label">训练时长(分钟)</text>
					</view>
					<view class="stats-item">
						<text class="stats-value">{{ exercises.length }}</text>
						<text class="stats-label">完成动作</text>
					</view>
					<view class="stats-item">
						<text class="stats-value">{{ calculateCalories() }}</text>
						<text class="stats-label">消耗热量(千卡)</text>
					</view>
				</view>
				<button class="finish-btn" @click="finishWorkout">完成</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			workoutType: '', // 'office' 或 'home'
			selectedTime: 0,
			exercises: [
				{
					name: '颈部拉伸',
					description: '双手交叉置于脑后，轻轻向下按压，感受颈部拉伸，保持15秒。',
					image: '/static/exercises/neck-stretch.svg',
					duration: 30
				},
				// 更多动作将根据类型动态加载
			],
			currentExerciseIndex: 0,
			currentTime: 0,
			isPaused: true,
			timer: null
		}
	},
	onLoad(options) {
		this.workoutType = options.type || 'office'
		this.selectedTime = parseInt(options.time) || 15
		this.loadExercises()
	},
	methods: {
		loadExercises() {
			// 根据类型和时长加载相应的训练动作
			// 这里需要实现动作数据的加载逻辑
		},
		formatTime(seconds) {
			const minutes = Math.floor(seconds / 60)
			const remainingSeconds = seconds % 60
			return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
		},
		togglePause() {
			if (this.isPaused) {
				this.startTimer()
			} else {
				this.pauseTimer()
			}
			this.isPaused = !this.isPaused
		},
		startTimer() {
			this.timer = setInterval(() => {
				if (this.currentTime > 0) {
					this.currentTime--
				} else {
					this.nextExercise()
				}
			}, 1000)
		},
		pauseTimer() {
			clearInterval(this.timer)
		},
		nextExercise() {
			if (this.currentExerciseIndex < this.exercises.length - 1) {
				this.currentExerciseIndex++
				this.currentTime = this.exercises[this.currentExerciseIndex].duration
			} else {
				this.showFinishPopup()
			}
		},
		previousExercise() {
			if (this.currentExerciseIndex > 0) {
				this.currentExerciseIndex--
				this.currentTime = this.exercises[this.currentExerciseIndex].duration
			}
		},
		showFinishPopup() {
			this.pauseTimer()
			this.$refs.finishPopup.open()
		},
		calculateCalories() {
			// 简单的热量计算，可以根据实际需求调整计算方法
			return Math.round(this.selectedTime * 4)
		},
		finishWorkout() {
			// 保存训练数据
			// 返回首页
			uni.navigateBack()
		}
	},
	computed: {
		currentExercise() {
			return this.exercises[this.currentExerciseIndex]
		},
		progressWidth() {
			const totalTime = this.currentExercise.duration
			return (this.currentTime / totalTime) * 100
		}
	},
	onUnload() {
		this.pauseTimer()
	}
}
</script>

<style>
.workout-container {
	padding: 30rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.workout-header {
	background-color: #ffffff;
	padding: 30rpx;
	border-radius: 12rpx;
	margin-bottom: 30rpx;
}

.header-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.workout-type {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.workout-duration {
	font-size: 28rpx;
	color: #666;
}

.progress-info {
	text-align: center;
}

.current-progress {
	font-size: 24rpx;
	color: #999;
}

.exercise-content {
	background-color: #ffffff;
	padding: 30rpx;
	border-radius: 12rpx;
	margin-bottom: 30rpx;
	flex: 1;
}

.exercise-image {
	width: 100%;
	height: 400rpx;
	background-color: #f0f0f0;
	border-radius: 12rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
}

.exercise-image image {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.exercise-info {
	margin-bottom: 30rpx;
}

.exercise-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.exercise-desc {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
}

.timer-container {
	text-align: center;
}

.timer {
	font-size: 64rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.timer-progress {
	background-color: #f0f0f0;
	height: 10rpx;
	border-radius: 5rpx;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background-color: #1296db;
	transition: width 1s linear;
}

.control-buttons {
	background-color: #ffffff;
	padding: 30rpx;
	border-radius: 12rpx;
}

.button-group {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.control-btn {
	flex: 1;
	margin: 0 10rpx;
	padding: 20rpx 0;
	border-radius: 50rpx;
	border: none;
}

.control-btn.prev,
.control-btn.next {
	background-color: #f0f0f0;
}

.control-btn.main {
	background-color: #1296db;
}

.control-btn:disabled {
	background-color: #ccc;
	opacity: 0.5;
}

.btn-text {
	font-size: 28rpx;
	color: #333;
}

.control-btn.main .btn-text {
	color: #ffffff;
}

.finish-popup {
	background-color: #ffffff;
	padding: 40rpx;
	border-radius: 12rpx;
	width: 80vw;
}

.popup-title {
	text-align: center;
	margin-bottom: 30rpx;
}

.popup-title text {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.workout-stats {
	display: flex;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.stats-item {
	flex: 1;
	text-align: center;
}

.stats-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.stats-label {
	font-size: 24rpx;
	color: #666;
}

.finish-btn {
	background-color: #1296db;
	color: #ffffff;
	font-size: 32rpx;
	padding: 20rpx 0;
	border-radius: 50rpx;
	width: 100%;
	border: none;
}
</style>