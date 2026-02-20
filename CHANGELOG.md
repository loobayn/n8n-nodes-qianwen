# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-20

### Added
- Initial release of n8n-nodes-qianwen
- Qwen text generation node with full parameter support
- QwenImage node for image generation (text-to-image, image-to-image)
- QwenVideo node for video generation (text-to-video, image-to-video)
- Support for web search functionality
- Support for deep thinking mode with reasoning output
- Dynamic model loading from API
- OpenAI-compatible API support
- Conversation history management
- Multiple style options for image generation
- Task status querying for video generation
- Full Chinese localization
- Resource locator for model selection (from list or by ID)

### Features
- **Text Generation**: Support for multiple Qwen models (turbo, plus, max, 3.5-plus, etc.)
- **Image Generation**: Multiple styles (photography, anime, oil painting, watercolor, sketch, etc.)
- **Video Generation**: Customizable duration, resolution, and frame rate
- **Advanced Options**: Temperature, top_p, max_tokens, repetition_penalty, seed, and more
- **Special Capabilities**: Web search and deep thinking modes
- **User-Friendly**: Simplified interface with core features prominently displayed

### Technical
- TypeScript implementation
- N8N workflow integration
- Alibaba Cloud DashScope API integration
- OpenAI-compatible endpoint support
- Proper error handling and validation
- Comprehensive parameter configuration
