# Header Component Tests

## Overview

This document describes the comprehensive test suite for the `Header` component, covering 38 tests across 9 test suites to ensure full functionality, accessibility, and responsive behavior.

## Test Structure

The Header tests are organized into the following categories:

### 1. Component Structure (2 tests)
- ✅ **Header styling verification**: Tests sticky positioning, backdrop blur, z-index, and border
- ✅ **Container layout**: Verifies proper flexbox layout with correct height and alignment

### 2. Brand/Logo (2 tests)
- ✅ **Logo rendering**: Tests brand link text, href attribute, and typography styling
- ✅ **Logo container**: Verifies proper flexbox layout with gap spacing

### 3. Desktop Navigation (6 tests)
- ✅ **Navigation structure**: Tests desktop nav visibility, flexbox layout, and gap spacing
- ✅ **Home link**: Verifies href, text content, and hover styling classes
- ✅ **Projects link**: Tests navigation to #projects anchor with proper styling
- ✅ **LinkedIn link**: Verifies navigation to #linkedin anchor
- ✅ **Blog link**: Tests navigation to #blog anchor
- ✅ **Contact link**: Verifies navigation to #contact anchor

### 4. Mobile Menu Button (4 tests)
- ✅ **Button styling**: Tests mobile-only visibility, padding, border radius, and hover states
- ✅ **Menu icon display**: Verifies home icon shows when menu is closed
- ✅ **Close icon toggle**: Tests chevron-down icon appears when menu opens
- ✅ **Icon state cycling**: Verifies proper toggling between menu and close icons

### 5. Mobile Navigation Menu (9 tests)
- ✅ **Default hidden state**: Ensures mobile menu is not visible initially
- ✅ **Menu visibility toggle**: Tests mobile menu appears when button is clicked
- ✅ **Mobile nav styling**: Verifies fixed positioning, background, and z-index
- ✅ **Mobile links rendering**: Tests 5 navigation links with proper styling
- ✅ **Home link closure**: Verifies menu closes when Home link is clicked
- ✅ **Projects link closure**: Tests menu closes when Projects link is clicked
- ✅ **LinkedIn link closure**: Verifies menu closes when LinkedIn link is clicked
- ✅ **Blog link closure**: Tests menu closes when Blog link is clicked
- ✅ **Contact link closure**: Verifies menu closes when Contact link is clicked

### 6. Responsive Design (3 tests)
- ✅ **Desktop nav hiding**: Tests `hidden md:flex` classes for mobile hiding
- ✅ **Mobile button hiding**: Verifies `md:hidden` class for desktop hiding
- ✅ **Mobile menu positioning**: Tests `top-16` positioning below header

### 7. Accessibility (4 tests)
- ✅ **Header role**: Verifies proper `banner` role for screen readers
- ✅ **Menu button labels**: Tests "Open menu" and "Close menu" aria-labels
- ✅ **Navigation landmarks**: Verifies proper `navigation` roles are present
- ✅ **Link accessibility**: Tests all links have proper href attributes

### 8. State Management (2 tests)
- ✅ **Menu state cycling**: Tests complete open/close state management cycle
- ✅ **Link click resets**: Verifies menu closes when any navigation link is clicked

### 9. Icon Integration (3 tests)
- ✅ **Menu icon props**: Tests home icon renders with correct size (20px)
- ✅ **Close icon props**: Verifies chevron-down icon renders with correct size
- ✅ **Icon toggling**: Tests proper switching between home and chevron-down icons

### 10. Layout and Positioning (3 tests)
- ✅ **Sticky positioning**: Verifies `sticky top-0 z-50` classes for fixed header
- ✅ **Backdrop effects**: Tests background blur and transparency effects
- ✅ **Height consistency**: Verifies consistent `h-16` height across layouts

## Key Testing Patterns

### Icon Component Mocking
```typescript
vi.mock('@/components/ui', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <div data-testid={`icon-${name}`} data-size={size}>
      {name}
    </div>
  ),
}));
```

### Mobile Menu State Testing
```typescript
// Test menu opening
const menuButton = screen.getByLabelText('Open menu');
fireEvent.click(menuButton);

// Test menu closing via navigation
const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
const homeLink = mobileNav?.querySelector('a[href="#"]');
fireEvent.click(homeLink!);
```

### Responsive Design Validation
```typescript
// Desktop navigation (hidden on mobile)
const desktopNav = document.querySelector('nav.hidden.md\\:flex');
expect(desktopNav).toHaveClass('hidden', 'md:flex');

// Mobile button (hidden on desktop)
const menuButton = screen.getByLabelText('Open menu');
expect(menuButton).toHaveClass('md:hidden');
```

## DOM Query Strategies

1. **CSS Class Selectors**: Using escaped selectors for Tailwind classes like `.md\\:hidden.fixed.inset-0`
2. **Role-based Selection**: `screen.getByRole('banner')` for semantic header element
3. **ARIA Label Testing**: `screen.getByLabelText('Open menu')` for accessibility verification
4. **Test ID Strategy**: `screen.getByTestId('icon-${name}')` for mocked Icon components

## Coverage Summary

- **Total Tests**: 38
- **Component Structure**: 100% covered
- **Navigation Links**: All desktop and mobile links tested
- **State Management**: Complete open/close cycle coverage
- **Responsive Behavior**: Mobile and desktop layouts validated
- **Accessibility**: ARIA labels, roles, and landmarks verified
- **Icon Integration**: Custom Icon component interaction tested

## Test Execution

```bash
npm test Header.test.tsx
# ✓ 38 tests passing
# Duration: ~775ms
```

## Integration Notes

- **Custom Icon System**: Tests properly mock the project's custom Icon component
- **Tailwind CSS Classes**: All responsive and utility classes are verified
- **State Management**: useState hook behavior for mobile menu toggle is thoroughly tested
- **Accessibility Compliance**: Proper ARIA labels and semantic HTML structure validated
- **Mobile-First Design**: Responsive breakpoints and mobile menu functionality confirmed

This comprehensive test suite ensures the Header component maintains reliability across all user interactions, responsive breakpoints, and accessibility requirements.