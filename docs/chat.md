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
  * 2-pane responsive chat layout with conversation search and automatic `?userId=` deep-link handling.
  * **Find Friends (Guests only)**: The former "New Group" button is renamed to **Find Friends** for guests and completely hidden for host accounts. Clicking opens the traveler connect directory.
* **`src/components/chat/chat-group-modal.tsx` ("Find Friends Modal")**:
  * Displays travelers directory with lazy pagination loading **8 guests at a time** with a "Show More" trigger.
  * Right-side **Connect** action matching profile friendship request logic with instant visual pending/connected states.
* **`src/components/chat/chat-message-window.tsx`**:
  * **Branding & Roles**: Default header displays **Athithya** with the **Administrator** badge (replacing "Concierge" / "Verified Support").
  * **Official Welcome Message**: Displays the auto-generated welcoming onboarding message matching `onboardingHelper.js` on backend.
  * Active chat header with **Clear Messages** and **Leave Group** controls.
  * **Message Scroll Feed**: Dedicated scrollable container with smooth auto-scroll to the latest message.
  * Input bar with S3 photo upload (`getPresignedUrl` + `uploadFileToS3`) and text input.

