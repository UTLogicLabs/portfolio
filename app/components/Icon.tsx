import type { SVGProps } from "react";
import type { IconName as GeneratedIconName } from "../../public/icons/types";

export type IconName = GeneratedIconName;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
      {...props}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
