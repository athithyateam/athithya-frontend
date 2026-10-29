# Real-Time Direct & Group Chat & Collaborative Trip Pins

Branch: `feat/chat`

---

## 1. Chat State Store (`src/stores/chat-store.ts`)

`useChatStore` manages all conversation state and API interactions:
* `fetchConversations()`: Loads user's 1-on-1 and group conversations (`getConversationsApi` — `GET /api/chat/conversations`).
* `selectConversation(conv)`: Fetches message history (`getConversationMessagesApi`) and marks the conversation as read (`markConversationReadApi`).
* `openDirectChat(recipientId)`: Creates or retrieves a 1-on-1 conversation (`createOrGetConversationApi` — `POST /api/chat/conversations`) when deep-linked from `/chat?userId=:id`.
* `sendText(text)`: Sends a text message (`sendMessageApi` — `POST /api/chat/messages`).
* `sendLocation(lat, lng, address)`: Shares live browser GPS coordinates as a location message.
* `sendAttachment(fileUrl, text)`: Sends S3-uploaded image attachments (`sendAttachmentsMessageApi` — `POST /api/chat/messages/:conversationId/attachments`).
* `createGroup(groupName, participantIds)`: Creates a multi-traveler group expedition chat (`createGroupChatApi` — `POST /api/chat/groups`).
* `leaveGroup(conversationId)` & `clearMessages(conversationId)`: Leaves a group (`leaveGroupChatApi`) or clears message history (`clearConversationMessagesApi`).
* `togglePinDestination(cityName, action)`: Adds or removes collaborative destination stops (`updateConversationItineraryPinApi` — `POST /api/chat/conversations/:id/itinerary`).

---

## 2. Chat UI Components (`src/app/chat/page.tsx` & `src/components/chat/`)

* **`src/app/chat/page.tsx`**:
  * 2-pane responsive chat layout with conversation search, **New Group** button, and automatic `?userId=` deep-link handling.
* **`src/components/chat/chat-group-modal.tsx`**:
  * Searchable modal to select travelers (`getGuestsApi`), name a group expedition, and create a group chat.
* **`src/components/chat/chat-message-window.tsx`**:
  * Active chat header with **Clear Messages** and **Leave Group** controls.
  * **Collaborative Trip Pins Bar**: Displays pinned destinations for the conversation and lets members pin/unpin stops in real time.
  * Message feed supporting text, location pins, and S3 image attachments.
  * Input bar with S3 photo upload (`getPresignedUrl` + `uploadFileToS3`), one-click GPS location sharing, and text input.

