"use client";

import { useState } from "react";
import { MessageSquare, Send, Search, User, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export default function ChatPage() {
  const { user, openAuthModal } = useAuthStore();
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-neutral-800 flex items-center justify-center text-[#C59A2F] mx-auto mb-4">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-2xl font-black mb-2">Messages & Plans</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Sign in to your Athithya account to chat with local hosts and arrange your travel itineraries.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="w-full py-3.5 rounded-full bg-[#C59A2F] text-white font-black text-xs uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md cursor-pointer"
          >
            Login to Access Messages
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-[75vh] min-h-[500px] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12">
          {/* Left: Chat List */}
          <aside className="md:col-span-4 border-r border-neutral-200/80 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-900/60">
            <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800">
              <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-100 mb-3">
                Messages
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:border-[#C59A2F] outline-none"
                />
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center text-neutral-400">
              <MessageSquare size={36} className="opacity-30 mb-2" />
              <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
                No active conversations
              </p>
              <p className="text-xs text-neutral-400 max-w-xs mt-1">
                When you contact an experience host or plan an itinerary, your messages will appear here.
              </p>
            </div>
          </aside>

          {/* Right: Message Window */}
          <section className="md:col-span-8 flex flex-col justify-between bg-neutral-50/50 dark:bg-neutral-950/40">
            <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C59A2F]/20 text-[#C59A2F] flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                    Athithya Concierge
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                    <ShieldCheck size={12} /> Verified Support
                  </span>
                </div>
              </div>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  A
                </div>
                <div className="max-w-md p-4 rounded-2xl rounded-tl-none bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 shadow-xs leading-relaxed">
                  Namaste! Welcome to Athithya. Send your questions to hosts or reach out anytime for authentic recommendations across Uttarakhand.
                </div>
              </div>
            </div>

            {/* Send Message Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!message.trim()) return;
                setMessage("");
              }}
              className="p-4 border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm focus:border-[#C59A2F] outline-none"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-[#C59A2F] text-white hover:bg-[#A67F26] transition shadow-xs cursor-pointer"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
