"use client";

import { useSupabase } from "@/context/SupabaseContext";
import { X, ExternalLink, LogOut, Mail, ArrowLeft, User } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type ViewState =
  | "login"
  | "signup"
  | "signup-success"
  | "forgot-password"
  | "forgot-password-success";

const LastUsedBadge = () => (
  <span className="absolute -top-2 -right-2 bg-neon-primary text-background text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-tighter shadow-[0_0_10px_rgba(21,128,61,0.5)] z-20">
    Last Used
  </span>
);

export const LoginModal = () => {
  const {
    user,
    isAuthenticated,
    isLoginModalOpen,
    isLoginModalCloseable,
    closeLoginModal,
    signInWithOAuth,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    supabase,
  } = useSupabase();

  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewState, setViewState] = useState<ViewState>("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastProvider, setLastProvider] = useState<string | null>(null);

  const LAST_PROVIDER_KEY = 'auth-last-provider';

  useEffect(() => {
    const stored = localStorage.getItem(LAST_PROVIDER_KEY);
    if (stored) setLastProvider(stored);
  }, []);

  const saveLastProvider = (provider: string) => {
    localStorage.setItem(LAST_PROVIDER_KEY, provider);
    setLastProvider(provider);
  };

  // Handle escape key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLoginModal();
      }
    },
    [closeLoginModal],
  );

  useEffect(() => {
    if (isLoginModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isLoginModalOpen, handleKeyDown]);

  // Hide modal on auth routes
  const isAuthRoute = pathname?.startsWith("/auth/");
  if (!isLoginModalOpen || isAuthRoute) return null;

  // Get user display info from Supabase user metadata
  const displayName =
    user?.user_metadata?.user_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}&background=random`;

  const providerType = user?.app_metadata?.provider || "email";

  const handleGithubLogin = async () => {
    try {
      saveLastProvider("github");
      await signInWithOAuth("github");
    } catch (error) {
      console.error("GitHub login error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      saveLastProvider("google");
      await signInWithOAuth("google");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result =
        viewState === "signup"
          ? await signUpWithEmail(email, password)
          : await signInWithEmail(email, password);

      if (result.error) {
        setError(result.error.message);
      } else {
        saveLastProvider("email");
        if (viewState === "signup") {
          // Signup successful - show confirmation message
          setError(null);
          setViewState("signup-success");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${currentOrigin}/auth/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setViewState("forgot-password-success");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setViewState("login");
    setError(null);
    setEmail("");
    setPassword("");
  };


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Backdrop with blur - always clickable to close */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeLoginModal();
        }}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="bg-card border border-neon-primary shadow-[0_0_30px_rgba(21,128,61,0.3)] flex flex-col max-h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-neon-primary/30 shrink-0">
            <h2
              id="login-modal-title"
              className="text-base md:text-lg font-bold text-green-400 uppercase tracking-wider"
            >
              {isAuthenticated
                ? "Your Profile"
                : viewState === "forgot-password" ||
                  viewState === "forgot-password-success"
                  ? "Reset Password"
                  : "Connect Account"}
            </h2>
            {/* Always show close button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                closeLoginModal();
              }}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer relative z-50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-6 overflow-y-auto">
            {isAuthenticated && user ? (
              // Logged in state
              <div className="space-y-6">
                {/* User Card */}
                <div className="flex items-center gap-4 p-4 bg-background border border-neon-primary/20">
                  <Image
                    src={avatarUrl}
                    alt={`${displayName}'s avatar`}
                    width={64}
                    height={64}
                    className="w-16 h-16 border-2 border-neon-primary rounded-full"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold text-foreground truncate">
                      {displayName}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Connected via {providerType}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {/* View Profile / Complete Profile */}
                  <Link
                    href="/profile"
                    onClick={closeLoginModal}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-neon-primary text-background font-semibold uppercase tracking-wider text-sm hover:bg-neon-primary/90 transition-all"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </Link>
                  {user?.user_metadata?.user_name && (
                    <a
                      href={`https://github.com/${user.user_metadata.user_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-neon-primary/50 text-neon-primary font-semibold uppercase tracking-wider text-sm hover:bg-neon-primary/10 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View GitHub Profile
                    </a>
                  )}
                  <button
                    onClick={signOut}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-red-500/50 text-red-500 font-semibold uppercase tracking-wider text-sm hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect Account
                  </button>
                </div>
              </div>
            ) : viewState === "signup-success" ? (
              // Signup success state - email confirmation needed
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-neon-primary/10 border border-neon-primary">
                  <Mail className="w-8 h-8 text-neon-primary" />
                </div>
                <p className="text-lg font-bold text-foreground">
                  Check your email
                </p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a confirmation link to <strong>{email}</strong>.
                  Please click the link to activate your account.
                </p>
                <button
                  type="button"
                  onClick={resetToLogin}
                  className="flex items-center justify-center gap-2 w-full text-sm text-neon-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </div>
            ) : viewState === "forgot-password-success" ? (
              // Forgot password success state
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-neon-primary/10 border border-neon-primary">
                  <Mail className="w-8 h-8 text-neon-primary" />
                </div>
                <p className="text-lg font-bold text-foreground">
                  Check your email
                </p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={resetToLogin}
                  className="flex items-center justify-center gap-2 w-full text-sm text-neon-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </div>
            ) : viewState === "forgot-password" ? (
              // Forgot password form
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Mail className="w-12 h-12 text-neon-primary mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    required
                    autoFocus
                    className="w-full px-4 py-3 bg-background border border-neon-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                  />
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-neon-primary text-background font-bold uppercase tracking-wider text-sm hover:bg-neon-primary/90 transition-all disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4" />
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button
                    type="button"
                    onClick={resetToLogin}
                    className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </button>
                </form>
              </div>
            ) : (
              // Logged out state - login/signup form
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex flex-col items-center text-center space-y-2 mb-4">
                  <div className="relative">
                    <Image
                      src="/logo/logo-old.png"
                      alt="Kracked Devs Logo"
                      width={80}
                      height={80}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover p-0.5 bg-green-400"
                    />
                  </div>
                  <p className="text-sm text-white">Welcome to Kracked Devs!</p>
                  <p className="text-white/50 text-xs md:text-sm">
                    A community of cracked developers who want to level up
                    together.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Login with Github Button */}
                  <div className="relative">
                    <button
                      onClick={handleGithubLogin}
                      className="bg-white text-black border border-black flex items-center justify-center gap-3 w-full px-4 py-3 md:py-4 font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_30px_rgba(21,128,61,0.6)] transition-all group"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Login with Github
                    </button>
                    {lastProvider === "github" && <LastUsedBadge />}
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-widest">or</span>
                  </div>

                  {/* Login with Google Button */}
                  <div className="relative">
                    <button
                      onClick={handleGoogleLogin}
                      className="bg-white text-black border border-black flex items-center justify-center gap-3 w-full px-4 py-3 md:py-4 font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_30px_rgba(21,128,61,0.6)] transition-all group"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        aria-hidden="true"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Login with Google
                    </button>
                    {lastProvider === "google" && <LastUsedBadge />}
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <span className="text-muted-foreground text-xs uppercase tracking-widest">or</span>
                  </div>

                  {/* Email/Password Form */}
                  <div className="relative">
                    <form onSubmit={handleEmailAuth} className="space-y-3">
                      {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                          {error}
                        </div>
                      )}
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        required
                        autoComplete="email"
                        className="w-full px-4 py-3 bg-background border border-neon-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        required
                        minLength={6}
                        autoComplete={
                          viewState === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                        className="w-full px-4 py-3 bg-background border border-neon-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-neon-primary text-background font-bold uppercase tracking-wider text-sm hover:bg-neon-primary/90 transition-all disabled:opacity-50"
                      >
                        <Mail className="w-4 h-4" />
                        {loading
                          ? "Loading..."
                          : viewState === "signup"
                            ? "Sign Up"
                            : "Sign In"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setViewState(
                            viewState === "signup" ? "login" : "signup",
                          )
                        }
                        className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {viewState === "signup"
                          ? "Already have an account? Sign In"
                          : "Need an account? Sign Up"}
                      </button>
                      {viewState === "login" && (
                        <button
                          type="button"
                          onClick={() => {
                            setViewState("forgot-password");
                            setError(null);
                          }}
                          className="block w-full text-center text-sm text-neon-primary hover:underline"
                        >
                          Forgot your password?
                        </button>
                      )}
                    </form>
                    {lastProvider === "email" && <LastUsedBadge />}
                  </div>
                </div>

                {/* Info text */}
                <p className="text-xs text-center text-muted-foreground">
                  By connecting, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-neon-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-neon-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
