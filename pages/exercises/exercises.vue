<template>
	<view class="content">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input type="text" placeholder="搜索动作" v-model="searchText" />
		</view>
		
		<!-- 主体内容区域 -->
		<view class="main-container">
			<!-- 左侧分类导航 -->
			<view class="sidebar">
				<view 
					class="sidebar-item" 
					v-for="(item, index) in muscleGroups" 
					:key="index"
					:class="{active: currentMuscleGroup === index}"
					@click="switchMuscleGroup(index)"
				>
					<text>{{item.name}}</text>
				</view>
			</view>
			
			<!-- 右侧内容区域 -->
			<view class="content-area">
				<!-- 顶部器材分类标签 -->
				<view class="equipment-tabs">
					<view 
						class="tab-item" 
						v-for="(item, index) in categories" 
						:key="index"
						:class="{active: currentCategory === index}"
						@click="switchCategory(index)"
					>
						<text>{{item.name}}</text>
					</view>
				</view>
				
				<!-- 当前选中的分类标题 -->
				<view class="current-category-title" v-if="!loading && !error">
					<text>{{currentCategoryTitle}}</text>
				</view>
				
				<!-- 加载中提示 -->
				<view class="loading-container" v-if="loading">
					<text class="loading-text">加载中...</text>
				</view>
				
				<!-- 错误提示 -->
				<view class="error-container" v-else-if="error">
					<text class="error-text">{{error}}</text>
					<view class="retry-button" @click="fetchExercises">
						<text>重试</text>
					</view>
				</view>
				
				<!-- 动作列表 -->
				<view class="exercise-grid" v-else>
					<view class="exercise-card" v-for="(item, index) in filteredExercises" :key="index" @click="viewExerciseDetail(item)">
						<view class="exercise-image">
							<image :src="item.image_url || '/static/exercises/placeholder.svg'" mode="aspectFit"></image>
						</view>
						<view class="exercise-info">
							<text class="exercise-name">{{item.name}}</text>
							<text class="exercise-target">{{item.target}}</text>
						</view>
					</view>
				</view>
				
				<!-- 空数据提示 -->
				<view class="empty-tip" v-if="!loading && !error && filteredExercises.length === 0">
					<text>暂无相关动作</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				currentCategory: 0,
				currentMuscleGroup: 0,
				categories: [
					{ name: '全部', id: 'all' },
					{ name: '杠铃', id: 'barbell' },
					{ name: '哑铃', id: 'dumbbell' },
					{ name: '史密斯', id: 'smith' },
					{ name: '器械', id: 'machine' },
					{ name: '绳索', id: 'cable' }
				],
				muscleGroups: [
					{ name: '胸', id: 'chest' },
					{ name: '背', id: 'back' },
					{ name: '腿', id: 'legs' },
					{ name: '肩', id: 'shoulders' },
					{ name: '斜方肌', id: 'traps' },
					{ name: '二头', id: 'biceps' },
					{ name: '三头', id: 'triceps' },
					{ name: '小腿', id: 'calves' },
					{ name: '前臂', id: 'forearms' },
					{ name: '臀部', id: 'glutes' },
					{ name: '腹部', id: 'abs' },
					{ name: '拉伸', id: 'stretch' },
					{ name: '有氧', id: 'cardio' },
					{ name: '全身', id: 'full_body' }
				],
				exercises: [],
				loading: true,
				error: null,
				difficultyText: {
					1: '初级',
					2: '中级',
					3: '高级'
				}
			}
		},
		computed: {
			filteredExercises() {
				let result = this.exercises;
				
				// 按肌肉群组筛选
				if (this.currentMuscleGroup !== 0) {
					const muscleGroupId = this.muscleGroups[this.currentMuscleGroup].id;
					result = result.filter(item => 
						item.target_muscles && item.target_muscles.includes(muscleGroupId)
					);
				}
				
				// 按器材分类筛选
				if (this.currentCategory !== 0) {
					const equipmentId = this.categories[this.currentCategory].id;
					result = result.filter(item => item.equipment === equipmentId);
				}
				
				// 按搜索文本筛选
				if (this.searchText.trim()) {
					const keyword = this.searchText.toLowerCase();
					result = result.filter(item => 
						item.name.toLowerCase().includes(keyword) || 
						(item.target_muscles && item.target_muscles.join('').toLowerCase().includes(keyword))
					);
				}
				
				return result;
			},
			
			// 当前分类标题
			currentCategoryTitle() {
				if (this.currentCategory === 0 && this.currentMuscleGroup === 0) {
					return '全部动作';
				} else if (this.currentCategory !== 0 && this.currentMuscleGroup === 0) {
					return this.categories[this.currentCategory].name;
				} else if (this.currentCategory === 0 && this.currentMuscleGroup !== 0) {
					return this.muscleGroups[this.currentMuscleGroup].name;
				} else {
					return `${this.categories[this.currentCategory].name} - ${this.muscleGroups[this.currentMuscleGroup].name}`;
				}
			}
		},
		onLoad() {
			// 页面加载时从数据库获取动作数据
			this.fetchExercises()
		},
		methods: {
			// 切换器材分类
			switchCategory(index) {
				this.currentCategory = index;
			},
			
			// 切换肌肉群组
			switchMuscleGroup(index) {
				this.currentMuscleGroup = index;
			},
			
			// 查看动作详情
			viewExerciseDetail(exercise) {
				// 可以跳转到详情页或者打开弹窗显示详情
				uni.navigateTo({
					url: `/pages/exercises/detail?id=${exercise.id}`
				});
			},
			
			// 从数据库获取动作数据
			async fetchExercises() {
				this.loading = true;
				this.error = null;
				
				try {
					const db = uniCloud.database();
					const exercisesCollection = db.collection('fit996_exercises');
					const { result } = await exercisesCollection.get();
					
					if (result && result.data) {
						// 转换数据格式以适应新UI
						this.exercises = result.data.map(item => {
							// 将target_muscles数组转换为字符串
							const targetStr = item.target_muscles ? item.target_muscles.join('、') : '';
							
							// 设置器材分类
							let equipment = 'all';
							if (item.equipment_type) {
								if (item.equipment_type.includes('杠铃')) {
									equipment = 'barbell';
								} else if (item.equipment_type.includes('哑铃')) {
									equipment = 'dumbbell';
								} else if (item.equipment_type.includes('史密斯')) {
									equipment = 'smith';
								} else if (item.equipment_type.includes('器械')) {
									equipment = 'machine';
								} else if (item.equipment_type.includes('绳索')) {
									equipment = 'cable';
								}
							}
							
							return {
								name: item.name,
								target: targetStr,
								target_muscles: item.target_muscles || [],
								difficulty: item.difficulty, // 数据库中是1-3的整数
								equipment: equipment,
								description: item.description,
								image_url: item.image_url || '/static/exercises/placeholder.svg',
								id: item._id
							};
						});
					} else {
						this.exercises = [];
					}
				} catch (err) {
					console.error('获取动作数据失败:', err);
					this.error = '获取动作数据失败，请稍后重试';
				} finally {
					this.loading = false;
				}
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.search-bar {
		background-color: #f5f5f5;
		border-radius: 30rpx;
		padding: 15rpx 30rpx;
		margin: 20rpx 30rpx;
	}

	.search-bar input {
		height: 60rpx;
		font-size: 28rpx;
	}

	/* 主体内容区域 */
	.main-container {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	/* 左侧侧边栏 */
	.sidebar {
		width: 120rpx;
		background-color: #f8f8f8;
		height: 100%;
		overflow-y: auto;
	}

	.sidebar-item {
		padding: 30rpx 0;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		border-left: 6rpx solid transparent;
	}

	.sidebar-item.active {
		color: #1296db;
		border-left: 6rpx solid #1296db;
		background-color: #fff;
	}

	/* 右侧内容区域 */
	.content-area {
		flex: 1;
		padding: 0 20rpx 20rpx 20rpx;
		overflow-y: auto;
		background-color: #fff;
	}

	/* 顶部器材分类标签 */
	.equipment-tabs {
		display: flex;
		flex-direction: row;
		overflow-x: scroll;
		margin: 20rpx 0;
		white-space: nowrap;
		padding-bottom: 10rpx;
	}

	.tab-item {
		padding: 15rpx 30rpx;
		margin-right: 20rpx;
		border-radius: 30rpx;
		background-color: #f5f5f5;
		font-size: 28rpx;
	}

	.tab-item.active {
		background-color: #1296db;
		color: #ffffff;
	}

	/* 当前分类标题 */
	.current-category-title {
		font-size: 36rpx;
		font-weight: bold;
		margin: 20rpx 0 30rpx 0;
		color: #333;
	}

	/* 动作网格布局 */
	.exercise-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 30rpx;
	}

	.exercise-card {
		width: calc(50% - 15rpx);
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.exercise-image {
		width: 100%;
		height: 240rpx;
		background-color: #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.exercise-image image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.exercise-info {
		padding: 20rpx;
	}

	.exercise-name {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.exercise-target {
		font-size: 24rpx;
		color: #666;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 加载、错误和空数据提示 */
	.empty-tip {
		padding: 100rpx 0;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}

	.loading-container {
		padding: 100rpx 0;
		text-align: center;
	}

	.loading-text {
		color: #1296db;
		font-size: 28rpx;
	}

	.error-container {
		padding: 100rpx 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
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