# n8n-nodes-qianwen

[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-qianwen)](https://www.npmjs.com/package/n8n-nodes-qianwen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![N8N Community](https://img.shields.io/badge/n8n-community-FF6D5A)](https://n8n.io)

N8N community nodes for Alibaba Cloud Qwen (通义千问) - Powerful AI capabilities including text generation, image generation, and video generation.

[English](#english) | [中文](#中文)

---

## English

### Features

This package provides three powerful nodes for N8N:

#### 1. 🤖 Qwen (Text Generation)
- **Multiple Models**: Support for Qwen-Turbo, Qwen-Plus, Qwen-Max, Qwen3.5-Plus, and more
- **Web Search**: Enable real-time internet search for up-to-date information
- **Deep Thinking**: Advanced reasoning mode with visible thought process
- **Conversation History**: Multi-turn dialogue support
- **Vision Models**: Support for multimodal models (text + images)
- **Full Parameter Control**: Temperature, top_p, max_tokens, and more

#### 2. 🎨 Qwen Image (Image Generation)
- **Text-to-Image**: Generate images from text descriptions
- **Image-to-Image**: Transform existing images
- **Multiple Styles**: Photography, anime, oil painting, watercolor, sketch, and more
- **Custom Sizes**: 1024x1024, 720x1280, 1280x720, 512x512
- **Negative Prompts**: Specify what you don't want in the image
- **Batch Generation**: Generate up to 4 images at once

#### 3. 🎬 Qwen Video (Video Generation)
- **Text-to-Video**: Create videos from text descriptions
- **Image-to-Video**: Animate static images
- **Task Management**: Query generation status
- **Custom Settings**: Duration, resolution, frame rate

### Installation

#### Method 1: NPM (Recommended)

```bash
npm install n8n-nodes-qianwen
```

Then restart your N8N instance.

#### Method 2: Community Nodes (N8N Cloud/Self-hosted)

1. Go to **Settings** > **Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-qianwen`
4. Click **Install**

#### Method 3: Manual Installation

```bash
# Navigate to your N8N installation directory
cd ~/.n8n/nodes

# Install the package
npm install n8n-nodes-qianwen

# Restart N8N
```

### Configuration

1. In N8N, go to **Credentials**
2. Click **Add Credential**
3. Select **Qwen API**
4. Enter your credentials:
   - **API Key**: Your Alibaba Cloud API Key (starts with `sk-`)
   - **API Endpoint**: `https://dashscope.aliyuncs.com/compatible-mode/v1` (default)

### Getting API Key

1. Visit [Alibaba Cloud Model Studio](https://bailian.console.aliyun.com/)
2. Sign in or create an account
3. Navigate to **API Key Management**
4. Create a new API Key
5. Copy the key (starts with `sk-`)

### Usage Examples

#### Text Generation

```
1. Add "Qwen" node to your workflow
2. Select a model (e.g., qwen-turbo)
3. Enter your prompt
4. Optional: Enable web search or deep thinking
5. Execute
```

**Output**:
```json
{
  "text": "Response text...",
  "usage": {
    "total_tokens": 150
  }
}
```

#### Image Generation

```
1. Add "Qwen Image" node
2. Select operation: "Text to Image"
3. Enter image description
4. Choose style and size
5. Execute
```

**Output**:
```json
{
  "images": [
    {"url": "https://..."}
  ]
}
```

#### Video Generation

```
1. Add "Qwen Video" node
2. Select operation: "Text to Video"
3. Enter video description
4. Execute to get task ID
5. Use "Get Task Status" to check progress
```

### Supported Models

- **Text**: qwen-turbo, qwen-plus, qwen-max, qwen3.5-plus, qwen2.5-72b-instruct, and more
- **Image**: wanx-v1, wanx-sketch-to-image-v1, wanx-style-repaint-v1
- **Video**: videosynth-v1

For the complete list, see [Alibaba Cloud Model List](https://help.aliyun.com/zh/model-studio/models).

### Resources

- [Official Documentation](https://help.aliyun.com/zh/model-studio/)
- [API Reference](https://help.aliyun.com/zh/model-studio/developer-reference/)
- [GitHub Repository](https://github.com/loobayn/n8n-nodes-qianwen)

### License

MIT

---

## 中文

### 功能特性

本包为N8N提供三个强大的节点：

#### 1. 🤖 Qwen（文本生成）
- **多模型支持**：Qwen-Turbo、Qwen-Plus、Qwen-Max、Qwen3.5-Plus等
- **联网搜索**：启用实时互联网搜索获取最新信息
- **深度思考**：高级推理模式，可查看思考过程
- **对话历史**：支持多轮对话
- **视觉模型**：支持多模态模型（文本+图片）
- **完整参数控制**：温度、top_p、最大token数等

#### 2. 🎨 Qwen Image（图片生成）
- **文生图**：根据文字描述生成图片
- **图生图**：转换现有图片
- **多种风格**：摄影、动画、油画、水彩、素描等
- **自定义尺寸**：1024x1024、720x1280、1280x720、512x512
- **负面提示词**：指定不想要的内容
- **批量生成**：一次生成最多4张图片

#### 3. 🎬 Qwen Video（视频生成）
- **文生视频**：根据文字描述创建视频
- **图生视频**：将静态图片制作成视频
- **任务管理**：查询生成状态
- **自定义设置**：时长、分辨率、帧率

### 安装方法

#### 方法1：NPM（推荐）

```bash
npm install n8n-nodes-qianwen
```

然后重启N8N实例。

#### 方法2：社区节点（N8N云版/自托管）

1. 进入 **设置** > **社区节点**
2. 点击 **安装**
3. 输入 `n8n-nodes-qianwen`
4. 点击 **安装**

#### 方法3：手动安装

```bash
# 进入N8N安装目录
cd ~/.n8n/nodes

# 安装包
npm install n8n-nodes-qianwen

# 重启N8N
```

### 配置

1. 在N8N中，进入 **凭证**
2. 点击 **添加凭证**
3. 选择 **Qwen API**
4. 输入凭证信息：
   - **API Key**：你的阿里云API密钥（以`sk-`开头）
   - **API Endpoint**：`https://dashscope.aliyuncs.com/compatible-mode/v1`（默认）

### 获取API密钥

1. 访问[阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 登录或创建账号
3. 进入 **API-KEY管理**
4. 创建新的API Key
5. 复制密钥（以`sk-`开头）

### 使用示例

#### 文本生成

```
1. 添加"Qwen"节点到工作流
2. 选择模型（如qwen-turbo）
3. 输入提示词
4. 可选：启用联网搜索或深度思考
5. 执行
```

**输出**：
```json
{
  "text": "回复文本...",
  "usage": {
    "total_tokens": 150
  }
}
```

#### 图片生成

```
1. 添加"Qwen Image"节点
2. 选择操作："文生图"
3. 输入图片描述
4. 选择风格和尺寸
5. 执行
```

**输出**：
```json
{
  "images": [
    {"url": "https://..."}
  ]
}
```

#### 视频生成

```
1. 添加"Qwen Video"节点
2. 选择操作："文生视频"
3. 输入视频描述
4. 执行获取任务ID
5. 使用"查询任务状态"检查进度
```

### 支持的模型

- **文本**：qwen-turbo、qwen-plus、qwen-max、qwen3.5-plus、qwen2.5-72b-instruct等
- **图片**：wanx-v1、wanx-sketch-to-image-v1、wanx-style-repaint-v1
- **视频**：videosynth-v1

完整列表请查看[阿里云模型列表](https://help.aliyun.com/zh/model-studio/models)。

### 资源

- [官方文档](https://help.aliyun.com/zh/model-studio/)
- [API参考](https://help.aliyun.com/zh/model-studio/developer-reference/)
- [GitHub仓库](https://github.com/loobayn/n8n-nodes-qianwen)

### 许可证

MIT

---

## Support

If you encounter any issues or have questions:

1. Check the [Documentation](https://help.aliyun.com/zh/model-studio/)
2. Open an [Issue](https://github.com/loobayn/n8n-nodes-qianwen/issues)
3. Join the [N8N Community](https://community.n8n.io/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### 1.0.0
- Initial release
- Qwen text generation node
- Qwen Image generation node
- Qwen Video generation node
- Support for web search and deep thinking
- Dynamic model loading
- OpenAI-compatible API support
