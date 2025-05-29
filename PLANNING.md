# Project Planning: Media Agent

## Project Overview
Target Audience: Primarily for personal use.

This document outlines the refined plan for a Langchain-based software agent designed to assist with creating and posting content on various social media platforms. This version incorporates detailed user specifications to further clarify project goals and features. The project continues to emphasize Modularity, Simplicity, and Performance as its guiding design principles.

## Architecture

### Core Components
*These components are designed to be decoupled and self-contained:*

1. **LLM Interaction Module:**
 - Manages connections to various LLMs (OpenAI, Ollama, etc.). 
 - Abstracts LLM-specific API calls. 
 - Handles API key management and selection of LLM via the 'Setting' panel". 
 - Includes capability for internet search using integrated tools (e.g., Tavily, DuckDuckgoSearch, Brave Search) to gather real-time information for content generation.

Design Principle Alignment:

Modularity: Centralizes all LLM communication and knowledge retrieval. Adding new LLMs or search tools involves updating this module.

Simplicity: Provides a consistent interface for LLM access and information fetching.

2. **Chat Context Management Module:**
 - Stores, retrieves, and manages conversation history for each individual chat box using SQLite. Ensures context isolation.

Design Principle Alignment:

Modularity: Separates state (conversation history) management.

Simplicity: Clear API for context operations. SQLite simplifies setup for personal use.

Performance: Efficient retrieval of context. Langchain's SQLite cache can also cache LLM calls.

3. **Chat Box Management Module:**
 - Handles the creation, deletion, and selection/switching of chat boxes. Associates chat boxes with their respective contexts.

Design Principle Alignment:

Modularity: Manages the lifecycle and organization of user-facing chat sessions.

Simplicity: Straightforward operations for managing multiple conversation streams.

4. **Social Media Integration Module (Threads Focus):**
 - Manages authentication with social media platforms (initially Threads). 
 - Handles the actual posting of content, including text and images. 
 - Image validation (format, size, aspect ratio, width, color space) will be primarily handled by the destination social media API (e.g., Threads API). 
 - sRGB color space conversion is also expected to be handled by the Threads API. 
 - This module transmits the image and relays any API-returned validation errors to the UI.
 - Designed to be extensible for other platforms.

Design Principle Alignment:

Modularity: Isolates Threads-specific logic.

Simplicity: Offers a clear API for posting content (text, images).

5. **Post Generation & Confirmation Module:**
 - Orchestrates post creation. 
 - Takes user prompts, interacts with the `LLM Interaction Module` (including its search capabilities) for agent-generated posts. 
 - Allows users to write posts directly and upload images. 
 - Manages the user confirmation workflow for agent-generated content before it's finalized for sending. 
 - Prepares images for API submission; validation of image specifications is handled by the Threads API.

Design Principle Alignment:

Modularity: Encapsulates the logic from idea/prompt to a ready-to-send post.

Simplicity: The user-facing "Send" button is the final action to publish. An internal mechanism must ensure agent-generated content is clearly previewed and approved by the user before this "Send" action is applicable.

6. **User Interface (UI) Module:**
 - Provides the means for the user to interact with all other modules via a web browser interface built with React.

 - Panel Arrangement: Single unified window with a three-panel layout:

   - Left: Chat box list.

   - Center: Main chat window (message display and input).

   - Top-Right: "Setting" panel. Allows model selection and API key entry.

 - Chat Box Display:

   - Message Bubbles: Rounded square style.

   - Timestamps: Always visible for messages.

   - Media Display: Thumbnails for images within the chat view.

 - Message Input Area:

   - Size: Dynamically expands as the user types more lines.

   - "Send" Button: Located at the bottom right of the input area. This button initiates the posting workflow for finalized content.

 - Image Uploads: 
   - Provides functionality for users to select and upload images
   - Image validation is primarily handled by the social media API. The UI will display any error messages returned from the API regarding image uploads.
   - Previews thumbnails of uploaded images.

 - Visual Style & Feel:

   - Theme: System adaptive (respects OS light/dark mode, especially for macOS).

   - Overall Aesthetic: Modern, minimalist, clean, and spacious (inspired by current macOS apps, Slack).

Design Principle Alignment:

Modularity: Separation of presentation logic. The backend can be developed independently.

Simplicity: Focus on an intuitive, uncluttered, and conventional user experience based on detailed user preferences.

7. **Configuration & Credential Management Module:**
 - Securely stores API keys (LLMs, social media, search tools) 
 - user preferences (e.g., default LLM) 
 - social media account details, and chat histories (via SQLite).

Design Principle Alignment:

Modularity: Centralizes all persistent configuration and sensitive data.

Simplicity: Easy and secure way to manage settings, leveraging SQLite for local storage.

