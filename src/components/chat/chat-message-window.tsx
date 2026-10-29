"use client";

import { useState } from "react";
import {
  Send,
  User,
  ShieldCheck,
  Image as ImageIcon,
  MapPin,
  Trash2,
  LogOut,
  Plus,
  X,
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
    sendLocation,
    sendAttachment,
    leaveGroup,
    clearMessages,
    togglePinDestination,
  } = useChatStore();

  const [text, setText] = useState("");
  const [pinCity, setPinCity] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!activeConversation) {
    return (
      <section className="md:col-span-8 flex flex-col justify-between bg-neutral-50/50 dark:bg-neutral-950/40">
        <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C59A2F]/20 text-[#C59A2F] flex items-center justify-center font-bold">
              <User size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Athithya Concierge</h3>
              <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                <ShieldCheck size={12} /> Verified Support
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>
            <div className="max-w-md p-4 rounded-2xl rounded-tl-none bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm shadow-xs leading-relaxed">
              Namaste! Welcome to Athithya. Select a conversation on the left, message a host from any experience page, or start a Group Trip Chat to plan your Himalayan itinerary together.
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
  const pinnedPlaces: any[] = activeConversation.itineraryPins || activeConversation.pinnedPlaces || [];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = text;
    setText("");
    await sendText(msg);
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) return showToast("Geolocation not supported", "warning");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendLocation(pos.coords.latitude, pos.coords.longitude, "Live Mountain Coordinates");
        showToast("Location shared in chat!", "success");
      },
      () => showToast("Location permission denied", "error")
    );
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

  const handleAddPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCity.trim()) return;
    await togglePinDestination(pinCity.trim(), "add");
    setPinCity("");
  };

  return (
    <section className="md:col-span-8 flex flex-col justify-between bg-neutral-50/50 dark:bg-neutral-950/40">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
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
            className="p-2 rounded-full text-neutral-400 hover:text-rose-500"
            title="Clear Messages"
          >
            <Trash2 size={15} />
          </button>
          {isGroup && (
            <button
              type="button"
              onClick={() => leaveGroup(convId)}
              className="p-2 rounded-full text-neutral-400 hover:text-rose-500"
              title="Leave Group"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Collaborative Pinned Stops Bar */}
      <div className="px-4 py-2 bg-amber-50/60 dark:bg-neutral-900/90 border-b border-neutral-200/70 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#C59A2F] mr-1">
            Trip Pins:
          </span>
          {pinnedPlaces.map((pin, idx) => {
            const label = typeof pin === "string" ? pin : pin.cityName || pin.title;
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-neutral-800 border text-[11px] font-bold"
              >
                {label}
                <button type="button" onClick={() => togglePinDestination(label, "remove")}>
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
        <form onSubmit={handleAddPin} className="flex items-center gap-1">
          <input
            value={pinCity}
            onChange={(e) => setPinCity(e.target.value)}
            placeholder="Pin stop (e.g. Auli)"
            className="px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[11px] w-32"
          />
          <button type="submit" className="p-1 rounded-full bg-[#C59A2F] text-white">
            <Plus size={12} />
          </button>
        </form>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3">
        {messages.map((m, idx) => {
          const senderId = m.sender?._id || m.sender?.id || m.sender;
          const isMe = m.isSelf || String(senderId) === String(user?.id || (user as any)?._id);
          const attachmentUrl = m.attachments?.[0]?.url || m.image;
          return (
            <div key={m._id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm space-y-2 ${
                  isMe
                    ? "bg-[#C59A2F] text-white rounded-br-none"
                    : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-bl-none"
                }`}
              >
                {attachmentUrl && (
                  <img src={attachmentUrl} alt="Attachment" className="rounded-xl max-h-48 object-cover" />
                )}
                {m.text && <p>{m.text}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3.5 border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2"
      >
        <label className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0])} />
        </label>
        <button
          type="button"
          onClick={handleShareLocation}
          className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title="Share Location"
        >
          <MapPin size={16} />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm focus:border-[#C59A2F] outline-none"
        />
        <button
          type="submit"
          disabled={sending}
          className="p-2.5 rounded-full bg-[#C59A2F] text-white hover:bg-[#A67F26] transition disabled:opacity-50"
        >
          <Send size={15} />
        </button>
      </form>
    </section>
  );
}

