import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'sv'] as const;
export const localePrefix = 'always'; // Ensures consistent behavior

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix });