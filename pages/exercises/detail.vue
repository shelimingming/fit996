<template>
	<view class="detail-container">
		<!-- 加载中提示 -->
		<view class="loading-container" v-if="loading">
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 错误提示 -->
		<view class="error-container" v-else-if="error">
			<text class="error-text">{{error}}</text>
			<view class="retry-button" @click="fetchExerciseDetail">
				<text>重试</text>
			</view>
		</view>
		
		<!-- 详情内容 -->
		<block v-else>
			<!-- 顶部图片区域 -->
			<view class="exercise-image-container">
				<image :src="exercise.image_url || '/static/exercises/placeholder.svg'" mode="aspectFit" class="exercise-image"></image>
			</view>
			
			<!-- 基本信息区域 -->
			<view class="info-section">
				<view class="exercise-title">
					<text class="name">{{exercise.name}}</text>
					<text class="difficulty" :class="'difficulty-' + exercise.difficulty">{{difficultyText[exercise.difficulty]}}</text>
				</view>
				
				<view class="exercise-tags">
					<view class="tag" v-if="exercise.equipment_type">{{exercise.equipment_type}}</view>
					<view class="tag" v-if="exercise.category">{{exercise.category}}</view>
				</view>
				
				<view class="target-muscles">
					<text class="section-title">目标肌群</text>
					<text class="target-text">{{exercise.target}}</text>
				</view>
			</view>
			
			<!-- 动作描述区域 -->
			<view class="description-section">
				<text class="section-title">动作描述</text>
				<text class="description-text">{{exercise.description}}</text>
			</view>
			
			<!-- 动作要点区域 -->
			<view class="tips-section" v-if="exercise.tips && exercise.tips.length > 0">
				<text class="section-title">动作要点</text>
				<view class="tips-list">
					<view class="tip-item" v-for="(tip, index) in exercise.tips" :key="index">
						<text class="tip-number">{{index + 1}}</text>
						<text class="tip-text">{{tip}}</text>
					</view>
				</view>
			</view>
			
			<!-- 底部操作区域 -->
			<view class="action-section">
				<view class="action-button favorite">
					<text>收藏</text>
				</view>
				<view class="action-button add-to-workout">
					<text>添加到训练</text>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				exerciseId: '',
				exercise: {},
				loading: true,
				error: null,
				difficultyText: {
					1: '初级',
					2: '中级',
					3: '高级'
				}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.exerciseId = options.id;
				this.fetchExerciseDetail();
			} else {
				this.error = '未找到动作信息';
				this.loading = false;
			}
		},
		methods: {
			// 获取动作详情
			async fetchExerciseDetail() {
				this.loading = true;
				this.error = null;
				
				try {
					const db = uniCloud.database();
					const exercisesCollection = db.collection('fit996_exercises');
					const { result } = await exercisesCollection.doc(this.exerciseId).get();
					
					if (result && result.data) {
						const data = result.data;
						
						// 转换数据格式
						this.exercise = {
							name: data.name,
							target: data.target_muscles ? data.target_muscles.join('、') : '',
							target_muscles: data.target_muscles || [],
							difficulty: data.difficulty,
							equipment_type: data.equipment_type,
							category: data.category,
							description: data.description,
							image_url: data.image_url || '/static/exercises/placeholder.svg',
							tips: data.tips || [],
							id: data._id
						};
					} else {
						this.error = '未找到动作信息';
					}
				} catch (err) {
					console.error('获取动作详情失败:', err);
					this.error = '获取动作详情失败，请稍后重试';
				} finally {
					this.loading = false;
				}
			}
		}
	}
</script>

<style>
	.detail-container {
		display: flex;
		flex-direction: column;
		background-color: #f8f8f8;
		min-height: 100vh;
	}
	
	/* 顶部图片区域 */
	.exercise-image-container {
		width: 100%;
		height: 500rpx;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.exercise-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	/* 基本信息区域 */
	.info-section {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.exercise-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	.difficulty {
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}
	
	.difficulty-1 {
		background-color: #e6f7ff;
		color: #1890ff;
	}
	
	.difficulty-2 {
		background-color: #fff7e6;
		color: #fa8c16;
	}
	
	.difficulty-3 {
		background-color: #fff1f0;
		color: #f5222d;
	}
	
	.exercise-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-bottom: 30rpx;
	}
	
	.tag {
		background-color: #f0f0f0;
		color: #666;
		font-size: 24rpx;
		padding: 8rpx 20rpx;
		border-radius: 30rpx;
	}
	
	.target-muscles {
		margin-top: 20rpx;
	}
	
	.section-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 16rpx;
		display: block;
	}
	
	.target-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
	
	/* 动作描述区域 */
	.description-section {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.description-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
	}
	
	/* 动作要点区域 */
	.tips-section {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.tips-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.tip-item {
		display: flex;
		align-items: flex-start;
	}
	
	.tip-number {
		width: 40rpx;
		height: 40rpx;
		background-color: #1296db;
		color: #fff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		margin-right: 16rpx;
		flex-shrink: 0;
	}
	
	.tip-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
	
	/* 底部操作区域 */
	.action-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: space-between;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.action-button {
		width: 48%;
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
	}
	
	.favorite {
		background-color: #f0f0f0;
		color: #666;
	}
	
	.add-to-workout {
		background-color: #1296db;
		color: #fff;
	}
	
	/* 加载和错误提示 */
	.loading-container, .error-container {
		padding: 100rpx 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	
	.loading-text {
		color: #1296db;
		font-size: 28rpx;
	}
	
	.error-text {
		color: #f5222d;
		font-size: 28rpx;
		margin-bottom: 30rpx;
	}
	
	.retry-button {
		background-color: #1296db;
		color: #ffffff;
		padding: 15rpx 40rpx;
		border-radius: 30rpx;
		font-size: 28rpx;
	}
</style>