"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { motion } from "framer-motion";
import { Loader2, Wallet } from "lucide-react";

export const Guestbook: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Mock recent entries for now as we might not have Sanity setup for read yet
  // In real app, fetch from API or Sanity directly
  const [entries, setEntries] = useState<Array<{ address: string; message: string; createdAt: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !address) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      // 1. Sign Message
      const signature = await signMessageAsync({ message });

      // 2. Submit to API
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, message, signature }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setStatus("success");
      setMessage("");
      // Optimistic update
      setEntries((prev) => [
        { address, message, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <section className="py-24 bg-black/5">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Crypto Guestbook</h2>
        
        <div className="bg-card border rounded-xl p-6 shadow-sm mb-8">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Connect your Ethereum wallet to sign the guestbook.
              </p>
              <button
                onClick={() => connect({ connector: injected() })}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="text-sm text-red-500 hover:underline"
                >
                  Disconnect
                </button>
              </div>
              
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a message..."
                className="w-full bg-background border rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                required
              />
              
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign & Post
              </button>

              {status === "success" && (
                <p className="text-green-500 text-sm mt-2 text-center">
                  Message signed and posted successfully!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4">Recent Signatures</h3>
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground italic">No signatures yet. Be the first!</p>
          ) : (
            entries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-secondary-foreground">
                    {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{entry.message}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
