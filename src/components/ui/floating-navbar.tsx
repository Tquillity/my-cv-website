"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, Briefcase, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", link: "/", icon: <Home className="w-4 h-4" /> },
  { name: "Portfolio", link: "/portfolio", icon: <Briefcase className="w-4 h-4" /> },
  { name: "About", link: "/about", icon: <User className="w-4 h-4" /> },
];

export const FloatingNavbar = ({ locale }: { locale: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "sv" : "en";
    // Replace the locale segment in the path
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
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
            // Determine if active. Handle root "/" vs subpaths.
            const itemPath = `/${locale}${item.link === "/" ? "" : item.link}`;
            const isActive = pathname === itemPath || (item.link !== "/" && pathname.startsWith(itemPath));

            return (
              <Link
                key={item.name}
                href={`/${locale}${item.link}`}
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