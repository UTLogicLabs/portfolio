# ProjectsSection Component Usage

The ProjectsSection component has been successfully integrated into your portfolio project!

## 🎯 Component Location

- **Component**: `src/components/layout/ProjectsSection.tsx`
- **Page**: `src/pages/ProjectsPage.tsx` (ready-to-use page)
- **Exports**: Available via `@/components/layout`

## 🚀 Usage Examples

### 1. As a Section in Existing Page

```tsx
import { ProjectsSection } from '@/components/layout';

function App() {
  return (
    <div>
      {/* Other sections */}
      <ProjectsSection />
      {/* More content */}
    </div>
  );
}
```

### 2. As a Standalone Page

```tsx
import { ProjectsPage } from '@/pages';

// Use in your routing system
function App() {
  return (
    <Routes>
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  );
}
```

### 3. Replace Existing Projects Section in App.tsx

To replace the current projects placeholder in your App.tsx:

```tsx
// Find this section in App.tsx:
<section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
  {/* Current placeholder content */}
</section>

// Replace with:
<ProjectsSection />
```

## 🎨 Features

- **Responsive Grid**: 2 columns on medium+ screens, single column on mobile
- **Project Cards**: Image, title, description, tags, and action links
- **Icon Integration**: Uses your existing Icon component system
- **Interactive Elements**: Hover effects, image scaling, link animations
- **Semantic Styling**: Uses your theme colors (card, accent, muted, etc.)

## 🔧 Customization

### Project Data
Edit the `projects` array in `ProjectsSection.tsx` to add your real projects:

```tsx
const projects = [
  {
    id: 1,
    title: 'Your Project Name',
    description: 'Your project description...',
    image: 'path/to/your/image.jpg',
    tags: ['React', 'TypeScript', 'Your Stack'],
    github: 'https://github.com/yourusername/project',
    demo: 'https://your-project-demo.com'
  },
  // Add more projects...
];
```

### Styling
The component uses semantic color classes that work with your theme:
- `bg-card` / `text-card-foreground` - Card background/text
- `bg-accent` - Tag background
- `text-muted-foreground` - Subtitle text
- `text-primary` - Link colors

## 📋 Icons Used

The component uses these icons from your sprite:
- `github-logo` - For source code links
- `external-link` - For live demo links  
- `code` - For "View All Projects" button

## 🎯 Next Steps

1. **Add Real Project Data**: Replace placeholder projects with your actual work
2. **Add Project Images**: Use your own project screenshots
3. **Update Links**: Point GitHub and demo links to real repositories
4. **Integrate in App.tsx**: Replace the placeholder projects section
5. **Add Routing**: Set up routing to use the ProjectsPage component

The component is fully integrated and ready to use! 🎉