/**
 * Types for navigation mini-components.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface NavLinksProps {
  items?: NavItem[];
}
