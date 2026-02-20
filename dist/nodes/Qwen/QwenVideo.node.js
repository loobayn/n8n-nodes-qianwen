"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QwenVideo = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class QwenVideo {
    constructor() {
        this.description = {
            displayName: 'Qwen Video (通义视频)',
            name: 'qwenVideo',
            icon: 'fa:video',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: '阿里云通义千问视频生成',
            defaults: {
                name: 'Qwen Video',
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
                            name: '文生视频',
                            value: 'textToVideo',
                            description: '根据文字描述生成视频',
                        },
                        {
                            name: '图生视频',
                            value: 'imageToVideo',
                            description: '根据图片生成视频',
                        },
                        {
                            name: '查询任务状态',
                            value: 'getTaskStatus',
                            description: '查询视频生成任务状态',
                        },
                    ],
                    default: 'textToVideo',
                },
                {
                    displayName: '模型',
                    name: 'model',
                    type: 'resourceLocator',
                    displayOptions: {
                        show: {
                            operation: ['textToVideo', 'imageToVideo'],
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
                                searchListMethod: 'searchVideoModels',
                                searchable: true,
                            },
                        },
                        {
                            displayName: '通过ID',
                            name: 'id',
                            type: 'string',
                            placeholder: '例如: videosynth-v1',
                            validation: [
                                {
                                    type: 'regex',
                                    properties: {
                                        regex: '^video.*',
                                        errorMessage: '模型ID必须以video开头',
                                    },
                                },
                            ],
                        },
                    ],
                    description: '选择视频生成模型',
                },
                {
                    displayName: '提示词',
                    name: 'prompt',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['textToVideo', 'imageToVideo'],
                        },
                    },
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    required: true,
                    description: '视频描述提示词',
                },
                {
                    displayName: '任务ID',
                    name: 'taskId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['getTaskStatus'],
                        },
                    },
                    default: '',
                    required: true,
                    description: '要查询的任务ID',
                },
                {
                    displayName: '图片URL',
                    name: 'imageUrl',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['imageToVideo'],
                        },
                    },
                    default: '',
                    required: true,
                    description: '起始图片URL（图生视频）',
                },
                {
                    displayName: '附加选项',
                    name: 'additionalOptions',
                    type: 'collection',
                    placeholder: '添加选项',
                    displayOptions: {
                        show: {
                            operation: ['textToVideo', 'imageToVideo'],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: '时长',
                            name: 'duration',
                            type: 'options',
                            options: [
                                {
                                    name: '5秒',
                                    value: 5,
                                },
                                {
                                    name: '10秒',
                                    value: 10,
                                },
                            ],
                            default: 5,
                            description: '视频时长（秒）',
                        },
                        {
                            displayName: '分辨率',
                            name: 'resolution',
                            type: 'options',
                            options: [
                                {
                                    name: '1280x720',
                                    value: '1280*720',
                                },
                                {
                                    name: '720x1280',
                                    value: '720*1280',
                                },
                            ],
                            default: '1280*720',
                            description: '视频分辨率',
                        },
                        {
                            displayName: '帧率',
                            name: 'fps',
                            type: 'options',
                            options: [
                                {
                                    name: '24',
                                    value: 24,
                                },
                                {
                                    name: '30',
                                    value: 30,
                                },
                            ],
                            default: 24,
                            description: '视频帧率',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            listSearch: {
                async searchVideoModels(filter) {
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
                                .filter((model) => model.id && model.id.startsWith('video'))
                                .map((model) => ({
                                name: model.id,
                                value: model.id,
                            }));
                            // 如果有搜索过滤
                            if (filter) {
                                const filterLower = filter.toLowerCase();
                                models = models.filter((model) => model.name.toLowerCase().includes(filterLower));
                            }
                            return { results: models };
                        }
                    }
                    catch (error) {
                        console.log('无法从API获取视频模型列表，使用默认列表');
                    }
                    // 默认视频模型列表（作为后备）
                    let defaultModels = [
                        { name: 'videosynth-v1', value: 'videosynth-v1' },
                    ];
                    if (filter) {
                        const filterLower = filter.toLowerCase();
                        defaultModels = defaultModels.filter((model) => model.name.toLowerCase().includes(filterLower));
                    }
                    return { results: defaultModels };
                },
            },
        };
    }
    async execute() {
        var _a, _b, _c, _d;
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('qwenApi');
        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i);
                if (operation === 'getTaskStatus') {
                    // 查询任务状态
                    const taskId = this.getNodeParameter('taskId', i);
                    // 视频生成需要使用原生API端点
                    let videoEndpoint = credentials.apiEndpoint;
                    if (videoEndpoint.includes('compatible-mode')) {
                        videoEndpoint = videoEndpoint.replace('/compatible-mode/v1', '/api/v1');
                    }
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'qwenApi', {
                        method: 'GET',
                        url: `${videoEndpoint}/tasks/${taskId}`,
                        json: true,
                    });
                    returnData.push({
                        json: {
                            taskId: taskId,
                            status: ((_a = response.output) === null || _a === void 0 ? void 0 : _a.task_status) || '',
                            videoUrl: ((_b = response.output) === null || _b === void 0 ? void 0 : _b.video_url) || '',
                            fullResponse: response,
                        },
                        pairedItem: { item: i },
                    });
                }
                else {
                    // 生成视频
                    const modelResource = this.getNodeParameter('model', i);
                    const model = modelResource.value;
                    const prompt = this.getNodeParameter('prompt', i);
                    const additionalOptions = this.getNodeParameter('additionalOptions', i, {});
                    const requestBody = {
                        model: model,
                        input: {
                            prompt: prompt,
                        },
                        parameters: {},
                    };
                    // 图生视频需要添加图片URL
                    if (operation === 'imageToVideo') {
                        const imageUrl = this.getNodeParameter('imageUrl', i);
                        requestBody.input.image_url = imageUrl;
                    }
                    // 添加可选参数
                    if (additionalOptions.duration) {
                        requestBody.parameters.duration = additionalOptions.duration;
                    }
                    if (additionalOptions.resolution) {
                        requestBody.parameters.resolution = additionalOptions.resolution;
                    }
                    if (additionalOptions.fps) {
                        requestBody.parameters.fps = additionalOptions.fps;
                    }
                    // 视频生成需要使用原生API端点
                    let videoEndpoint = credentials.apiEndpoint;
                    if (videoEndpoint.includes('compatible-mode')) {
                        videoEndpoint = videoEndpoint.replace('/compatible-mode/v1', '/api/v1');
                    }
                    // 发送请求
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'qwenApi', {
                        method: 'POST',
                        url: `${videoEndpoint}/services/aigc/video-generation/generation`,
                        body: requestBody,
                        json: true,
                    });
                    returnData.push({
                        json: {
                            taskId: ((_c = response.output) === null || _c === void 0 ? void 0 : _c.task_id) || '',
                            taskStatus: ((_d = response.output) === null || _d === void 0 ? void 0 : _d.task_status) || 'PENDING',
                            message: '视频生成任务已提交，请使用"Get Task Status"操作查询进度',
                            fullResponse: response,
                        },
                        pairedItem: { item: i },
                    });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
            }
        }
        return [returnData];
    }
}
exports.QwenVideo = QwenVideo;
