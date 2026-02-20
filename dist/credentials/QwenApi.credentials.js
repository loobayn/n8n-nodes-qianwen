"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QwenApi = void 0;
class QwenApi {
    constructor() {
        this.name = 'qwenApi';
        this.displayName = 'Qwen API';
        this.documentationUrl = 'https://help.aliyun.com/zh/model-studio/';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: '阿里云通义千问 API Key',
            },
            {
                displayName: 'API Endpoint',
                name: 'apiEndpoint',
                type: 'string',
                default: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
                required: true,
                description: 'API 端点地址（推荐使用 OpenAI 兼容模式）',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Authorization': '=Bearer {{$credentials.apiKey}}',
                    'Content-Type': 'application/json',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.apiEndpoint}}',
                url: '/models',
                method: 'GET',
                headers: {
                    'Authorization': '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.QwenApi = QwenApi;
