"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Search, UserPlus } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { ChatMessageWindow } from "@/components/chat/chat-message-window";
import { FindFriendsModal } from "@/components/chat/chat-group-modal";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";

function ChatContent() {
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");
  const { user, openAuthModal } = useAuthStore();
  const {
    conversations,
    activeConversation,
    fetchConversations,
    selectConversation,
    openDirectChat,
  } = useChatStore();

  const [search, setSearch] = useState("");
  const [showFindFriendsModal, setShowFindFriendsModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user, fetchConversations]);

  useEffect(() => {
    if (user && targetUserId) {
      openDirectChat(targetUserId);
    }
  }, [user, targetUserId, openDirectChat]);

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

  const filteredConversations = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name =
      c.groupName ||
      c.name ||
      c.participants?.map((p: any) => `${p.firstname || ""} ${p.lastname || ""}`).join(" ") ||
      "";
    return name.toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen pt-24 pb-16 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-[75vh] min-h-[540px] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12">
          {/* Left: Conversation List */}
          <aside className="md:col-span-4 h-full min-h-0 border-r border-neutral-200/80 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-900/60 overflow-hidden">
            <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">Messages</h2>
                {user?.role === "guest" && (
                  <button
                    type="button"
                    onClick={() => setShowFindFriendsModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C59A2F]/15 text-[#C59A2F] text-xs font-black uppercase tracking-wider hover:bg-[#C59A2F] hover:text-white transition cursor-pointer"
                  >
                    <UserPlus size={13} /> Find Friends
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:border-[#C59A2F] outline-none"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>

            {filteredConversations.length === 0 ? (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center text-neutral-400">
                <MessageSquare size={36} className="opacity-30 mb-2" />
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
                  No active conversations
                </p>
                <p className="text-xs text-neutral-400 max-w-xs mt-1">
                  When you contact an experience host or create a group trip chat, your messages appear here.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filteredConversations.map((conv) => {
                  const id = conv._id || conv.id;
                  const isSelected = String(activeConversation?._id || activeConversation?.id) === String(id);
                  const isGroup = Boolean(conv.isGroup || conv.groupName);
                  const other =
                    conv.participants?.find(
                      (p: any) => String(p._id || p.id) !== String(user.id || (user as any)?._id)
                    ) || {};
                  const title = isGroup
                    ? conv.groupName || conv.name || "Group Trip"
                    : `${other.firstname || "Traveler"} ${other.lastname || ""}`.trim();
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectConversation(conv)}
                      className={`w-full p-4 flex items-center gap-3 text-left transition ${
                        isSelected ? "bg-[#C59A2F]/10" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-sm shrink-0">
                        {(title.charAt(0) || "C").toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs sm:text-sm truncate capitalize">{title}</h4>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {conv.lastMessage?.text || "Tap to view messages"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Right: Active Chat Window */}
          <ChatMessageWindow />
        </div>
      </div>

      <FindFriendsModal open={showFindFriendsModal} onClose={() => setShowFindFriendsModal(false)} />
    </main>
  );
}

export default function ChatPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-28 text-center text-sm text-neutral-400">Loading messages...</div>}>
        <ChatContent />
      </Suspense>
      <Footer />
      <MobileFooter />
    </>
  );
}
