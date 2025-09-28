# Joshua Dix - Portfolio

A modern, responsive portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Seamless theme switching
- **Performance Optimized**: Fast loading with Vite's build optimizations
- **Icon System**: Optimized icon spritesheet with @radix-ui/icons
- **Comprehensive Testing**: 95% test coverage with Playwright + Vitest
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint + Prettier for consistent code style

## 📦 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: @radix-ui/icons via @sly-cli/sly
- **Testing**: Playwright (E2E) + Vitest (Unit) + React Testing Library
- **Code Quality**: ESLint + Prettier + TypeScript
- **Deployment**: Ready for Netlify, Vercel, or GitHub Pages

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joshuadix/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright tests with UI
- `npm run test:all` - Run all tests with coverage

### Icons
- `npm run icons` - Add new icons via sly CLI

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   └── forms/          # Form components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles and Tailwind customizations
└── assets/             # Images, fonts, static files

tests/
├── e2e/                # Playwright end-to-end tests
├── unit/               # Vitest unit tests
├── integration/        # API and integration tests
├── fixtures/           # Test data and mocks
└── setup/              # Test configuration

public/
└── icons/              # Generated icon spritesheet
```

## 🎨 Customization

### Theme Colors
Update `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

### Adding Icons
Use the sly CLI to add new icons:

```bash
npm run icons <icon-name>
```

Icons are automatically optimized into a spritesheet via `vite-plugin-icons-spritesheet`.

## 🧪 Testing Strategy

This project maintains 95% test coverage across:

- **E2E Testing**: Playwright for user workflows and UI interactions
- **Unit Testing**: Vitest + React Testing Library for component logic
- **Integration Testing**: API and service layer testing
- **Visual Testing**: Screenshot-based regression testing
- **Accessibility Testing**: Automated a11y checks

## 📱 Responsive Design

The portfolio is built with a mobile-first approach:
- Mobile: 375px+
- Tablet: 768px+
- Desktop: 1024px+
- Large Desktop: 1280px+

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel
1. Import your GitHub repository
2. Vercel will auto-detect the settings

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for automated deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Joshua Dix**
- Email: josh.dix@theblindman.com
- Portfolio: [joshuadix.dev](https://joshuadix.dev)

---

Built with ❤️ using React, TypeScript, and modern web technologies.