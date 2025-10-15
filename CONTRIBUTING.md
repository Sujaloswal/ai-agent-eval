# 🤝 Contributing to AI Agent Evaluation Framework

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- Supabase account
- Familiarity with Next.js, React, and TypeScript

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ai-agent-eval.git
   cd ai-agent-eval
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs

1. **Check existing issues** first
2. **Use the bug report template**
3. **Include**:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details

### Suggesting Features

1. **Check existing feature requests**
2. **Use the feature request template**
3. **Include**:
   - Clear use case
   - Detailed description
   - Mockups (if applicable)
   - Implementation considerations

### Code Contributions

#### 1. Choose an Issue

- Look for issues labeled `good first issue` for beginners
- Comment on the issue to claim it
- Wait for maintainer approval before starting

#### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

#### 3. Make Changes

- Follow the existing code style
- Write clear, concise commit messages
- Add tests for new functionality
- Update documentation as needed

#### 4. Test Your Changes

```bash
# Run tests
npm test

# Check linting
npm run lint

# Build the project
npm run build

# Test with real data
npm run seed YOUR_USER_ID 100
```

#### 5. Submit Pull Request

- Use the PR template
- Link related issues
- Provide clear description of changes
- Include screenshots for UI changes

## 🎨 Code Style Guidelines

### TypeScript

```typescript
// Use explicit types
interface UserConfig {
  id: string
  userId: string
  runPolicy: 'always' | 'sampled'
}

// Use meaningful names
const fetchUserEvaluations = async (userId: string) => {
  // Implementation
}
```

### React Components

```tsx
// Use functional components with TypeScript
interface Props {
  evaluations: Evaluation[]
  onUpdate: (id: string) => void
}

export default function EvaluationList({ evaluations, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      {evaluations.map(evaluation => (
        <EvaluationCard 
          key={evaluation.id} 
          evaluation={evaluation}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}
```

### CSS/Tailwind

```tsx
// Use semantic class names
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">
    Evaluation Results
  </h2>
</div>
```

## 📁 Project Structure

```
ai-agent-eval/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth-related pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   │   ├── ui/               # Basic UI components
│   │   └── charts/           # Chart components
│   ├── lib/                  # Utilities and configurations
│   └── types/                # TypeScript type definitions
├── supabase/                 # Database schema and migrations
├── scripts/                  # Utility scripts
└── docs/                     # Documentation
```

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// components/__tests__/EvaluationCard.test.tsx
import { render, screen } from '@testing-library/react'
import EvaluationCard from '../EvaluationCard'

describe('EvaluationCard', () => {
  it('displays evaluation score correctly', () => {
    const mockEvaluation = {
      id: '1',
      score: 0.85,
      // ... other props
    }
    
    render(<EvaluationCard evaluation={mockEvaluation} />)
    expect(screen.getByText('0.85')).toBeInTheDocument()
  })
})
```

### Integration Tests

```typescript
// __tests__/api/evaluations.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '../../src/app/api/evals/ingest/route'

describe('/api/evals/ingest', () => {
  it('creates evaluation successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        interaction_id: 'test-1',
        prompt: 'Test prompt',
        response: 'Test response',
        score: 0.85,
        latency_ms: 250
      }
    })

    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
  })
})
```

## 📚 Documentation

### Code Comments

```typescript
/**
 * Calculates the average score for a user's evaluations
 * @param evaluations - Array of evaluation objects
 * @returns Average score between 0 and 1
 */
export function calculateAverageScore(evaluations: Evaluation[]): number {
  if (evaluations.length === 0) return 0
  
  const sum = evaluations.reduce((acc, eval) => acc + eval.score, 0)
  return sum / evaluations.length
}
```

### README Updates

- Update feature lists
- Add new setup instructions
- Include new API endpoints
- Update screenshots

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Responsive design tested

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Review Process

1. **Automated checks** must pass
2. **Maintainer review** required
3. **Address feedback** promptly
4. **Squash and merge** when approved

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Notes

Include in releases:
- New features
- Bug fixes
- Breaking changes
- Migration guides

## 🎯 Areas for Contribution

### High Priority

- [ ] Performance optimizations
- [ ] Mobile responsiveness improvements
- [ ] Accessibility enhancements
- [ ] Test coverage improvements

### Medium Priority

- [ ] Additional chart types
- [ ] Export functionality
- [ ] Advanced filtering
- [ ] Bulk operations

### Low Priority

- [ ] Dark mode
- [ ] Internationalization
- [ ] Advanced analytics
- [ ] Custom themes

## 🆘 Getting Help

### Community

- **GitHub Discussions**: General questions and ideas
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time chat (if available)

### Maintainers

- **@yourusername**: Project lead
- **@contributor1**: Frontend specialist
- **@contributor2**: Backend specialist

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Harassment of any kind
- Discriminatory language or actions
- Personal attacks
- Publishing private information without permission

### Enforcement

Report violations to [conduct@yourdomain.com](mailto:conduct@yourdomain.com). All reports will be reviewed and investigated promptly and fairly.

## 🙏 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation
- Annual contributor highlights

---

**Thank you for contributing to the AI Agent Evaluation Framework! 🎉**

Your contributions help make AI evaluation more accessible and effective for everyone.