import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeListSearchResult,
	NodeOperationError,
} from 'n8n-workflow';

export class Qwen implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qwen (通义千问)',
		name: 'qwen',
		icon: 'fa:comments',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["model"]}}',
		description: '阿里云通义千问大语言模型',
		defaults: {
			name: 'Qwen',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'qwenApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: '模型',
				name: 'model',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				modes: [
					{
						displayName: '从列表',
						name: 'list',
						type: 'list',
						placeholder: '选择模型...',
						typeOptions: {
							searchListMethod: 'searchModels',
							searchable: true,
						},
					},
					{
						displayName: '通过ID',
						name: 'id',
						type: 'string',
						placeholder: '例如: qwen-turbo',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^qwen.*',
									errorMessage: '模型ID必须以qwen开头',
								},
							},
						],
					},
				],
				description: '选择要使用的模型',
			},
			{
				displayName: '提示词',
				name: 'prompt',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				description: '输入提示词',
			},
			{
				displayName: '启用联网搜索',
				name: 'enable_search',
				type: 'boolean',
				default: false,
				description: '是否启用联网搜索功能，获取最新信息',
			},
			{
				displayName: '启用深度思考',
				name: 'enable_deep_thinking',
				type: 'boolean',
				default: false,
				description: '是否启用深度思考模式（会在响应中包含reasoning字段，增加token消耗）',
			},
			{
				displayName: '附加选项',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: '添加选项',
				default: {},
				options: [
					{
						displayName: '系统消息',
						name: 'systemMessage',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						description: '系统消息，用于设定AI的角色和行为',
					},
					{
						displayName: '对话历史',
						name: 'conversationHistory',
						type: 'json',
						default: '[]',
						description: '对话历史记录，JSON数组格式 [{"role":"user","content":"..."},{"role":"assistant","content":"..."}]',
					},
					{
						displayName: '温度',
						name: 'temperature',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 1,
						},
						default: 1,
						description: '控制随机性，值越大越随机 (0-2)',
					},
					{
						displayName: 'Top P',
						name: 'top_p',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
							numberPrecision: 2,
						},
						default: 0.8,
						description: '核采样参数 (0-1)',
					},
					{
						displayName: '最大Token数',
						name: 'max_tokens',
						type: 'number',
						default: 1500,
						description: '最大生成token数',
					},
					{
						displayName: '重复惩罚',
						name: 'repetition_penalty',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 2,
							numberPrecision: 1,
						},
						default: 1.1,
						description: '重复惩罚参数，用于控制生成文本的重复度 (1.0-2.0)',
					},
					{
						displayName: '停止序列',
						name: 'stop',
						type: 'string',
						default: '',
						description: '停止序列，多个用逗号分隔',
					},
					{
						displayName: '随机种子',
						name: 'seed',
						type: 'number',
						default: 1234,
						description: '随机种子，用于复现结果',
					},
					{
						displayName: '流式输出',
						name: 'stream',
						type: 'boolean',
						default: false,
						description: '是否使用流式输出（注意：N8N中建议关闭）',
					},
				],
			},
		],
	};

	methods = {
		listSearch: {
			async searchModels(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				const credentials = await this.getCredentials('qwenApi');
				
				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${credentials.apiEndpoint}/models`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					});

					if (response.data && Array.isArray(response.data)) {
						let models = response.data
							.filter((model: any) => model.id && model.id.startsWith('qwen'))
							.map((model: any) => ({
								name: model.id,
								value: model.id,
							}));

						// 如果有搜索过滤
						if (filter) {
							const filterLower = filter.toLowerCase();
							models = models.filter((model: INodePropertyOptions) => 
								model.name.toLowerCase().includes(filterLower)
							);
						}

						return { results: models };
					}
				} catch (error) {
					console.log('无法从API获取模型列表，使用默认列表');
				}

				// 默认模型列表（作为后备）
				let defaultModels = [
					{ name: 'qwen-turbo', value: 'qwen-turbo' },
					{ name: 'qwen-plus', value: 'qwen-plus' },
					{ name: 'qwen-max', value: 'qwen-max' },
					{ name: 'qwen-max-longcontext', value: 'qwen-max-longcontext' },
					{ name: 'qwen-vl-plus', value: 'qwen-vl-plus' },
					{ name: 'qwen-vl-max', value: 'qwen-vl-max' },
					{ name: 'qwen2.5-72b-instruct', value: 'qwen2.5-72b-instruct' },
					{ name: 'qwen2.5-32b-instruct', value: 'qwen2.5-32b-instruct' },
					{ name: 'qwen2.5-14b-instruct', value: 'qwen2.5-14b-instruct' },
					{ name: 'qwen2.5-7b-instruct', value: 'qwen2.5-7b-instruct' },
				];

				if (filter) {
					const filterLower = filter.toLowerCase();
					defaultModels = defaultModels.filter((model: INodePropertyOptions) => 
						model.name.toLowerCase().includes(filterLower)
					);
				}

				return { results: defaultModels };
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('qwenApi');

		for (let i = 0; i < items.length; i++) {
			try {
				// 获取模型 - 支持resourceLocator类型
				const modelResource = this.getNodeParameter('model', i) as { mode: string; value: string };
				const model = modelResource.value;
				
				const prompt = this.getNodeParameter('prompt', i) as string;
				const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;
				
				// 从附加选项中获取系统消息和对话历史
				const systemMessage = additionalOptions.systemMessage || '';
				const conversationHistoryStr = additionalOptions.conversationHistory || '[]';

				// 解析对话历史
				let conversationHistory = [];
				try {
					conversationHistory = JSON.parse(conversationHistoryStr);
				} catch (error) {
					conversationHistory = [];
				}

				// 构建消息数组（OpenAI格式）
				const messages: any[] = [];
				
				if (systemMessage) {
					messages.push({
						role: 'system',
						content: systemMessage,
					});
				}

				// 添加历史对话
				if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
					messages.push(...conversationHistory);
				}

				// 添加当前用户消息
				messages.push({
					role: 'user',
					content: prompt,
				});

				// 构建请求体（OpenAI兼容格式）
				const requestBody: any = {
					model: model,
					messages: messages,
				};

				// 添加可选参数
				if (additionalOptions.temperature !== undefined) {
					requestBody.temperature = additionalOptions.temperature;
				}
				if (additionalOptions.top_p !== undefined) {
					requestBody.top_p = additionalOptions.top_p;
				}
				if (additionalOptions.max_tokens !== undefined) {
					requestBody.max_tokens = additionalOptions.max_tokens;
				}
				if (additionalOptions.repetition_penalty !== undefined) {
					requestBody.frequency_penalty = additionalOptions.repetition_penalty;
				}
				if (additionalOptions.seed !== undefined) {
					requestBody.seed = additionalOptions.seed;
				}
				if (additionalOptions.stop) {
					requestBody.stop = additionalOptions.stop.split(',').map((s: string) => s.trim());
				}
				if (additionalOptions.stream !== undefined) {
					requestBody.stream = additionalOptions.stream;
				}
				
				// 通义千问特有参数（从顶层字段获取）
				// 注意：在OpenAI兼容模式下，这些参数应该作为顶层参数，而不是在extra_body中
				
				// 获取联网搜索开关（从顶层字段）
				const enableSearch = this.getNodeParameter('enable_search', i, false) as boolean;
				if (enableSearch === true) {
					requestBody.enable_search = true;
				}
				
				// 获取深度思考开关（从顶层字段）
				// 对于qwen3.5-plus等默认开启的模型，必须明确传递false
				const enableDeepThinking = this.getNodeParameter('enable_deep_thinking', i, false) as boolean;
				if (enableDeepThinking === true) {
					requestBody.enable_thinking = true;
				} else {
					requestBody.enable_thinking = false;
				}

				// 发送请求（OpenAI兼容端点）
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'qwenApi',
					{
						method: 'POST',
						url: `${credentials.apiEndpoint}/chat/completions`,
						body: requestBody,
						json: true,
					},
				);

				// 提取响应内容（OpenAI格式）
				let outputText = '';
				let reasoningContent = '';
				let finishReason = '';
				let fullResponse = response;

				if (response.choices && response.choices[0] && response.choices[0].message) {
					outputText = response.choices[0].message.content;
					// 提取深度思考内容
					if (response.choices[0].message.reasoning_content) {
						reasoningContent = response.choices[0].message.reasoning_content;
					}
					// 提取完成原因
					if (response.choices[0].finish_reason) {
						finishReason = response.choices[0].finish_reason;
					}
				}

				// 更新对话历史
				const updatedHistory = [...messages, {
					role: 'assistant',
					content: outputText,
				}];

				// 构建返回数据
				const resultData: any = {
					text: outputText,
					conversationHistory: updatedHistory,
					usage: response.usage || {},
					model: response.model || model,
					finishReason: finishReason,
				};

				// 如果有深度思考内容，单独返回
				if (reasoningContent) {
					resultData.reasoning = reasoningContent;
					resultData.hasReasoning = true;
				}

				// 完整响应放在最后（可选）
				resultData.fullResponse = fullResponse;

				returnData.push({
					json: resultData,
					pairedItem: { item: i },
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error);
			}
		}

		return [returnData];
	}
}
