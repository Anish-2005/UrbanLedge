# Contributing to UrbanLedge

Thanks for contributing.

## Development Workflow

1. Fork the repository
2. Create a feature branch from `main`
3. Make focused changes
4. Run validation locally
5. Open a pull request with clear context

## Branch Naming

Use descriptive names:

- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`
- `refactor/<short-description>`

Examples:

- `feature/collapsible-sidebar`
- `fix/theme-transition-fallback`

## Local Setup

```bash
npm install
npm run apply-schema
npm run dev
```

See [README.md](./README.md) for environment variables and setup details.

## Code Standards

- Use TypeScript and keep types explicit where useful
- Keep components small and composable
- Avoid unrelated refactors in the same PR
- Preserve existing behavior unless the PR explicitly changes it
- Prefer readable naming over clever shortcuts

## Validation Before PR

Run:

```bash
npm run lint
npm run build
```

If either check cannot run in your environment, note that in the PR.

## Commit Guidelines

Use clear commit messages in imperative mood.

Examples:

- `feat: add collapsible sidebar state`
- `fix: prevent theme toggle flicker in safari`
- `docs: rewrite readme setup section`

## Pull Request Checklist

- [ ] Scope is focused and intentional
- [ ] Build passes locally
- [ ] Lint passes locally
- [ ] Documentation updated when needed
- [ ] Screenshots included for UI changes
- [ ] Migration notes included if schema/env changes are required

## Reporting Issues

When opening an issue, include:

- Expected behavior
- Actual behavior
- Steps to reproduce
- Environment details (OS, browser, Node version)
- Logs or screenshots if available

## Security

Do not post secrets, tokens, or credentials in issues/PRs.
For sensitive vulnerabilities, report privately to maintainers.
