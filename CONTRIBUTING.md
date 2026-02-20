# Contributing to n8n-nodes-qianwen

Thank you for your interest in contributing! 

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/n8n-nodes-qianwen/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - N8N version and environment details

### Suggesting Features

1. Check existing [Issues](https://github.com/yourusername/n8n-nodes-qianwen/issues) for similar suggestions
2. Create a new issue describing:
   - The feature and its benefits
   - Use cases
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Create a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/n8n-nodes-qianwen.git
cd n8n-nodes-qianwen

# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run dev
```

### Code Style

- Follow existing code style
- Use TypeScript
- Add comments for complex logic
- Keep functions focused and small

### Testing

Before submitting:
- Test all three nodes (Qwen, QwenImage, QwenVideo)
- Verify with different models
- Check error handling
- Test with and without optional parameters

## Questions?

Feel free to ask in [Issues](https://github.com/yourusername/n8n-nodes-qianwen/issues) or [N8N Community](https://community.n8n.io/).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
