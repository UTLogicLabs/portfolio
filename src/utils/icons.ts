import type { IconName } from '@/types/icons';

// Utility to validate icon names at runtime
export function isValidIconName(name: string): name is IconName {
  const validIcons: IconName[] = [
    'sun',
    'moon',
    'github-logo',
    'linkedin-logo',
    'arrow-right',
    'chevron-down',
    'external-link',
    'mail',
    'home',
    'user',
    'briefcase',
    'file-text',
    'phone',
  ];
  
  return validIcons.includes(name as IconName);
}

// Helper to get all available icon names
export function getAvailableIcons(): IconName[] {
  return [
    'sun',
    'moon',
    'github-logo',
    'linkedin-logo',
    'arrow-right',
    'chevron-down',
    'external-link',
    'mail',
    'home',
    'user',
    'briefcase',
    'file-text',
    'phone',
  ];
}

// Social media icon mapping
export const socialIcons = {
  github: 'github-logo' as IconName,
  linkedin: 'linkedin-logo' as IconName,
  email: 'mail' as IconName,
} as const;