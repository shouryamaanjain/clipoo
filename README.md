# Clipoo - AI Short Video Generator

An intelligent, fully automated short-video generator that turns any topic into a professional vertical video with AI-generated script, voiceover, visuals, and captions.

## Features

- **AI-Powered Script Generation**: GPT-4o creates engaging, scene-based scripts optimized for short-form content
- **Professional Voiceovers**: Hume AI generates emotionally expressive narration
- **Dynamic Stock Footage**: Automatically fetches relevant videos from Pexels
- **Auto-Generated Captions**: Synced text overlays from narration
- **Studio-Quality Rendering**: Creatomate produces polished vertical videos (9:16 format)
- **One-Click Generation**: Enter a topic and get a complete video in 30-90 seconds

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

### Backend (n8n Cloud Workflow)
- **n8n Cloud** - Workflow automation engine
- **OpenAI GPT-4o** - Script generation
- **Hume AI** - Emotionally expressive TTS voiceover synthesis
- **Pexels API** - Stock video footage
- **Creatomate** - Video composition and rendering

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API keys for:
  - OpenAI (GPT-4o)
  - Hume AI
  - Pexels
  - Creatomate
- n8n Cloud account

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/shouryamaanjain/clipoo.git
   cd clipoo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your n8n webhook URL:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/clipoo-generate
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

### n8n Workflow Setup

**We provide a ready-to-import workflow JSON file!** 

Import `n8n-workflow.json` directly into n8n Cloud and configure your API keys. See [N8N_WORKFLOW_IMPORT_GUIDE.md](./N8N_WORKFLOW_IMPORT_GUIDE.md) for complete setup instructions.

**Quick Setup Steps:**

1. Log into [n8n Cloud](https://app.n8n.cloud)
2. Import the `n8n-workflow.json` file
3. Configure API credentials for:
   - OpenAI (GPT-4o)
   - Hume AI (Text-to-Speech) 
   - Pexels (Stock videos)
   - Creatomate (Video rendering)
4. Create a Creatomate template with required elements
5. Activate the workflow and copy the webhook URL
6. Add the webhook URL to your `.env.local` file

For the complete step-by-step guide, see [N8N_WORKFLOW_IMPORT_GUIDE.md](./N8N_WORKFLOW_IMPORT_GUIDE.md).

## How It Works

### Workflow Pipeline

```
User Input (Topic)
      ↓
Frontend sends to n8n webhook
      ↓
GPT-4o generates scene-based script
      ↓
For each scene:
  ├─ Fetch stock video (Pexels)
  └─ Extract keywords for visuals
      ↓
Generate voiceover (Hume AI)
      ↓
Aggregate all scenes
      ↓
Creatomate renders final video
      ↓
Frontend displays video for preview/download
```

### Script Generation Format

GPT-4o creates a structured JSON script:

```json
{
  "scenes": [
    {
      "sceneNumber": 1,
      "narration": "Did you know that space is completely silent?",
      "visualKeywords": ["space", "stars", "silence", "cosmos"],
      "duration": 6
    }
  ]
}
```

## Usage

1. Open the app in your browser
2. Enter any topic in the input field
3. Click "Generate" or press Enter
4. Wait 30-90 seconds while the AI workflow runs
5. Preview and download your video

## Example Topics

- "5 amazing facts about the ocean"
- "How to stay productive while working from home"
- "The science behind dreams"
- "Quick healthy breakfast ideas"
- "Benefits of meditation"

## Development

### Project Structure

```
clipoo/
├── app/
│   ├── page.tsx           # Main video generator UI
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles
├── public/                      # Static assets
├── .env.local.example           # Environment variable template
├── n8n-workflow.json            # Ready-to-import n8n workflow
├── N8N_WORKFLOW_IMPORT_GUIDE.md # Complete setup & import guide
└── README.md                    # This file
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server

## Deployment

Deploy to Vercel (recommended):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shouryamaanjain/clipoo)

**Important**: Set the `NEXT_PUBLIC_N8N_WEBHOOK_URL` environment variable in your deployment platform.

## Troubleshooting

### Frontend Issues

**"N8N webhook URL is not configured"**
- Make sure `.env.local` exists and contains `NEXT_PUBLIC_N8N_WEBHOOK_URL`

**"Failed to generate video"**
- Check that your n8n workflow is activated and the webhook URL is correct

### n8n Workflow Issues

See [N8N_WORKFLOW_IMPORT_GUIDE.md](./N8N_WORKFLOW_IMPORT_GUIDE.md) for detailed troubleshooting.

## Cost Estimates

Per video generation:
- **OpenAI GPT-4o**: ~$0.01-0.03
- **Hume AI**: ~$0.02-0.05
- **Pexels**: Free
- **Creatomate**: Included in subscription

**Total**: ~$0.03-0.08 per video (excluding Creatomate subscription)

## Support

For issues or questions:
- Open an issue on GitHub
- Check [N8N_WORKFLOW_IMPORT_GUIDE.md](./N8N_WORKFLOW_IMPORT_GUIDE.md)
- Review [n8n documentation](https://docs.n8n.io)

## Author

Created by [Shouryamaan Jain](https://github.com/shouryamaanjain)

---

**Made with ❤️ using Next.js, n8n, and AI**
