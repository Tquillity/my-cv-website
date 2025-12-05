"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter, Link } from "@/i18n/navigation"; // Use custom hooks
import { Home, User, Briefcase, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const FloatingNavbar = ({ locale }: { locale: string }) => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: t('home'), link: "/", icon: <Home className="w-4 h-4" /> },
    { name: t('portfolio'), link: "/portfolio", icon: <Briefcase className="w-4 h-4" /> },
    { name: t('about'), link: "/about", icon: <User className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "sv" : "en";
    // next-intl handles the prefix replacement automatically
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="fixed top-6 inset-x-0 max-w-fit mx-auto z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "flex items-center gap-1 p-2 rounded-full border border-white/10 transition-all duration-300",
            scrolled
              ? "bg-black/80 backdrop-blur-md shadow-lg py-2"
              : "bg-white/5 backdrop-blur-sm shadow-sm py-3"
          )}
        >
          {navItems.map((item) => {
            // pathname from @/i18n/navigation does NOT include the locale prefix
            // so we can compare directly against item.link
            const isActive = pathname === item.link;

            return (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-white",
                  isActive ? "text-white" : "text-slate-400"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon}
                  <span className="hidden sm:inline">{item.name}</span>
                </span>
              </Link>
            );
          })}

          <div className="w-px h-6 bg-white/10 mx-2" />

          <button
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-full text-xs font-mono font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <Globe className="w-3 h-3" />
            {locale.toUpperCase()}
          </button>
        </motion.div>
      </div>
    </div>
  );
};
