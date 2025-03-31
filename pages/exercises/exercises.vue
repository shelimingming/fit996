<template>
	<view class="content">
		<view class="search-bar">
			<input type="text" placeholder="搜索动作" v-model="searchText" />
		</view>
		
		<view class="category-tabs">
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
		
		<view class="exercise-list">
			<view class="exercise-item" v-for="(item, index) in filteredExercises" :key="index">
				<view class="exercise-info">
					<text class="exercise-name">{{item.name}}</text>
					<text class="exercise-target">{{item.target}}</text>
				</view>
				<view class="exercise-difficulty">
					<text :class="'difficulty-' + item.difficulty">{{difficultyText[item.difficulty]}}</text>
				</view>
			</view>
		</view>
		
		<view class="empty-tip" v-if="filteredExercises.length === 0">
			<text>暂无相关动作</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				currentCategory: 0,
				categories: [
					{ name: '全部', id: 'all' },
					{ name: '上肢', id: 'upper' },
					{ name: '下肢', id: 'lower' },
					{ name: '核心', id: 'core' },
					{ name: '有氧', id: 'cardio' },
					{ name: '拉伸', id: 'stretch' }
				],
				exercises: [
					{ name: '俯卧撑', target: '胸肌、肱三头肌', difficulty: 'medium', category: 'upper' },
					{ name: '深蹲', target: '股四头肌、臀肌', difficulty: 'medium', category: 'lower' },
					{ name: '平板支撑', target: '腹肌、核心肌群', difficulty: 'easy', category: 'core' },
					{ name: '引体向上', target: '背阔肌、肱二头肌', difficulty: 'hard', category: 'upper' },
					{ name: '弓步蹲', target: '股四头肌、臀肌', difficulty: 'medium', category: 'lower' },
					{ name: '仰卧起坐', target: '腹直肌', difficulty: 'easy', category: 'core' },
					{ name: '高抬腿', target: '心肺功能、下肢', difficulty: 'medium', category: 'cardio' },
					{ name: '坐姿前屈', target: '腘绳肌、背部', difficulty: 'easy', category: 'stretch' },
					{ name: '跳绳', target: '全身、心肺功能', difficulty: 'medium', category: 'cardio' },
					{ name: '颈部拉伸', target: '颈部肌肉', difficulty: 'easy', category: 'stretch' }
				],
				difficultyText: {
					easy: '初级',
					medium: '中级',
					hard: '高级'
				}
			}
		},
		computed: {
			filteredExercises() {
				let result = this.exercises;
				
				// 按分类筛选
				if (this.currentCategory !== 0) {
					const categoryId = this.categories[this.currentCategory].id;
					result = result.filter(item => item.category === categoryId);
				}
				
				// 按搜索文本筛选
				if (this.searchText.trim()) {
					const keyword = this.searchText.toLowerCase();
					result = result.filter(item => 
						item.name.toLowerCase().includes(keyword) || 
						item.target.toLowerCase().includes(keyword)
					);
				}
				
				return result;
			}
		},
		onLoad() {
			// 页面加载时可以从服务器获取动作数据
		},
		methods: {
			switchCategory(index) {
				this.currentCategory = index;
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
	}

	.search-bar {
		background-color: #f5f5f5;
		border-radius: 30rpx;
		padding: 15rpx 30rpx;
		margin-bottom: 30rpx;
	}

	.search-bar input {
		height: 60rpx;
		font-size: 28rpx;
	}

	.category-tabs {
		display: flex;
		flex-direction: row;
		overflow-x: scroll;
		margin-bottom: 30rpx;
		white-space: nowrap;
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

	.exercise-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.exercise-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.exercise-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}

	.exercise-target {
		font-size: 26rpx;
		color: #666;
		display: block;
	}

	.difficulty-easy {
		color: #52c41a;
		font-size: 26rpx;
	}

	.difficulty-medium {
		color: #faad14;
		font-size: 26rpx;
	}

	.difficulty-hard {
		color: #f5222d;
		font-size: 26rpx;
	}

	.empty-tip {
		padding: 100rpx 0;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}
</style>