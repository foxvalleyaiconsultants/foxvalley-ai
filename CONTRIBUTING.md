# Contributing to Fox Valley AI

Thank you for considering contributing to Fox Valley AI! This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Commit with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots/videos if applicable

## Development Setup

See [README.md](./README.md) for setup instructions.

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### React Components

- Use functional components with hooks
- Keep components focused on single responsibility
- Extract reusable logic into custom hooks
- Use proper prop types

### CSS/Styling

- Use Tailwind CSS utilities
- Follow mobile-first approach
- Maintain consistent spacing and sizing
- Use semantic color names from theme

### Database

- Define schema in `drizzle/schema.ts`
- Use migrations for schema changes
- Write efficient queries
- Add proper indexes

### API (tRPC)

- Define procedures in `server/routers.ts`
- Use proper input validation with Zod
- Return typed responses
- Handle errors appropriately

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple browsers/devices
- Test database operations

## Commit Messages

Follow conventional commits format:

- `feat: add new feature`
- `fix: fix bug description`
- `docs: update documentation`
- `style: formatting changes`
- `refactor: code refactoring`
- `test: add tests`
- `chore: maintenance tasks`

## Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing! 🎉
