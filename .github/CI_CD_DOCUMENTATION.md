# CI/CD Pipeline Documentation

This document explains the GitHub Actions CI/CD pipeline for the Joshua Dix Portfolio project.

## 🚀 Overview

The CI/CD pipeline consists of multiple workflows that handle different aspects of the development and deployment process:

1. **Main CI/CD Pipeline** - Comprehensive testing, building, and deployment
2. **Preview Deployments** - Deploy PR previews for testing
3. **Security Scanning** - Automated security checks
4. **Dependency Updates** - Automated dependency management
5. **Release Management** - Version releases and changelog generation

## 📋 Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch
- Manual workflow dispatch

**Jobs:**
1. **Setup** - Install dependencies and cache
2. **Lint** - Code quality checks (ESLint, TypeScript, Prettier)
3. **Test** - Unit tests with coverage reporting
4. **E2E** - End-to-end tests with Playwright
5. **Build** - Production build
6. **Security** - Security audit and dependency check
7. **Deploy Netlify** - Deploy to Netlify (main branch only)
8. **Deploy Vercel** - Alternative deployment to Vercel
9. **Lighthouse** - Performance testing

### 2. Preview Deployments (`.github/workflows/preview.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**Features:**
- Deploys preview version to Netlify
- Comments on PR with preview URL
- Updates comment on subsequent pushes
- Automatic cleanup when PR is closed

### 3. Security Scanning (`.github/workflows/security.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch
- Daily at 2 AM UTC

**Security Checks:**
- npm audit for known vulnerabilities
- Snyk security scanning
- CodeQL analysis for code security issues

### 4. Dependency Updates (`.github/workflows/dependency-updates.yml`)

**Triggers:**
- Weekly on Mondays at 9 AM UTC
- Manual workflow dispatch

**Features:**
- Updates npm dependencies
- Applies security fixes
- Runs tests to ensure compatibility
- Creates PR with changes

### 5. Release Management (`.github/workflows/release.yml`)

**Triggers:**
- Push to version tags (v*)
- Manual workflow dispatch with version input

**Features:**
- Creates GitHub releases
- Generates build artifacts
- Deploys tagged versions to production
- Includes changelog in release notes

## 🔧 Setup Requirements

### Required Secrets

Add these secrets to your GitHub repository settings:

#### Netlify Deployment
```
NETLIFY_AUTH_TOKEN=your-netlify-auth-token
NETLIFY_SITE_ID=your-netlify-site-id
```

#### Vercel Deployment (Optional)
```
VERCEL_TOKEN=your-vercel-token
ORG_ID=your-vercel-org-id
PROJECT_ID=your-vercel-project-id
```

#### Security Scanning (Optional)
```
SNYK_TOKEN=your-snyk-token
```

#### Code Coverage (Optional)
```
CODECOV_TOKEN=your-codecov-token
```

### Environment Setup

1. **Node.js Version**: All workflows use Node.js 18
2. **Package Manager**: npm (using `npm ci` for reproducible builds)
3. **Caching**: Node modules are cached for faster builds

## 📊 Quality Gates

### Test Coverage
- Target: 95% code coverage
- Uploaded to Codecov for tracking
- Coverage reports available as artifacts

### Performance Metrics (Lighthouse)
- Performance Score: ≥ 80
- Accessibility Score: ≥ 90
- Best Practices Score: ≥ 90
- SEO Score: ≥ 90
- First Contentful Paint: ≤ 2000ms
- Largest Contentful Paint: ≤ 2500ms
- Cumulative Layout Shift: ≤ 0.1
- Total Blocking Time: ≤ 300ms

### Security Requirements
- No high-severity vulnerabilities in dependencies
- All CodeQL security issues resolved
- Snyk scan passing (medium severity threshold)

## 🔄 Deployment Strategy

### Environments

1. **Preview** - PR-based deployments for testing
2. **Production** - Main branch deployments to live site

### Deployment Targets

#### Primary: Netlify
- Automatic deploys from `main` branch
- Preview deploys for all PRs
- Custom domains and SSL certificates
- Form handling and serverless functions

#### Secondary: Vercel (Optional)
- Alternative deployment platform
- Edge network optimization
- Serverless function support

### Rollback Strategy
- Use GitHub releases for version tracking
- Netlify deployment history for quick rollbacks
- Database migrations (if applicable) are reversible

## 📈 Monitoring

### Build Monitoring
- GitHub Actions provides build status
- Email notifications on failures
- Slack integration (configurable)

### Performance Monitoring
- Lighthouse CI reports
- Web Vitals tracking
- Performance budgets enforced

### Security Monitoring
- Daily security scans
- Dependency vulnerability alerts
- Automated security updates

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
1. Check test failures in the Actions tab
2. Review ESLint/TypeScript errors
3. Verify all dependencies are properly installed

#### Deployment Failures
1. Check Netlify/Vercel tokens are valid
2. Verify site IDs are correct
3. Ensure build artifacts are generated

#### Test Failures
1. Run tests locally: `npm run test:all`
2. Check Playwright browser compatibility
3. Verify test environment setup

### Debug Commands

```bash
# Run full test suite locally
npm run test:all

# Check code quality
npm run lint
npm run type-check
npm run format -- --check

# Build production version
npm run build
npm run preview

# Run E2E tests locally
npm run test:e2e:debug
```

## 🔮 Future Enhancements

### Planned Improvements
- [ ] Visual regression testing
- [ ] A/B testing integration
- [ ] Advanced performance monitoring
- [ ] Automated accessibility testing
- [ ] Cross-browser testing matrix
- [ ] Load testing automation

### Integration Opportunities
- [ ] Figma design sync
- [ ] Contentful CMS integration
- [ ] Analytics tracking
- [ ] Error monitoring (Sentry)
- [ ] User feedback collection

---

This CI/CD pipeline ensures high code quality, security, and performance while enabling rapid development and deployment cycles.