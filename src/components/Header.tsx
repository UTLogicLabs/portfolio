import { useState } from 'react';
import { Icon } from '@/components/ui';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="#" className="text-xl font-bold">
            John.Dev
          </a>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary/80 transition-colors">
            Home
          </a>
          <a href="#projects" className="text-sm font-medium hover:text-primary/80 transition-colors">
            Projects
          </a>
          <a href="#linkedin" className="text-sm font-medium hover:text-primary/80 transition-colors">
            LinkedIn
          </a>
          <a href="#blog" className="text-sm font-medium hover:text-primary/80 transition-colors">
            Blog
          </a>
          <a href="#contact" className="text-sm font-medium hover:text-primary/80 transition-colors">
            Contact
          </a>
        </nav>
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-accent" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <Icon name="chevron-down" size={20} /> : <Icon name="home" size={20} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40">
          <nav className="flex flex-col items-center justify-center h-full gap-8">
            <a href="#" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </a>
            <a href="#projects" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Projects
            </a>
            <a href="#linkedin" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              LinkedIn
            </a>
            <a href="#blog" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Blog
            </a>
            <a href="#contact" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}