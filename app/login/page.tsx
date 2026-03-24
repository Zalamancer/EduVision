"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "signup">(
    searchParams.get("tab") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputStyle = {
    background: "#1E1E3A",
    color: "#E8E8F0",
    border: "1px solid #1E1E3A",
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setSuccess("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0A0A1A" }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-8 border"
        style={{ background: "#12122A", borderColor: "#1E1E3A" }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black" style={{ color: "#E8E8F0" }}>
              Edu<span style={{ color: "#58C4DD" }}>Vision</span>
            </span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: "#8888AA" }}>
            {tab === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-lg p-1 mb-6"
          style={{ background: "#1E1E3A" }}
        >
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              className="flex-1 py-2 text-sm font-medium rounded transition-all"
              style={{
                background: tab === t ? "#12122A" : "transparent",
                color: tab === t ? "#E8E8F0" : "#8888AA",
              }}
              onClick={() => { setTab(t); setError(""); setSuccess(""); }}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Google OAuth */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium mb-4 transition-all border"
          style={{ borderColor: "#1E1E3A", color: "#E8E8F0", background: "#0A0A1A" }}
          onClick={handleGoogle}
        >
          <svg width="16" height="16" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "#1E1E3A" }} />
          <span className="text-xs" style={{ color: "#4A4A5A" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "#1E1E3A" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
          {tab === "signup" && (
            <input
              style={inputStyle}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={tab === "signup"}
            />
          )}
          <input
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <p className="text-xs" style={{ color: "#FC6255" }}>{error}</p>
          )}
          {success && (
            <p className="text-xs" style={{ color: "#83C167" }}>{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 rounded-lg font-semibold text-sm mt-1 transition-all"
            style={{
              background: loading ? "#1E1E3A" : "#58C4DD",
              color: loading ? "#4A4A5A" : "#0A0A1A",
            }}
          >
            {loading ? "Loading…" : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A1A" }}>
        <div style={{ color: "#8888AA" }}>Loading…</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
