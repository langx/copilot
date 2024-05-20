# :robot: LangX Copilot

LangX Copilot is an innovative AI-powered tool designed to enhance your language learning journey. This feature-rich platform offers personalized feedback to improve your language skills in real-time. LangX Copilot ensures your privacy while providing corrections and explanations directly to you.

## Features

- **Personalized Feedback**: Get real-time corrections and explanations to enhance your language learning.
- **Grammar Correction**: Automatically corrects grammar mistakes and provides detailed explanations.
- **Privacy Focused**: Feedback is provided confidentially, ensuring your privacy is maintained.
- **Supports Multiple Languages**: Not limited to English, LangX Copilot supports various languages for grammar correction.

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm (Node Package Manager)
- Cloudflare account with Workers enabled
- Discord account and bot set up in the Discord Developer Portal

### Installation

1. **Clone the repository**:

```sh
git clone https://github.com/langx/copilot.git
cd copilot
```

2. **Install dependencies**

```sh
npm install
```

3. **Copy `.env` file** with the following environment variables:

```sh
cp .env.sample .env
```

4. **Fill in the environment variables** in the `.env` file:

- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `DISCORD_CLIENT_ID`: Your Discord client ID
- `GEMINI_API_KEY`: Your Gemini API key

5. **Run the application**:

```sh
npm start discord
```

6. **Deploy the Bot (Optional)**:

```sh
npm i pm2 -g
node discord/registerCommands.js
pm2 start discord/bot.js --name copilot
```