8. **Error Handling System (Integrated across modules):**
 - Provides robust error detection, user feedback, and logging. Specific categories to address:

   - Connectivity Issues: Handled by `LLM Interaction Module`, `Social Media Integration Module`.

   - Message Delivery & Syncing Errors: Handled by `Social Media Integration Module`, `Chat Context Management Module`.

   - User Account & Session Management Errors: Handled by `Social Media Integration Module`, `Configuration & Credential Management Module`.

   - Application Specific Errors: (e.g., displaying image validation feedback, LLM response parsing) Handled by relevant modules like `Post Generation Module`, UI Module.
   - Image Upload Errors: The `UI Module` will clearly display error messages returned by the social media API concerning image validation failures.

User Feedback: The `UI Module` will be responsible for presenting errors clearly to the user.

## Program Workflow:
**This outlines a high-level user interaction and data flow, incorporating new features:**

1. **Initial Setup & Authentication:**

 - User starts the application (accesses the web UI).
 - User accesses the "Setting" panel to select LLM and enter necessary API keys (for LLM services, search tools).
 - User connects their Threads account. Credentials securely stored.

2. **Chat Box Operations:**

 - User creates, selects, or removes chat boxes. Contexts are isolated and loaded/saved from/to SQLite.

3. **Content Creation - Agent-Generated:**

 - User selects an active chat box.
 - User inputs a prompt/topic. Agent may use internet search via `LLM Interaction Module` for current information.
 - The `Post Generation Module` sends the prompt and context to the selected LLM.
 - LLM returns a draft post. The draft is presented in the UI for user review and explicit approval.
 - User can ask for regeneration, edit, or approve. User may add/upload an image to accompany the text.

4. **Content Creation - User-Written:**

 - User selects an active chat box (optional).
 - User types their post directly and/or uploads an image via the `UI Module`.

5. **Posting to Social Media:**

 - Once content is finalized (user-written or agent-generated and approved) and an optional image is attached:
 - User clicks the "Send" button in the message input area.
 - The `Social Media Integration Module` attempts to post. If there are image validation errors from the API, these are returned and displayed in the UI.
 - The post is published on Threads.

6. **Contextual Conversation:**

 - All interactions are appended to the active chat box's context.


## Technology Stacks:
**Selections consider personal use, Python preference, and detailed UI/UX requirements.**

1. Backend & Core Logic (Python):

 - Langchain: Core for LLM orchestration, context memory, agent capabilities, integrating search tools (e.g., Tavily, DuckDuckgoSearch, Brave Search).

 - FastAPI/Flask: For the backend API serving the React frontend

 - LLM SDKs: `openai`, `ollama-python`, etc.

 - Social Media API Client (Threads): SDK or HTTP requests, must support image uploads.

2.  Frontend (User Interface):

 - React: Chosen technology for the web-based UI, hosted locally.

 - System Adaptive Theme: Implemented using CSS media queries (`prefers-color-scheme`) and JavaScript in React.

3. Database (Chat Context, Configurations, LLM Cache):

 - SQLite: User preference, simple, file-based, well-supported by Langchain for caching.

4. Error Logging: Python's built-in `logging` module.

## Development Process (Modular & Iterative - expanded)
0. Project Setup & Foundational LLM Interaction: Python env, Git, Langchain, basic LLM connection.

1. Core Chat Context Logic (SQLite): Implement `Chat Context Management` with SQLite persistence.

2. Basic React UI Shell & API Connection: Setup React project, basic 3-panel layout, connect to backend API (FastAPI/Flask).

3. "Setting" Panel Implementation: UI for LLM selection, API key input in React, and backend logic to save these.

4. Multi-LLM & Config Management: Integrate LLM selection from settings into `LLM Interaction Module`.

5. Internet Search Integration: Add chosen Langchain search tools to `LLM Interaction Module`.

6. Chat Box Management & UI Integration: Implement `Chat Box Management`, display chat list and main chat window in React.

7. Detailed Chat UI Implementation (React): Message bubbles, timestamps, expandable input, "Send" button.

8. Post Generation Logic (Text): Agent post generation, user direct input. Implement agent-draft approval flow in UI.

9. Image Upload UI (React): Image selection, preview. Logic to send image data to backend.

10. Backend Image Handling & Threads Integration:
 - Backend endpoint to receive image and text.
 - `Social Media Integration Module` to handle posting (text and images) to Threads. Implement robust handling and relaying of API-returned image validation errors.

11. System Adaptive Theme & Styling: Finalize modern/minimalist aesthetics in React.

12. Error Handling Implementation: Ensure comprehensive error display in React UI, especially for API errors (including image validation).

13. Full Integration & End-to-End Testing: All features, workflows, error conditions.

14. Refinements & User Feedback: Iterate based on personal use and feedback.


## Environment Configuration

Create a `.env.example` file with the necessary environment variables (e.g., for API keys if not solely managed through the UI's "Setting" panel, or for backend configurations).
This file will serve as a template for users to create their own `.env` file.