'use client';

import { useState } from 'react';
import axios from 'axios';
import { Video, Loader2, Download, Play, Sparkles } from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError('');
    setVideoUrl('');
    setStatus('Sending your topic to the AI workflow...');

    try {
      const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
      
      if (!n8nWebhookUrl) {
        throw new Error('N8N webhook URL is not configured. Please set NEXT_PUBLIC_N8N_WEBHOOK_URL in your .env.local file');
      }

      const response = await axios.post(n8nWebhookUrl, {
        topic: topic.trim(),
      });

      if (response.data && response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
        setStatus('Video generated successfully!');
      } else {
        throw new Error('No video URL received from the workflow');
      }
    } catch (err: any) {
      console.error('Error generating video:', err);
      setError(err.message || 'Failed to generate video. Please check your n8n workflow and try again.');
      setStatus('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Clipoo
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-Powered Short Video Generator
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Enter any topic and watch AI create a professional short-form video with script, voiceover, visuals, and captions
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What should your video be about?
              </label>
              <div className="flex gap-3">
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="e.g., The history of artificial intelligence, How to make coffee, Amazing facts about space..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {status && !error && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {status}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {isGenerating && (
              <div className="py-12 text-center">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Creating Your Video...
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>✨ Generating AI script with GPT-4o</p>
                  <p>🎬 Finding perfect stock footage</p>
                  <p>🎙️ Creating voiceover with ElevenLabs</p>
                  <p>📝 Adding auto-generated captions</p>
                  <p>🎥 Rendering video with Creatomate</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-6">
                  This usually takes 30-90 seconds
                </p>
              </div>
            )}

            {videoUrl && !isGenerating && (
              <div className="mt-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Play className="w-5 h-5 text-green-600" />
                      Your Video is Ready!
                    </h3>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  
                  <div className="bg-black rounded-lg overflow-hidden aspect-[9/16] max-w-xs mx-auto">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Video URL:</p>
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline break-all"
                    >
                      {videoUrl}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI-Powered</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">GPT-4o generates engaging scripts automatically</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl mb-2">🎙️</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Pro Voiceovers</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">ElevenLabs creates realistic narration</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl mb-2">🎬</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Studio Quality</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Professional rendering with Creatomate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
