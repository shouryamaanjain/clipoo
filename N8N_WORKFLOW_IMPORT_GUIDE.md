# n8n Workflow Import & Setup Guide

This guide will help you import and configure the AI Short Video Generator workflow in n8n Cloud.

## Prerequisites

Before you begin, make sure you have:

1. **n8n Cloud Account** - Sign up at https://n8n.io/cloud
2. **API Keys** for the following services:
   - OpenAI (GPT-4o access)
   - Hume AI (Text-to-Speech)
   - Pexels (Video search)
   - Creatomate (Video rendering)

## Step 1: Get Your API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy and save the key (starts with `sk-`)

### Hume AI API Key
1. Go to https://platform.hume.ai/
2. Sign up for an account
3. Navigate to API settings
4. Generate an API key
5. Copy and save the key

### Pexels API Key
1. Go to https://www.pexels.com/api/
2. Click "Get Started"
3. Your API key will be shown after signing up
4. Copy and save the key

### Creatomate API Key
1. Go to https://creatomate.com/
2. Sign up for an account
3. Navigate to Settings > API
4. Copy your API key (starts with a long hex string)
5. **IMPORTANT**: You also need a template ID - see Step 3 below

## Step 2: Import the Workflow into n8n Cloud

1. **Login to n8n Cloud**
   - Go to https://app.n8n.cloud/
   - Sign in to your account

2. **Import the Workflow**
   - Click on "Workflows" in the left sidebar
   - Click the "+" button or "Import from file"
   - Upload the `n8n-workflow.json` file from this repository
   - The workflow will be imported with all nodes

3. **Activate the Workflow**
   - Don't activate yet! We need to configure credentials first

## Step 3: Configure Creatomate Template

Before setting up credentials, you need to create a Creatomate template:

### Create Your Video Template

1. **Login to Creatomate**
   - Go to https://app.creatomate.com/

2. **Create a New Template**
   - Click "Templates" > "Create Template"
   - Choose "Blank Template" and set:
     - Format: Vertical (1080x1920)
     - Duration: 60 seconds
     - FPS: 30

3. **Add Required Elements**
   
   Your template must have these named elements:

   - **Voiceover** (Audio element)
     - Name: `Voiceover`
     - Type: Audio
     - This will be replaced with the AI-generated voiceover

   - **Background-1** (Video element for Scene 1)
     - Name: `Background-1`
     - Type: Video
     - Duration: ~15 seconds
     - Fill mode: Cover (to fit vertical format)

   - **Text-1** (Text element for Scene 1)
     - Name: `Text-1`
     - Type: Text
     - Position: Bottom third of screen
     - Style: Bold, large font with background or outline
     - Animation: Fade in/out

   - **Background-2, Text-2** (Scene 2)
   - **Background-3, Text-3** (Scene 3)
   - **Background-4, Text-4** (Scene 4)

   Each scene should have:
   - A video background element
   - A text overlay element
   - Proper timing (scenes of ~15 seconds each)

4. **Optional: Add Background Music**
   - Add an audio element named `Music`
   - Upload royalty-free background music
   - Set volume to ~20-30% (so voiceover is clear)

5. **Save and Get Template ID**
   - Save your template
   - Copy the template ID from the URL or template settings
   - It looks like: `c7b8df98-6706-4b90-969f-657bffdc54e1`
   - You'll need this for Step 4

### Example Template Structure

```
Timeline (60 seconds):
├── Voiceover (0-60s) - AI-generated audio
├── Music (0-60s) - Background music (optional)
├── Scene 1 (0-15s)
│   ├── Background-1 - Stock video
│   └── Text-1 - Caption text
├── Scene 2 (15-30s)
│   ├── Background-2 - Stock video
│   └── Text-2 - Caption text
├── Scene 3 (30-45s)
│   ├── Background-3 - Stock video
│   └── Text-3 - Caption text
└── Scene 4 (45-60s)
    ├── Background-4 - Stock video
    └── Text-4 - Caption text
```

## Step 4: Set Up Credentials in n8n

Now configure the API credentials for each service:

### 4.1 OpenAI Credentials

1. Open the workflow in n8n
2. Click on the **"Generate Script with GPT-4o"** node
3. Click "Create New Credential"
4. Select "OpenAI API"
5. Enter:
   - Name: `OpenAI API`
   - API Key: Your OpenAI key (starts with `sk-`)
6. Click "Save"

### 4.2 Hume AI Credentials

1. Click on the **"Generate Voiceover (Hume AI)"** node
2. Click "Create New Credential"
3. Select "Header Auth"
4. Enter:
   - Name: `Hume AI API`
   - Header Name: `X-Hume-Api-Key`
   - Header Value: Your Hume AI key
5. Click "Save"
6. Repeat for the **"Wait for Audio Generation"** node (select the same credential)

### 4.3 Pexels Credentials

1. Click on the **"Search Pexels Videos"** node
2. Click "Create New Credential"
3. Select "Header Auth"
4. Enter:
   - Name: `Pexels API`
   - Header Name: `Authorization`
   - Header Value: Your Pexels API key (just the key, no "Bearer" prefix)
5. Click "Save"

