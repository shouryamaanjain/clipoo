# n8n Cloud Workflow Setup Guide

## Overview
This guide will help you set up the complete n8n Cloud workflow for Clipoo - an AI-powered short video generator. The workflow integrates GPT-4o for script generation, Pexels/Pixabay for stock footage, ElevenLabs for voiceovers, and Creatomate for video rendering.

## Prerequisites

### API Keys Required
1. **OpenAI API Key** - For GPT-4o script generation
   - Get it from: https://platform.openai.com/api-keys
   
2. **Pexels API Key** - For stock video footage
   - Get it from: https://www.pexels.com/api/
   
3. **Pixabay API Key** (Optional, fallback)
   - Get it from: https://pixabay.com/api/docs/
   
4. **ElevenLabs API Key** - For AI voiceovers
   - Get it from: https://elevenlabs.io/
   
5. **Creatomate API Key** - For video rendering
   - Get it from: https://creatomate.com/

## Step-by-Step n8n Workflow Creation

### 1. Create New Workflow in n8n Cloud

1. Log into your n8n Cloud account at https://app.n8n.cloud
2. Click "Create new workflow"
3. Name it "Clipoo - AI Video Generator"

### 2. Add Credentials

Before building the workflow, add all your API credentials:

#### OpenAI Credentials
1. Go to Settings → Credentials → Add Credential
2. Select "OpenAI API"
3. Enter your OpenAI API Key
4. Save as "OpenAI API"

#### Pexels Credentials
1. Add Credential → "Pexels API"
2. Enter your Pexels API Key
3. Save as "Pexels API"

#### Pixabay Credentials
1. Add Credential → "Pixabay API"
2. Enter your Pixabay API Key
3. Save as "Pixabay API"

#### ElevenLabs Credentials
1. Add Credential → "ElevenLabs API"
2. Enter your ElevenLabs API Key
3. Save as "ElevenLabs API"

#### Creatomate Credentials
1. Add Credential → "HTTP Header Auth"
2. Name: "Authorization"
3. Value: "Bearer YOUR_CREATOMATE_API_KEY"
4. Save as "Creatomate API"

### 3. Build the Workflow

Follow these steps to create each node in order:

#### Node 1: Webhook (Trigger)
- **Type**: Webhook
- **Settings**:
  - HTTP Method: POST
  - Path: `clipoo-generate` (or your custom path)
  - Response Mode: "Respond to Webhook"
- **Save** the workflow to get your webhook URL
- **Copy** the Production Webhook URL - you'll need this for your Next.js app

#### Node 2: Extract Topic
- **Type**: Set (Edit Fields)
- **Operation**: Set
- **Fields to Set**:
  - Name: `topic`
  - Value: `={{ $json.body.topic }}`
- **Connect** from Webhook node

#### Node 3: GPT-4o Generate Script
- **Type**: OpenAI Chat Model
- **Settings**:
  - Model: `gpt-4o`
  - Credentials: Select your OpenAI credentials
  - System Message (or User Message):
    ```
    You are a professional short-form video scriptwriter. Create an engaging script for a vertical short video (30-60 seconds) about: {{ $json.topic }}.

    Format your response as a JSON object with this structure:
    {
      "scenes": [
        {
          "sceneNumber": 1,
          "narration": "Text to be spoken",
          "visualKeywords": ["keyword1", "keyword2", "keyword3"],
          "duration": 5
        }
      ]
    }

    Create 4-6 scenes. Each scene should:
    - Have engaging narration (10-15 words)
    - Include 3-5 visual keywords for stock footage search
    - Have a duration of 4-8 seconds
    - Build a cohesive story

    Ensure the total duration is 30-60 seconds. Make it engaging, educational, and perfect for social media.
    ```
  - Temperature: 0.7
  - Max Tokens: 2000
- **Connect** from Extract Topic node

#### Node 4: Parse Script JSON
- **Type**: Code (JavaScript)
- **Code**:
  ```javascript
  const response = items[0].json.response || items[0].json.message?.content || items[0].json.text;
  const parsed = JSON.parse(response);
  return parsed.scenes.map(scene => ({ json: scene }));
  ```
- **Connect** from GPT-4o node

#### Node 5: Loop Over Scenes
For each scene, you'll need to:
1. Fetch stock footage
2. Generate voiceover
3. Combine them

Use the **Split In Batches** node or create a loop structure.

#### Node 6: Fetch Stock Video - Pexels
- **Type**: HTTP Request
- **Method**: GET
- **URL**: `https://api.pexels.com/videos/search?query={{ $json.visualKeywords.join('+') }}&per_page=5&orientation=portrait`
- **Authentication**: Use Pexels API credentials
- **Headers**:
  - Authorization: `YOUR_PEXELS_API_KEY`

#### Node 7: Fetch Stock Video - Pixabay (Fallback)
- **Type**: HTTP Request
- **Method**: GET
- **URL**: `https://pixabay.com/api/videos/?key=YOUR_PIXABAY_API_KEY&q={{ $json.visualKeywords.join('+') }}&video_type=film&orientation=vertical&per_page=5`

