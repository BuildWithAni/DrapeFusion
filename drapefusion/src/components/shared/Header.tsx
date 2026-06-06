"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAppStore } from "@/stores/appStore";
import { mockAuth } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Sparkles,
  History,
  Wallet,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, credits } = useAppStore();

  const isLanding = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-gold to-accent-gold-light flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-bg-primary" />
            </div>
            <span className="text-xl font-serif font-bold text-text-primary">
              Drape<span className="text-accent-gold">Fusion</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isLanding ? (
              <>
                <Link
                  href="#how-it-works"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#examples"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Examples
                </Link>
                <Link
                  href="#faq"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  FAQ
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <ProfileMenu
                      user={user}
                      credits={credits}
                      open={profileOpen}
                      setOpen={setProfileOpen}
                    />
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </>
            ) : isDashboard ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm transition-colors ${
                    pathname === "/dashboard"
                      ? "text-accent-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Generate
                </Link>
                <Link
                  href="/dashboard/history"
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    pathname === "/dashboard/history"
                      ? "text-accent-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  History
                </Link>
                <Link
                  href="/dashboard/wallet"
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    pathname === "/dashboard/wallet"
                      ? "text-accent-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Wallet className="h-3.5 w-3.5" />
                  Wallet
                </Link>

                {/* Credit Badge */}
                <div className="flex items-center gap-1.5 rounded-full border border-accent-gold/20 bg-accent-gold/5 px-3 py-1">
                  <Sparkles className="h-3 w-3 text-accent-gold" />
                  <span className="text-xs font-medium text-accent-gold">
                    {credits} credits
                  </span>
                </div>

                <ProfileMenu
                  user={user}
                  credits={credits}
                  open={profileOpen}
                  setOpen={setProfileOpen}
                />
              </>
            ) : null}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-bg-primary md:hidden"
          >
            <nav className="space-y-1 px-4 py-4">
              {isLanding ? (
                <>
                  <MobileLink href="#how-it-works" label="How It Works" />
                  <MobileLink href="#pricing" label="Pricing" />
                  <MobileLink href="#examples" label="Examples" />
                  <MobileLink href="#faq" label="FAQ" />
                  <div className="pt-2 space-y-2">
                    {user ? (
                      <Link href="/dashboard">
                        <Button className="w-full">Dashboard</Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/login">
                          <Button
                            variant="outline"
                            className="w-full"
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/signup">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <MobileLink href="/dashboard" label="Generate" />
                  <MobileLink
                    href="/dashboard/history"
                    label="History"
                  />
                  <MobileLink
                    href="/dashboard/wallet"
                    label="Wallet"
                  />
                  <div className="pt-2 border-t border-border">
                      <button
                        onClick={() => {
                          mockAuth.signOut();
                          setMobileMenuOpen(false);
                          window.location.href = "/";
                        }}
                        className="flex w-full items-center gap-2 py-2 text-sm text-text-secondary hover:text-text-primary"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
    >
      {label}
    </Link>
  );
}

function ProfileMenu({
  user,
  credits,
  open,
  setOpen,
}: {
  user: any;
  credits: number;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-border p-0.5 pr-2 hover:bg-bg-card transition-colors"
      >
        <Avatar
          src={user.avatarUrl}
          alt={user.fullName || user.email}
          fallback={user.email?.charAt(0)?.toUpperCase()}
          size="sm"
        />
        <ChevronDown className="h-3 w-3 text-text-secondary" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-border bg-bg-card p-2 shadow-2xl"
            >
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.fullName || "User"}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user.email}
                </p>
              </div>
              <div className="px-3 py-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
                <span className="text-sm text-text-secondary">
                  {credits} credits remaining
                </span>
              </div>
              <div className="border-t border-border pt-1 mt-1">
                <button
                  onClick={() => {
                    mockAuth.signOut();
                    setOpen(false);
                    window.location.href = "/";
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