### 4.4 Creatomate Credentials

1. Click on the **"Render Video (Creatomate)"** node
2. Click "Create New Credential"
3. Select "Header Auth"
4. Enter:
   - Name: `Creatomate API`
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_CREATOMATE_API_KEY`
     - Replace `YOUR_CREATOMATE_API_KEY` with your actual key
     - Don't forget the `Bearer ` prefix!
5. Click "Save"
6. Repeat for the **"Check Render Status"** node (select the same credential)

### 4.5 Update Template ID

1. Click on the **"Render Video (Creatomate)"** node
2. Find the JSON Body field
3. Replace `YOUR_TEMPLATE_ID` with your actual Creatomate template ID
4. Save the node

## Step 5: Get Your Webhook URL

1. Click on the **"Webhook"** node at the start of the workflow
2. You'll see the webhook URL (looks like: `https://YOUR_INSTANCE.app.n8n.cloud/webhook/video-generator`)
3. Copy this URL - you'll need it for your frontend

## Step 6: Update Frontend Configuration

1. Open your `.env.local` file in the Next.js project
2. Update the webhook URL:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://YOUR_INSTANCE.app.n8n.cloud/webhook/video-generator
   ```
3. Save the file
4. Restart your development server

## Step 7: Activate the Workflow

1. In n8n, toggle the workflow to "Active" (switch in the top right)
2. The webhook is now listening for requests!

## Step 8: Test the Workflow

### Test in n8n First

1. Click on the **"Webhook"** node
2. Click "Listen for Test Event"
3. Send a test request using curl or Postman:

```bash
curl -X POST https://YOUR_INSTANCE.app.n8n.cloud/webhook/video-generator \
  -H "Content-Type: application/json" \
  -d '{"topic": "Amazing facts about space"}'
```

4. Watch the workflow execute in n8n
5. Check for any errors and fix them

### Test from Your Frontend

1. Start your Next.js app: `npm run dev`
2. Go to http://localhost:3000
3. Enter a topic (e.g., "The science of sleep")
4. Click "Generate"
5. Wait 30-90 seconds for the video to be created
6. Video should appear with preview and download options

## Troubleshooting

### Common Issues

**Error: "Could not parse script JSON"**
- The GPT-4o response might not be in the expected format
- Check the "Parse Script JSON" node logs
- You may need to adjust the prompt in the GPT-4o node

**Error: "No videos found for keywords"**
- Pexels couldn't find videos matching the keywords
- Try broader search terms in your script
- Check your Pexels API key is valid

**Error: "Audio generation not complete yet"**
- Hume AI takes time to generate audio
- Increase the wait time in the "Wait 5 Seconds" node
- Or add a loop to check status multiple times

**Error: "Render failed" from Creatomate**
- Check that your template has all required elements
- Verify element names match exactly (case-sensitive)
- Ensure video URLs are accessible
- Check Creatomate dashboard for error details

**Workflow times out**
- Video generation takes 30-90 seconds
- Make sure your n8n plan supports long-running workflows
- Consider using async rendering (return render ID immediately)

### Checking Logs

1. Go to "Executions" in n8n sidebar
2. Click on the failed execution
3. See which node failed and the error message
4. Expand nodes to see input/output data

## Cost Estimates

Approximate cost per video generation:

- **OpenAI GPT-4o**: ~$0.01-0.03 per script
- **Hume AI TTS**: ~$0.02-0.05 per voiceover (varies by length)
- **Pexels**: FREE (no cost for API usage)
- **Creatomate**: Included in subscription (~$29/month for 100 renders)

**Total per video**: ~$0.03-0.08 + Creatomate subscription

## Workflow Details

The workflow follows this sequence:

1. **Webhook receives topic** from frontend
2. **GPT-4o generates script** with 4 scenes
3. **Parse script JSON** and split into individual scenes
4. **Search Pexels** for video clips for each scene (in parallel)
5. **Extract video URLs** from Pexels results
6. **Aggregate all scenes** back together
7. **Prepare voiceover text** (combine all narrations)
8. **Generate voiceover** with Hume AI
9. **Wait for audio** generation to complete
10. **Prepare Creatomate data** with all assets
11. **Render video** in Creatomate
12. **Wait for rendering** to complete
13. **Check render status** and return video URL
14. **Send response** back to frontend

## Advanced Customization

### Change Video Duration
- Modify the GPT-4o prompt to generate more/fewer scenes
- Adjust scene timings in your Creatomate template

### Use Different Voice
- Change the `"voice"` parameter in the Hume AI node
- Available voices: Check Hume AI documentation

### Add Background Music
- Add a `Music.source` field in Creatomate modifications
- Upload music to Creatomate and use its URL

### Use Different Stock Providers
- Replace Pexels with Pixabay or other services
- Adjust the HTTP request node accordingly

## Support

If you encounter issues:

1. Check the n8n execution logs
2. Verify all API keys are correct
3. Test each service independently
4. Review the Creatomate template setup
5. Check API rate limits and quotas

For more help:
- n8n Community: https://community.n8n.io/
- Creatomate Support: https://creatomate.com/docs
- Hume AI Docs: https://dev.hume.ai/docs