#### Node 8: Select Best Video
- **Type**: Set (Edit Fields)
- **Code to extract video URL**:
  ```
  {{ $json.videos[0]?.video_files[0]?.link || $json.hits[0]?.videos?.medium?.url }}
  ```

#### Node 9: Generate Voiceover with ElevenLabs
- **Type**: ElevenLabs
- **Operation**: Text to Speech
- **Credentials**: Select ElevenLabs credentials
- **Settings**:
  - Voice: Choose a voice (e.g., "Rachel" - ID: 21m00Tcm4TlvDq8ikWAM)
  - Text: `={{ $json.narration }}`
  - Stability: 0.5
  - Similarity Boost: 0.75

#### Node 10: Aggregate All Scenes
- **Type**: Aggregate
- **Operation**: Aggregate all item data
- This collects all processed scenes together

#### Node 11: Render Video with Creatomate
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://api.creatomate.com/v1/renders`
- **Authentication**: Use Creatomate credentials
- **Body**:
  ```json
  {
    "template_id": "YOUR_CREATOMATE_TEMPLATE_ID",
    "modifications": {
      "Composition-1": {
        "duration": {{ $json.scenes.reduce((acc, s) => acc + s.duration, 0) }}
      }
    }
  }
  ```

**Note**: You'll need to create a template in Creatomate first. Use their Storytelling template as a starting point.

#### Node 12: Poll Render Status
- **Type**: HTTP Request (in a loop)
- **Method**: GET
- **URL**: `https://api.creatomate.com/v1/renders/{{ $json.id }}`
- Add a **Wait** node (5 seconds) and an **IF** node to check if `status === "succeeded"`
- Loop back to poll again if not complete

#### Node 13: Respond to Webhook
- **Type**: Respond to Webhook
- **Response Body**:
  ```json
  {
    "videoUrl": "{{ $json.url }}",
    "status": "success",
    "message": "Video generated successfully"
  }
  ```

### 4. Activate the Workflow

1. Click "Activate" in the top right
2. Copy your Production Webhook URL
3. Add it to your Next.js `.env.local` file:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/clipoo-generate
   ```

## Simplified Workflow (Alternative)

If the full workflow is too complex, here's a simplified version that you can build first:

### Minimal Working Workflow

1. **Webhook** - Receives topic
2. **OpenAI** - Generates script with GPT-4o
3. **Code Node** - Parses JSON and creates simple modifications
4. **HTTP Request** - Calls Creatomate with static template
5. **Respond to Webhook** - Returns video URL

This minimal version skips:
- Dynamic stock footage fetching (use template's default videos)
- ElevenLabs voiceover (use Creatomate's text-to-speech)
- Complex scene processing

### Testing Your Workflow

1. Use n8n's "Test Workflow" button
2. Send a test webhook with:
   ```json
   {
     "topic": "The benefits of meditation"
   }
   ```
3. Check each node's output to debug issues

## Creatomate Template Setup

### Using the Default Storytelling Template

1. Log into Creatomate
2. Go to Templates
3. Find "Storytelling" template (or create one)
4. Customize it for vertical video (9:16 aspect ratio)
5. Add dynamic elements for:
   - Text overlays (for captions)
   - Video backgrounds
   - Audio tracks
6. Note the Template ID (you'll need it in the workflow)

### Template Modifications Structure

```json
{
  "template_id": "your-template-id",
  "modifications": {
    "Text-1": "{{ scene.narration }}",
    "Video-1": "{{ scene.videoUrl }}",
    "Audio-1": "{{ scene.audioUrl }}"
  }
}
```

## Troubleshooting

### Common Issues

1. **Webhook not responding**
   - Make sure workflow is activated
   - Check that CORS is enabled (should be automatic in n8n)
   - Verify webhook URL is correct

2. **GPT-4o returns invalid JSON**
   - Add error handling in the Parse node
   - Adjust the prompt to be more specific about JSON format

3. **Stock footage not found**
   - Add fallback logic
   - Use more generic keywords

4. **Render times out**
   - Increase the timeout in Poll node
   - Add more wait time between polls

5. **No video URL returned**
   - Check Creatomate template is public
   - Verify API key has correct permissions

## Cost Estimates

- **OpenAI GPT-4o**: ~$0.01 per video
- **ElevenLabs**: ~$0.05 per video (depends on voice and length)
- **Pexels/Pixabay**: Free (with attribution)
- **Creatomate**: Varies by plan
- **n8n Cloud**: Depends on workflow executions

Total cost per video: ~$0.06 - $0.20 (excluding Creatomate)

## Next Steps

1. Set up all your API keys
2. Create the n8n workflow following this guide
3. Test with a simple topic first
4. Iterate and improve based on results
5. Deploy your Next.js frontend

## Support Resources

- n8n Documentation: https://docs.n8n.io
- OpenAI API Docs: https://platform.openai.com/docs
- Creatomate Docs: https://creatomate.com/docs
- ElevenLabs Docs: https://elevenlabs.io/docs

---

For issues or questions, refer to the README.md file in this repository.
