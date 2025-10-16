'use client';

import { useState } from 'react';
import axios from 'axios';
import { Video, Loader2, Download, Play, Sparkles, CheckCircle2, Zap, Wand2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(0,0,0,0))]" />
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-violet-500/20">
              <Video className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Create Videos with
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Turn any topic into a professional short-form video in seconds.
              <br className="hidden sm:block" />
              Powered by GPT-4o, ElevenLabs, and advanced AI.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-8 sm:p-12">
                <div className="mb-8">
                  <label htmlFor="topic" className="block text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-violet-600" />
                    What video do you want to create?
                  </label>
                  
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                    <div className="relative flex gap-3">
                      <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isGenerating && topic.trim() && handleGenerate()}
                        placeholder="e.g., The science of sleep, History of coffee, Benefits of meditation..."
                        className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-600/10 dark:focus:ring-violet-500/20 outline-none dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isGenerating}
                      />
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic.trim()}
                        className="group/btn px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap shadow-lg shadow-violet-600/30 hover:shadow-xl hover:shadow-violet-600/40 hover:scale-105 active:scale-100"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="hidden sm:inline">Generating</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                            <span className="hidden sm:inline">Generate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-5 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-red-900 dark:text-red-200 text-sm font-medium">{error}</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative inline-flex mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse" />
                      <div className="relative p-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full">
                        <Loader2 className="w-12 h-12 text-white animate-spin" strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                      Creating Your Masterpiece
                    </h3>
                    
                    <div className="max-w-md mx-auto space-y-4">
                      {[
                        { icon: '✨', text: 'Crafting AI script with GPT-4o', delay: 0 },
                        { icon: '🎬', text: 'Finding perfect stock footage', delay: 200 },
                        { icon: '🎙️', text: 'Generating voiceover with ElevenLabs', delay: 400 },
                        { icon: '📝', text: 'Adding dynamic captions', delay: 600 },
                        { icon: '🎥', text: 'Rendering final video', delay: 800 },
                      ].map((step, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-in fade-in slide-in-from-left-4"
                          style={{ animationDelay: `${step.delay}ms` }}
                        >
                          <span className="text-2xl flex-shrink-0">{step.icon}</span>
                          <span className="text-slate-600 dark:text-slate-300 text-left font-medium">{step.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium">
                      Typically completes in 30-90 seconds
                    </p>
                  </div>
                )}

                {videoUrl && !isGenerating && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-6 sm:p-8 border-2 border-green-200 dark:border-green-900/50">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-600 rounded-xl">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Video Ready!
                          </h3>
                        </div>
                        <button
                          onClick={handleDownload}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2.5 shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 hover:scale-105 active:scale-100"
                        >
                          <Download className="w-5 h-5" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </div>
                      
                      <div className="bg-black rounded-2xl overflow-hidden aspect-[9/16] max-w-sm mx-auto shadow-2xl ring-4 ring-slate-900/10">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-full"
                          preload="metadata"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>

                      <div className="mt-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Direct Link</p>
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium break-all transition-colors"
                        >
                          {videoUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  gradient: 'from-violet-600 to-purple-600',
                  title: 'AI-Powered Scripts',
                  description: 'GPT-4o crafts engaging narratives tailored to your topic'
                },
                {
                  icon: Zap,
                  gradient: 'from-blue-600 to-cyan-600',
                  title: 'Lightning Fast',
                  description: 'Professional videos generated in under 90 seconds'
                },
                {
                  icon: Video,
                  gradient: 'from-pink-600 to-rose-600',
                  title: 'Studio Quality',
                  description: 'HD rendering with voiceovers and dynamic visuals'
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  <div className={`inline-flex p-3 bg-gradient-to-r ${feature.gradient} rounded-xl mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
