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

export class QwenImage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qwen Image (通义万相)',
		name: 'qwenImage',
		icon: 'fa:image',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: '阿里云通义万相图片生成',
		defaults: {
			name: 'Qwen Image',
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
				displayName: '操作',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: '文生图',
						value: 'textToImage',
						description: '根据文字描述生成图片',
					},
					{
						name: '图像合成',
						value: 'imageSynthesis',
						description: '图像合成',
					},
				],
				default: 'textToImage',
			},
			{
				displayName: '模型',
				name: 'model',
				type: 'resourceLocator',
				displayOptions: {
					show: {
						operation: ['textToImage'],
					},
				},
				default: { mode: 'list', value: '' },
				required: true,
				modes: [
					{
						displayName: '从列表',
						name: 'list',
						type: 'list',
						placeholder: '选择模型...',
						typeOptions: {
							searchListMethod: 'searchImageModels',
							searchable: true,
						},
					},
					{
						displayName: '通过ID',
						name: 'id',
						type: 'string',
						placeholder: '例如: wanx-v1',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^wanx.*',
									errorMessage: '模型ID必须以wanx开头',
								},
							},
						],
					},
				],
				description: '选择图片生成模型',
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
				description: '图片描述提示词',
			},
			{
				displayName: '负面提示词',
				name: 'negative_prompt',
				type: 'string',
				typeOptions: {
					rows: 2,
				},
				default: '',
				description: '负面提示词，描述不想要的内容',
			},
			{
				displayName: '附加选项',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: '添加选项',
				default: {},
				options: [
					{
						displayName: '图片尺寸',
						name: 'size',
						type: 'options',
						options: [
							{
								name: '1024x1024',
								value: '1024*1024',
							},
							{
								name: '720x1280',
								value: '720*1280',
							},
							{
								name: '1280x720',
								value: '1280*720',
							},
							{
								name: '512x512',
								value: '512*512',
							},
						],
						default: '1024*1024',
						description: '生成图片的尺寸',
					},
					{
						displayName: '生成数量',
						name: 'n',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 4,
						},
						default: 1,
						description: '生成图片数量 (1-4)',
					},
					{
						displayName: '风格',
						name: 'style',
						type: 'options',
						options: [
							{
								name: '自动',
								value: '<auto>',
							},
							{
								name: '摄影',
								value: '<photography>',
							},
							{
								name: '人像写真',
								value: '<portrait>',
							},
							{
								name: '3D卡通',
								value: '<3d cartoon>',
							},
							{
								name: '动画',
								value: '<anime>',
							},
							{
								name: '油画',
								value: '<oil painting>',
							},
							{
								name: '水彩',
								value: '<watercolor>',
							},
							{
								name: '素描',
								value: '<sketch>',
							},
							{
								name: '中国画',
								value: '<chinese painting>',
							},
							{
								name: '扁平插画',
								value: '<flat illustration>',
							},
						],
						default: '<auto>',
						description: '图片风格',
					},
					{
						displayName: '随机种子',
						name: 'seed',
						type: 'number',
						default: 42,
						description: '随机种子，用于复现结果',
					},
					{
						displayName: '参考图片URL',
						name: 'ref_img',
						type: 'string',
						default: '',
						description: '参考图片URL（用于图生图）',
					},
					{
						displayName: '参考强度',
						name: 'ref_strength',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
							numberPrecision: 2,
						},
						default: 0.5,
						description: '参考图片影响强度 (0-1)',
					},
				],
			},
		],
	};

	methods = {
		listSearch: {
			async searchImageModels(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
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
							.filter((model: any) => model.id && model.id.startsWith('wanx'))
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
					console.log('无法从API获取图片模型列表，使用默认列表');
				}

				// 默认图片模型列表（作为后备）
				let defaultModels = [
					{ name: 'wanx-v1 (通用)', value: 'wanx-v1' },
					{ name: 'wanx-sketch-to-image-v1 (草图生图)', value: 'wanx-sketch-to-image-v1' },
					{ name: 'wanx-style-repaint-v1 (风格重绘)', value: 'wanx-style-repaint-v1' },
					{ name: 'wanx-background-generation-v2 (背景生成)', value: 'wanx-background-generation-v2' },
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
				const operation = this.getNodeParameter('operation', i) as string;
				const prompt = this.getNodeParameter('prompt', i) as string;
				const negativePrompt = this.getNodeParameter('negative_prompt', i, '') as string;
				const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

				// 获取模型 - 支持resourceLocator类型
				let model = 'wanx-v1';
				if (operation === 'textToImage') {
					const modelResource = this.getNodeParameter('model', i) as { mode: string; value: string };
					model = modelResource.value;
				}

				// 构建请求体（阿里云原生格式 - 图片生成不支持OpenAI格式）
				const requestBody: any = {
					model: model,
					input: {
						prompt: prompt,
					},
					parameters: {},
				};

				if (negativePrompt) {
					requestBody.input.negative_prompt = negativePrompt;
				}

				// 添加可选参数
				if (additionalOptions.size) {
					requestBody.parameters.size = additionalOptions.size;
				}
				if (additionalOptions.n) {
					requestBody.parameters.n = additionalOptions.n;
				}
				if (additionalOptions.style) {
					requestBody.parameters.style = additionalOptions.style;
				}
				if (additionalOptions.seed !== undefined) {
					requestBody.parameters.seed = additionalOptions.seed;
				}
				if (additionalOptions.ref_img) {
					requestBody.input.ref_img = additionalOptions.ref_img;
				}
				if (additionalOptions.ref_strength !== undefined) {
					requestBody.parameters.ref_strength = additionalOptions.ref_strength;
				}

				// 图片生成需要使用原生API端点
				// 如果用户配置的是compatible-mode，自动转换为原生API
				let imageEndpoint = credentials.apiEndpoint as string;
				if (imageEndpoint.includes('compatible-mode')) {
					imageEndpoint = imageEndpoint.replace('/compatible-mode/v1', '/api/v1');
				}

				// 发送请求
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'qwenApi',
					{
						method: 'POST',
						url: `${imageEndpoint}/services/aigc/text2image/image-synthesis`,
						body: requestBody,
						json: true,
					},
				);

				// 提取图片URL
				const images = response.output?.results || [];
				
				returnData.push({
					json: {
						images: images,
						taskId: response.output?.task_id || '',
						fullResponse: response,
					},
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
