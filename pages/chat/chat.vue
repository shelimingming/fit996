<template>
	<view class="chat-container">
		<scroll-view class="message-list" scroll-y="true" :scroll-top="scrollTop">
			<view class="message-item" v-for="(message, index) in messages" :key="index" :class="message.type">
				<image class="avatar" :src="message.type === 'received' ? '/static/coach.png' : '/static/logo.png'"></image>
				<view class="message-content">
					<text class="message-text">{{message.content}}</text>
				</view>
			</view>
		</scroll-view>
		
		<view class="input-area">
			<input class="message-input" v-model="inputMessage" placeholder="输入消息..." @confirm="sendMessage" />
			<button class="send-button" @click="sendMessage">发送</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messages: [
					{
						type: 'received',
						content: '你好！我是你的私人健身教练。有什么可以帮你的吗？'
					}
				],
				inputMessage: '',
				scrollTop: 0
			}
		},
		methods: {
			sendMessage() {
				if (!this.inputMessage.trim()) return;
				
				// 添加用户消息
				this.messages.push({
					type: 'sent',
					content: this.inputMessage
				});
				
				// 清空输入框
				this.inputMessage = '';
				
				// 模拟教练回复
				setTimeout(() => {
					this.messages.push({
						type: 'received',
						content: '好的，我明白了。让我来帮你制定一个合适的训练计划。'
					});
					this.scrollToBottom();
				}, 1000);
				
				this.scrollToBottom();
			},
			scrollToBottom() {
				setTimeout(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.message-list').boundingClientRect(data => {
						this.scrollTop = data.height * 2;
					}).exec();
				}, 100);
			}
		}
	}
</script>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f5f5;
	}
	
	.chat-header {
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		border-bottom: 1rpx solid #eee;
	}
	
	.message-list {
		flex: 1;
		padding: 20rpx;
	}
	
	.message-item {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.message-item.sent {
		flex-direction: row-reverse;
	}
	
	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		margin: 0 20rpx;
	}
	
	.message-content {
		max-width: 60%;
		padding: 20rpx;
		border-radius: 10rpx;
		word-wrap: break-word;
	}
	
	.received .message-content {
		background-color: #ffffff;
	}
	
	.sent .message-content {
		background-color: #1296db;
	}
	
	.sent .message-text {
		color: #ffffff;
	}
	
	.input-area {
		display: flex;
		padding: 20rpx;
		background-color: #ffffff;
		border-top: 1rpx solid #eee;
	}
	
	.message-input {
		flex: 1;
		height: 70rpx;
		padding: 0 20rpx;
		background-color: #f5f5f5;
		border-radius: 35rpx;
		font-size: 28rpx;
	}
	
	.send-button {
		width: 120rpx;
		height: 70rpx;
		margin-left: 20rpx;
		background-color: #1296db;
		color: #ffffff;
		font-size: 28rpx;
		line-height: 70rpx;
	}
</style>