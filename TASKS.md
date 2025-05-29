# Media Agent Project - TASKS

This file lists the development tasks based on the "Project Planning: Media Agent" document.

## Development Process

- [ ] **Step 0: Project Setup & Foundational LLM Interaction:**
    - [ ] Set up Python environment.
    - [ ] Initialize Git repository.
    - [ ] Install Langchain and necessary base libraries.
    - [ ] Implement basic LLM connection (e.g., to OpenAI or Ollama).

- [ ] **Step 1: Core Chat Context Logic (SQLite):**
    - [ ] Implement the `Chat Context Management Module`.
    - [ ] Integrate SQLite for persistent storage of chat histories.

- [ ] **Step 2: Basic React UI Shell & API Connection:**
    - [ ] Set up React project for the frontend.
    - [ ] Develop the basic 3-panel UI structure (Chat List, Main Chat, Setting Panel stub).
    - [ ] Set up backend API (FastAPI/Flask) and establish initial connection with the React frontend.

- [ ] **Step 3: "Setting" Panel Implementation:**
    - [ ] Develop the UI for the "Setting" panel in React (LLM selection, API key input fields).
    - [ ] Implement backend logic to securely save and retrieve these settings via the `Configuration & Credential Management Module`.

- [ ] **Step 4: Multi-LLM & Config Management:**
    - [ ] Integrate LLM selection from the "Setting" panel into the `LLM Interaction Module`.
    - [ ] Ensure the `Configuration & Credential Management Module` handles different LLM configurations.

- [ ] **Step 5: Internet Search Integration:**
    - [ ] Add chosen Langchain search tools (e.g., Tavily, DuckDuckgoSearch) to the `LLM Interaction Module`.
    - [ ] Update UI (if necessary) to indicate or allow search-augmented prompts.

- [ ] **Step 6: Chat Box Management & UI Integration:**
    - [ ] Implement the `Chat Box Management Module` logic (create, delete, switch chat boxes).
    - [ ] Display the chat box list dynamically in the React UI.
    - [ ] Implement functionality to load and display messages for the selected chat box in the main chat window.

- [ ] **Step 7: Detailed Chat UI Implementation (React):**
    - [ ] Implement rounded square message bubbles.
    - [ ] Ensure timestamps are always visible for messages.
    - [ ] Implement dynamically expanding message input area.
    - [ ] Style and implement the "Send" button.

- [ ] **Step 8: Post Generation Logic (Text):**
    - [ ] Implement agent-based post generation (using LLM and context) in the `Post Generation & Confirmation Module`.
    * [ ] Implement functionality for users to write posts directly.
    * [ ] Develop and integrate the agent-draft approval flow within the UI before a post is considered final.

- [ ] **Step 9: Image Upload UI (React):**
    - [ ] Implement UI components for image selection and preview.
    - [ ] Develop logic to send image data from the React frontend to the backend API.
    - [ ] Implement display of media thumbnails in the chat view where appropriate.

- [ ] **Step 10: Backend Image Handling & Threads Integration:**
    - [ ] Create backend API endpoint(s) to receive image and text data.
    - [ ] Implement logic in the `Social Media Integration Module` to handle authentication with Threads.
    - [ ] Implement posting of text and images to Threads using its API.
    - [ ] Ensure robust handling and clear relaying of API-returned image validation errors to the frontend.

- [ ] **Step 11: System Adaptive Theme & Styling:**
    - [ ] Implement CSS (and JavaScript if needed in React) for system adaptive light/dark themes.
    - [ ] Finalize the modern, minimalist, clean, and spacious overall aesthetic.

- [ ] **Step 12: Error Handling Implementation:**
    - [ ] Ensure comprehensive error display components in the React UI.
    - [ ] Implement handling for specific error categories (Connectivity, Message Delivery, User Account, Application Specific, API-returned image validation errors) across relevant backend modules and frontend displays.

- [ ] **Step 13: Full Integration & End-to-End Testing:**
    - [ ] Test all features and workflows thoroughly.
    - [ ] Verify error conditions are handled gracefully.
    - [ ] Conduct usability testing from a personal use perspective.

- [ ] **Step 14: Refinements & User Feedback:**
    - [ ] Iterate on any discovered issues or areas for improvement based on testing and personal use.
    - [ ] Collect and address feedback.

---

## Environment Configuration Setup
- [ ] Create `.env.example` file with necessary environment variables.
- [ ] Document steps for users (primarily yourself) to create their own `.env` file.

---