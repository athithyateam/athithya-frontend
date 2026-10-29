"use client";

import { create } from "zustand";
import {
  getConversationsApi,
  createOrGetConversationApi,
  createGroupChatApi,
  leaveGroupChatApi,
  clearConversationMessagesApi,
  getConversationMessagesApi,
  sendMessageApi,
  sendAttachmentsMessageApi,
  markConversationReadApi,
  updateConversationItineraryPinApi,
} from "@/lib/api/chat-and-notifications-api";

interface ChatState {
  conversations: any[];
  activeConversation: any | null;
  messages: any[];
  loading: boolean;
  sending: boolean;
  fetchConversations: () => Promise<void>;
  selectConversation: (conv: any) => Promise<void>;
  openDirectChat: (recipientId: string) => Promise<void>;
  sendText: (text: string) => Promise<void>;
  sendLocation: (lat: number, lng: number, address?: string) => Promise<void>;
  sendAttachment: (fileUrl: string, text?: string) => Promise<void>;
  createGroup: (groupName: string, participantIds: string[]) => Promise<void>;
  leaveGroup: (conversationId: string) => Promise<void>;
  clearMessages: (conversationId: string) => Promise<void>;
  togglePinDestination: (cityName: string, action: "add" | "remove") => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  sending: false,

  fetchConversations: async () => {
    set({ loading: true });
    try {
      const res = await getConversationsApi();
      const list =
        res?.conversations || res?.data?.conversations || (Array.isArray(res) ? res : []);
      set({ conversations: list });
    } catch {
      set({ conversations: [] });
    } finally {
      set({ loading: false });
    }
  },

  selectConversation: async (conv) => {
    if (!conv) return;
    const convId = conv._id || conv.id;
    set({ activeConversation: conv, messages: [] });
    try {
      const [msgRes] = await Promise.all([
        getConversationMessagesApi(convId),
        markConversationReadApi(convId).catch(() => null),
      ]);
      const list =
        msgRes?.messages || msgRes?.data?.messages || (Array.isArray(msgRes) ? msgRes : []);
      set({ messages: list });
    } catch {
      set({ messages: [] });
    }
  },

  openDirectChat: async (recipientId: string) => {
    try {
      const res = await createOrGetConversationApi(recipientId);
      const conv = res?.conversation || res?.data?.conversation || res;
      if (conv && (conv._id || conv.id)) {
        await get().fetchConversations();
        await get().selectConversation(conv);
      }
    } catch {
      // ignore
    }
  },

  sendText: async (text: string) => {
    const active = get().activeConversation;
    if (!active || !text.trim()) return;
    const convId = active._id || active.id;
    set({ sending: true });
    try {
      const res = await sendMessageApi({
        conversationId: convId,
        text: text.trim(),
        messageType: "text",
      });
      const newMsg = res?.message || res?.data?.message || {
        _id: Date.now().toString(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        isSelf: true,
      };
      set({ messages: [...get().messages, newMsg] });
    } finally {
      set({ sending: false });
    }
  },

  sendLocation: async (lat: number, lng: number, address = "Shared Location") => {
    const active = get().activeConversation;
    if (!active) return;
    const convId = active._id || active.id;
    set({ sending: true });
    try {
      const res = await sendMessageApi({
        conversationId: convId,
        text: `📍 ${address}`,
        messageType: "location",
        locationData: { lat, lng, address },
      });
      const newMsg = res?.message || res?.data?.message;
      if (newMsg) set({ messages: [...get().messages, newMsg] });
    } finally {
      set({ sending: false });
    }
  },

  sendAttachment: async (fileUrl: string, text = "") => {
    const active = get().activeConversation;
    if (!active) return;
    const convId = active._id || active.id;
    set({ sending: true });
    try {
      const res = await sendAttachmentsMessageApi(convId, {
        text,
        attachments: [{ url: fileUrl }],
      });
      const newMsg = res?.message || res?.data?.message;
      if (newMsg) set({ messages: [...get().messages, newMsg] });
    } finally {
      set({ sending: false });
    }
  },

  createGroup: async (groupName: string, participantIds: string[]) => {
    const res = await createGroupChatApi({
      name: groupName,
      groupName,
      participants: participantIds,
    });
    const conv = res?.conversation || res?.data?.conversation || res;
    await get().fetchConversations();
    if (conv && (conv._id || conv.id)) {
      await get().selectConversation(conv);
    }
  },

  leaveGroup: async (conversationId: string) => {
    await leaveGroupChatApi(conversationId);
    set({ activeConversation: null, messages: [] });
    await get().fetchConversations();
  },

  clearMessages: async (conversationId: string) => {
    await clearConversationMessagesApi(conversationId);
    set({ messages: [] });
  },

  togglePinDestination: async (cityName: string, action: "add" | "remove") => {
    const active = get().activeConversation;
    if (!active) return;
    const convId = active._id || active.id;
    const res = await updateConversationItineraryPinApi(convId, { action, cityName });
    const updated = res?.conversation || res?.data?.conversation;
    if (updated) set({ activeConversation: updated });
  },
}));

