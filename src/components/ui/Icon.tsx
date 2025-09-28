import type { SVGProps } from 'react';
import type { IconName } from '@/types/icons';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}

export function Icon({ name, size = 24, className = '', ...props }: IconProps) {
  const spriteHref = '/icons/sprite.svg';
  
  return (
    <svg
      width={size}
      height={size}
      className={`inline-block ${className}`}
      {...props}
    >
      <use href={`${spriteHref}#${name}`} />
    </svg>
  );
}