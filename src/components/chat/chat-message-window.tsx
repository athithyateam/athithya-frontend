"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  ShieldCheck,
  Image as ImageIcon,
  Trash2,
  LogOut,
  Loader2,
} from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { getPresignedUrl, uploadFileToS3 } from "@/lib/api/posts-api";

export function ChatMessageWindow() {
  const { user } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const {
    activeConversation,
    messages,
    sending,
    sendText,
    sendAttachment,
    leaveGroup,
    clearMessages,
  } = useChatStore();

  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isHost = user?.role === "host";

  // Auto scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!activeConversation) {
    return (
      <section className="md:col-span-8 flex flex-col h-full min-h-0 justify-between bg-neutral-50/50 dark:bg-neutral-950/40">
        <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C59A2F]/20 text-[#C59A2F] flex items-center justify-center font-bold">
              <User size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Athithya</h3>
              <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                <ShieldCheck size={12} /> Administrator
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-6 overflow-y-auto space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>
            <div className="max-w-md p-4 rounded-2xl rounded-tl-none bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm shadow-xs leading-relaxed">
              {(() => {
                const roleText = user?.role === "host" ? "host" : "guest";
                const firstName = user?.firstname || (user?.role === "host" ? "Host" : "Guest");
                return `Dear ${roleText} ${firstName}, Welcome to Athithya! Thank you for creating an account as a ${roleText} in Athithya! If you have any queries, feel free to share them with us.`;
              })()}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const convId = activeConversation._id || activeConversation.id;
  const isGroup = Boolean(activeConversation.isGroup || activeConversation.groupName);
  const otherParticipant =
    activeConversation.participants?.find(
      (p: any) => String(p._id || p.id) !== String(user?.id || (user as any)?._id)
    ) || activeConversation.recipient || {};
  const chatTitle = isGroup
    ? activeConversation.groupName || activeConversation.name || "Group Expedition"
    : `${otherParticipant.firstname || "Traveler"} ${otherParticipant.lastname || ""}`.trim();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = text;
    setText("");
    await sendText(msg);
  };

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const presigned = await getPresignedUrl(file.name, file.type, {
        fileSize: file.size,
        uploadType: "chat",
      });
      const uploadUrl = presigned?.uploadUrl || presigned?.data?.uploadUrl;
      const fileUrl = presigned?.fileUrl || presigned?.data?.fileUrl;
      if (!uploadUrl || !fileUrl) throw new Error("Upload URL unavailable");
      await uploadFileToS3(uploadUrl, file);
      await sendAttachment(fileUrl, file.name);
      showToast("Photo sent!", "success");
    } catch (err: any) {
      showToast(err?.message || "Attachment upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="md:col-span-8 flex flex-col h-full min-h-0 justify-between bg-neutral-50/50 dark:bg-neutral-950/40 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-sm">
            {(chatTitle.charAt(0) || "C").toUpperCase()}
          </div>
          <div>
            <h3 className="font-extrabold text-sm capitalize">{chatTitle}</h3>
            <span className="text-[11px] text-neutral-400">
              {isGroup ? `${activeConversation.participants?.length || 2} Members` : "Direct Conversation"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => clearMessages(convId)}
            className="p-2 rounded-full text-neutral-400 hover:text-rose-500 cursor-pointer transition"
            title="Clear Messages"
          >
            <Trash2 size={15} />
          </button>
          {isGroup && (
            <button
              type="button"
              onClick={() => leaveGroup(convId)}
              className="p-2 rounded-full text-neutral-400 hover:text-rose-500 cursor-pointer transition"
              title="Leave Group"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed - Scrollable Container */}
      <div className="flex-1 min-h-0 p-5 overflow-y-auto space-y-3 overscroll-contain">
        {messages.map((m, idx) => {
          const senderId = m.sender?._id || m.sender?.id || m.sender;
          const isMe = m.isSelf || String(senderId) === String(user?.id || (user as any)?._id);
          const attachmentUrl = m.attachments?.[0]?.url || m.image;
          return (
            <div key={m._id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm space-y-2 shadow-xs ${
                  isMe
                    ? "bg-[#C59A2F] text-white rounded-br-none"
                    : "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-bl-none"
                }`}
              >
                {attachmentUrl && (
                  <img
                    src={attachmentUrl}
                    alt="Attachment"
                    className="rounded-xl max-h-56 w-full object-cover cursor-pointer hover:opacity-95 transition"
                    onClick={() => window.open(attachmentUrl, "_blank")}
                  />
                )}
                {m.text && <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>}
                {m.createdAt && (
                  <span
                    className={`block text-[9px] text-right mt-1 opacity-70 ${
                      isMe ? "text-white/80" : "text-neutral-400"
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3.5 border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2 shrink-0"
      >
        {/* Attachment menu: visible only for guests matching athithya-app */}
        {!isHost && (
          <label
            className="p-2 rounded-full text-neutral-500 hover:text-[#C59A2F] hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition"
            title="Upload Image"
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin text-[#C59A2F]" />
            ) : (
              <ImageIcon size={18} />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </label>
        )}

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 text-xs sm:text-sm focus:border-[#C59A2F] focus:bg-white dark:focus:bg-neutral-800 outline-none transition"
        />

        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="p-2.5 rounded-full bg-[#C59A2F] text-white hover:bg-[#A67F26] transition disabled:opacity-50 cursor-pointer shadow-sm"
          title="Send"
        >
          <Send size={15} />
        </button>
      </form>
    </section>
  );
}
