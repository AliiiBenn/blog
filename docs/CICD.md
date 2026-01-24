# CI/CD Strategy

## Overview

This project uses a lightweight CI/CD approach focused on **code quality and testing**. Deployment is handled automatically by Vercel - no custom deployment pipelines needed.

## Principles

- **Keep it simple**: Only what's necessary for code quality
- **Fast feedback**: Catch issues early, before they reach production
- **Developer experience**: Minimize friction while maintaining quality standards
- **No deployment overhead**: Vercel handles all deployment logic

## Pre-Commit Hooks (Local)

Pre-commit hooks run **on your machine** before you can commit code. They provide immediate feedback and prevent bad code from entering the repository.

### Tools

- **Husky**: Manages Git hooks
- **lint-staged**: Runs linters/tests only on staged files (much faster)

### What Runs

1. **ESLint** - Lints TypeScript/TSX files
   - Auto-fixes issues when possible
   - Blocks commit on errors

2. **TypeScript** - Type checking
   - Catches type errors before commit
   - Prevents runtime type issues

3. **Prettier** (optional) - Code formatting
   - Auto-formats staged files
   - Ensures consistent code style

4. **Tests** (when implemented) - Unit/integration tests
   - Runs tests for modified files
   - Blocks commit on test failures

### Benefits

- ✅ Fast feedback (seconds, not minutes)
- ✅ Only checks files you changed
- ✅ Prevents bad commits from entering history
- ✅ Saves CI/CD resources

## GitHub Actions (Remote)

GitHub Actions run **on every pull request and push** to main. They provide a final safety net before code is merged.

### What Runs

1. **Lint** - Full project lint
   - Checks entire codebase
   - Ensures no regressions

2. **Type Check** - Full TypeScript validation
   - Verifies type safety across all files
   - Catches cross-file type issues

3. **Tests** - Complete test suite
   - All unit tests
   - All integration tests
   - Coverage reports

### Workflow Triggers

- On **pull requests** to `main`
- On **push** to `main`
- Runs on **Ubuntu latest** (free tier)

### Benefits

- ✅ Comprehensive validation before merge
- ✅ Required checks prevent merging bad code
- ✅ Full codebase validation (not just changed files)
- ✅ Runs in parallel across multiple OS/architectures if needed

## What We DON'T Do

### ❌ No Deployment Pipelines

Vercel handles deployment automatically:
- Push to `main` → Vercel deploys to production
- Create PR → Vercel creates preview deployment
- Zero configuration needed

### ❌ No Complex Workflows

We don't need:
- Multi-stage deployments
- Manual approval gates
- Environment-specific builds
- Custom Docker images
- Infrastructure provisioning

### ❌ No Unnecessary Overhead

We skip:
- Performance testing (handled by Vercel Analytics)
- Security scanning (handled by Dependabot)
- Code coverage gates (coverage for info only)
- Release automation (Vercel handles this)

## Implementation Checklist

### Pre-Commit Hooks

- [ ] Install and configure Husky
- [ ] Setup lint-staged
- [ ] Configure ESLint for staged files
- [ ] Configure TypeScript for staged files
- [ ] Add Prettier (optional)
- [ ] Add test runner (when tests exist)

### GitHub Actions

- [ ] Create `.github/workflows/ci.yml`
- [ ] Setup lint job
- [ ] Setup type-check job
- [ ] Setup test job
- [ ] Configure required checks for PRs
- [ ] Add status badges to README

## Testing Strategy

### Backend-First Testing

**Priority: Server Actions & Core Logic**

- **Server Actions** (@/api) - Critical, 90%+ coverage
- **Core Functions** (@/core) - Pure logic, 100% coverage
- **Search Algorithm** - Business logic, 90%+ coverage
- **Hooks** (@/hooks) - Complex logic only, 70%+ coverage

**Skip:**
- UI components (shadcn/ui is well-tested)
- Presentational components (manual testing)
- Third-party libraries (trust TanStack Query, Payload)

See [TESTING.md](./TESTING.md) for complete testing guide.

## File Structure

```
.github/
└── workflows/
    └── ci.yml              # Main CI workflow

.husky/
├── pre-commit              # Pre-commit hook
└── _/                      # Husky internals

package.json
├── lint-staged             # Config for lint-staged
└── scripts                 # Custom scripts (if needed)
```

## Configuration Examples

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - run: pnpm install
      - run: pnpm lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - run: pnpm install
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - run: pnpm install
      - run: pnpm test:run
      - name: Coverage
        run: pnpm test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### `package.json` Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "tsc --noEmit"
    ],
    "*.{ts,tsx,test.ts}": [
      "vitest run --related"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Metrics and Success Criteria

### Pre-Commit Hooks

- **Time**: < 10 seconds on average
- **Success rate**: > 95% of commits pass on first try
- **Developer friction**: Minimal (auto-fix where possible)
- **Test scope**: Only changed files (lint-staged)

### GitHub Actions

- **Time**: < 5 minutes total
- **Success rate**: > 98% of PRs pass CI
- **False positives**: Near zero
- **Test scope**: Full test suite

### Test Coverage Targets

| Area | Target | Notes |
|------|--------|-------|
| **Server Actions** | 90%+ | Critical business logic |
| **Core Functions** | 100% | Pure functions, easy to test |
| **Validators** | 100% | Zod schemas |
| **Search Algorithm** | 90%+ | Complex logic |
| **Hooks** | 70%+ | Only complex hooks |
| **Components** | 0-50% | Skip UI, test logic only |
| **Overall** | 80%+ | Healthy project |

### Coverage Fail Conditions

CI will fail if:
- Server Actions coverage < 80%
- Core functions coverage < 95%
- Overall coverage drops by > 5%

## Maintenance

### Regular Tasks

- Update dependencies monthly (Dependabot)
- Review and update lint rules quarterly
- Check test coverage regularly
- Monitor CI/CD run times

### When to Add More

- Add E2E tests when critical user flows are identified
- Add security scanning if handling sensitive data
- Add performance tests if site becomes slow
- Add accessibility tests if a11y is a priority

## Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)

## Summary

This CI/CD strategy is **minimal but effective**:
- Pre-commit hooks catch issues early (developer machine)
- GitHub Actions provide final validation (remote)
- Vercel handles all deployment logic
- Focus on code quality, not pipeline complexity

**Result**: Fast feedback, clean codebase, minimal overhead, happy developers.
