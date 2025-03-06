# Frontend Development Guide

## React 19 Compatibility Notes

This project uses React 19, which is the latest version of React. However, some of our dependencies were built for React 18 or earlier and have peer dependency requirements that specifically exclude React 19.

### Known Compatibility Issues

- `react-day-picker@8.10.1` expects React version "^16.8.0 || ^17.0.0 || ^18.0.0"
- There may be other dependencies with similar restrictions

### Solution

We're currently using the `--legacy-peer-deps` flag with npm to override these compatibility checks. This allows us to use React 19 with these older dependencies, but it may lead to unexpected behavior if the dependencies rely on specific React internals that have changed.

When running npm commands, always use the `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
npm install some-package --legacy-peer-deps
```

Or use the custom script we've added:

```bash
npm run install
```

### Long-term Solutions

As React 19 becomes more widely adopted, we should:

1. Look for updated versions of dependencies that support React 19
2. Consider contributing to open source projects to add React 19 support
3. Replace components with alternatives that support React 19

### Verifying Component Behavior

Since we're using dependencies with React 19 that weren't officially tested with this version, be especially thorough when testing components that use:

- react-day-picker (date picking functionality)
- Any other third-party React components

Document any unexpected behavior in the project issues. 