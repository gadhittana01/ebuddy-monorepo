# Shared Package

Shared entities, interfaces, and utilities used by both frontend and backend applications.

## Contents

- **User Entity**: Common User interface
- **Score Calculation**: Utility for calculating user scores

## Usage

```typescript
// Import shared types and utilities
import { User, calculatePotentialScore } from '@repo/shared';

// Use shared types
const user: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

// Use shared utilities
const score = calculatePotentialScore(user);
```

## Building

```bash
# From shared directory
npm run build

# From root (using Turborepo)
npx turbo build --filter=@repo/shared
```

## Guidelines

- Ensure code is needed by both frontend and backend
- Add proper TypeScript types
- Keep code platform-agnostic
- Test changes

## Maintaining Shared Code

When adding or modifying shared code:

1. Ensure it's needed by both frontend and backend
2. Add proper TypeScript types and documentation
3. Keep the code platform-agnostic (avoid browser or Node.js specific APIs)
4. Build and test the changes

## Adding New Shared Types

To add a new shared type or utility:

1. Create a new file in the appropriate folder (e.g., `entities/newType.ts`)
2. Export your type/function
3. Add an export in the relevant index file
4. Build the package

## Troubleshooting

### Import Issues

If you're having trouble importing from the shared package:

1. Make sure the package is built (`npm run build` in the shared package)
2. Check your tsconfig.json paths configuration
3. Verify you're using the correct import syntax: `import { Entity } from '@repo/shared'`

### Type Errors

If you're seeing type errors:

1. Make sure both frontend and backend have compatible TypeScript versions
2. Check if the shared package has been rebuilt after changes
3. Verify that your import paths are correct 