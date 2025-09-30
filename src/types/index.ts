// Common types used throughout the application

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  featured: boolean;
  // Additional fields from BlogStore
  coverImage: string;
  author: string;
  readTime: string;
  status: 'draft' | 'published';
  views: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Theme {
  isDark: boolean;
}

// Re-export icon types for convenience
export type { IconName } from './icons';