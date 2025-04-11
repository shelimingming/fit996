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
				categories: [],
				muscleGroups: [],
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
		methods: {
			// 查看动作详情
			viewExerciseDetail(exercise) {
				uni.navigateTo({
					url: `/pages/exercises/detail?id=${exercise.id}`
				});
			}
		},
		computed: {
			filteredExercises() {
				let result = this.exercises;
				
				// 按肌肉群组筛选
				if (this.currentMuscleGroup !== 0) {
					const muscleGroupId = this.muscleGroups[this.currentMuscleGroup].id;
					console.log('当前选中肌群ID:', this.muscleGroups);
					console.log('当前选中肌群ID:', this.currentMuscleGroup);
					console.log('当前选中肌群ID:', muscleGroupId);
					result = result.filter(item => {
						const hasTargetMuscle = item.target_muscles && item.target_muscles.includes(muscleGroupId);
						console.log('动作:', item.name, '目标肌群:', item.target_muscles, '是否匹配:', hasTargetMuscle);
						return hasTargetMuscle;
					});
				}
				
				// 按器材分类筛选
				if (this.currentCategory !== 0) {
					const equipmentId = this.categories[this.currentCategory].id;
					console.log('当前选中器材ID:', equipmentId);
					result = result.filter(item => {
						// 如果当前选择的是"全部"，则不进行筛选
						if (equipmentId === 'all') {
							return true;
						}
						
						// 确保item.equipment是数组
						if (!Array.isArray(item.equipment)) {
							console.log('动作:', item.name, '器材未定义或格式错误');
							return false;
						}
						
						// 检查器材ID是否在数组中
						const hasEquipment = item.equipment.includes(equipmentId);
						console.log('动作:', item.name, '器材:', item.equipment, '是否包含所选器材:', hasEquipment);
						return hasEquipment;
					});
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
		async onLoad() {
			try {
				// 先加载分类数据
				await Promise.all([
					this.fetchMuscleGroups(),
					this.fetchEquipment()
				]);
				// 再加载动作数据
				await this.fetchExercises();
			} catch (err) {
				console.error('初始化数据失败:', err);
				this.error = '加载数据失败，请稍后重试';
			}
		},
		methods: {
			// 获取肌肉组数据
			async fetchMuscleGroups() {
				try {
					const db = uniCloud.database();
					const { result } = await db.collection('fit996_muscles').get();
					if (result && result.data) {
						// 添加"全部"选项
						this.muscleGroups = [
							{ name: '全部', id: 'all' },
							...result.data.map(item => ({
								name: item.name,
								id: item._id
							}))
						];
					}
				} catch (err) {
					console.error('获取肌肉组数据失败:', err);
					throw err;
				}
			},

			// 获取器材分类数据
			async fetchEquipment() {
				try {
					const db = uniCloud.database();
					const { result } = await db.collection('fit996_equipment').get();
					if (result && result.data) {
						// 添加"全部"选项
						this.categories = [
							{ name: '全部', id: 'all' },
							...result.data.map(item => ({
								name: item.name,
								id: item._id
							}))
						];
					}
				} catch (err) {
					console.error('获取器材分类数据失败:', err);
					throw err;
				}
			},
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
						this.exercises = result.data.map(item => {
							// 确保equipment和target_muscles是数组，并且只包含ID
							const equipment = Array.isArray(item.equipment) ? item.equipment.map(eq => {
								// 如果是ID格式（24位十六进制字符串），直接返回
								if (typeof eq === 'string' && /^[0-9a-fA-F]{24}$/.test(eq)) {
									return eq;
								}
								// 在categories中查找对应的ID
								const found = this.categories.find(cat => cat.name === eq);
								return found ? found.id : null;
							}).filter(Boolean) : [];

							const target_muscles = Array.isArray(item.target_muscles) ? item.target_muscles.map(muscle => {
								// 如果是ID格式，直接返回
								if (typeof muscle === 'string' && /^[0-9a-fA-F]{24}$/.test(muscle)) {
									return muscle;
								}
								// 在muscleGroups中查找对应的ID
								const found = this.muscleGroups.find(m => m.name === muscle);
								return found ? found.id : null;
							}).filter(Boolean) : [];

							return {
								name: item.name,
								target_muscles: target_muscles,
								difficulty: item.difficulty,
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

	/* 隐藏侧边栏滚动条 */
	.sidebar::-webkit-scrollbar {
		display: none;
	}

	.sidebar {
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}

	.sidebar-item {
		padding: 25rpx 0;
		text-align: center;
		font-size: 24rpx;
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
		margin: 10rpx 0;
		white-space: nowrap;
	}

	/* 隐藏器材分类标签滚动条 */
	.equipment-tabs::-webkit-scrollbar {
		display: none;
	}

	.equipment-tabs {
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}

	.tab-item {
		padding: 8rpx 20rpx;
		margin-right: 15rpx;
		border-radius: 20rpx;
		background-color: #f5f5f5;
		font-size: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.tab-item.active {
		background-color: #1296db;
		color: #ffffff;
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