import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  X,
  Search,
  ArrowRight,
  Radio,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { useVoiceInput, speakText } from '../hooks/useVoiceInput';
import { ARTISAN_PRODUCTS } from '../data/artisanData';
import { Product } from '../types/artisan';

interface AudioInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (village: string) => void;
  onSelectProductToBook: (product: Product) => void;
  onNavigateToOrders: () => void;
}

export const AudioInputModal: React.FC<AudioInputModalProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
  onSelectProductToBook,
  onNavigateToOrders,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en-IN' | 'te-IN' | 'hi-IN'>('en-IN');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [suggestedCrafts, setSuggestedCrafts] = useState<Product[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const {
    isListening,
    transcript,
    interimText,
    fullText,
    volume,
    audioError,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
  } = useVoiceInput({
    language: selectedLanguage,
    onFinalResult: (finalText) => {
      handleVoiceQuery(finalText);
    },
  });

  useEffect(() => {
    if (isOpen) {
      clearTranscript();
      setAiResponse(null);
      setSuggestedCrafts([]);
      startListening();
    } else {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, language: selectedLanguage }),
      });

      const data = await response.json();
      const answer = data.answer || 'Found matching craft results.';
      setAiResponse(answer);

      if (autoSpeak) {
        speakText(answer, selectedLanguage);
      }

      // Find matching products
      const lower = queryText.toLowerCase();
      let matched = ARTISAN_PRODUCTS.filter(
        (p) =>
          p.village.toLowerCase().includes(lower) ||
          p.name.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          p.material.toLowerCase().includes(lower)
      );

      if (matched.length === 0 && data.filterVillage) {
        matched = ARTISAN_PRODUCTS.filter((p) =>
          p.village.toLowerCase().includes(data.filterVillage.toLowerCase())
        );
      }

      setSuggestedCrafts(matched.slice(0, 3));

      // Check actions
      if (data.suggestedAction === 'view_orders' || lower.includes('order') || lower.includes('booking')) {
        setTimeout(() => {
          onNavigateToOrders();
          onClose();
        }, 1800);
      } else if (data.filterVillage && data.suggestedAction === 'filter') {
        onApplyFilter(data.filterVillage);
      }
    } catch (err) {
      console.warn('Voice query fallback error:', err);
      const fallbackAnswer =
        'Exploring authentic GI crafts from Etikoppaka, Kondapalli, Srikalahasti, and Nimmalakunta cooperatives.';
      setAiResponse(fallbackAnswer);
      if (autoSpeak) speakText(fallbackAnswer, selectedLanguage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExamplePrompt = (prompt: string) => {
    handleVoiceQuery(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-amber-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-700/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif">
                Uninterrupted Voice Search & Assistant
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  Continuous Audio
                </span>
              </h2>
              <p className="text-xs text-stone-600">
                Speaks and listens continuously without voice breaks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Language selector & Auto-speak toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-700">Voice Language:</span>
              <div className="flex bg-white rounded-xl p-0.5 border border-stone-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('en-IN')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    selectedLanguage === 'en-IN'
                      ? 'bg-amber-700 text-white font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  English (India)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('te-IN')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    selectedLanguage === 'te-IN'
                      ? 'bg-amber-700 text-white font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  తెలుగు (Telugu)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('hi-IN')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    selectedLanguage === 'hi-IN'
                      ? 'bg-amber-700 text-white font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            </div>

            <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="rounded border-stone-300 text-amber-700 focus:ring-amber-500 bg-white"
              />
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Voice replies</span>
            </label>
          </div>

          {/* Visual Waveform & Mic Status */}
          <div className="flex flex-col items-center justify-center py-6 bg-stone-50 rounded-3xl border border-stone-200 relative overflow-hidden">
            {/* Dynamic Volume Glow Ripple */}
            <div
              className="absolute w-36 h-36 rounded-full bg-amber-500/20 pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `scale(${1 + (volume / 100) * 1.5})`,
                opacity: isListening ? 0.4 + (volume / 100) * 0.6 : 0,
              }}
            />

            {/* Mic Center Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                isListening
                  ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white ring-8 ring-amber-500/20 active:scale-95'
                  : 'bg-white text-stone-500 hover:text-stone-800 border border-stone-300'
              }`}
            >
              {isListening ? (
                <Mic className="w-9 h-9 animate-bounce text-white" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </button>

            {/* Real-time Decibel / Frequency Bars */}
            <div className="flex items-center gap-1.5 mt-5 h-8 px-4">
              {[15, 30, 60, 90, 45, 80, 100, 70, 50, 85, 35, 20].map((height, i) => {
                const activeHeight = isListening ? Math.max(6, Math.min(32, (volume / 100) * height)) : 4;
                return (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      isListening
                        ? 'bg-gradient-to-t from-amber-700 to-amber-500'
                        : 'bg-stone-300'
                    }`}
                    style={{ height: `${activeHeight}px` }}
                  />
                );
              })}
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-semibold text-stone-800">
                {isListening ? 'Listening continuously... Speak naturally without voice breaks' : 'Voice Paused • Tap Mic to Speak'}
              </span>
              {audioError && (
                <p className="text-[11px] text-amber-800 mt-1 max-w-xs">{audioError}</p>
              )}
            </div>
          </div>

          {/* Live Transcript Bubble */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block mb-1">
              Live Voice Transcript:
            </span>
            <p className="text-sm text-stone-900 min-h-[1.5rem]">
              {transcript || interimText ? (
                <span>
                  {transcript} <span className="text-amber-700 font-medium animate-pulse">{interimText}</span>
                </span>
              ) : (
                <span className="text-stone-400 italic">
                  Say "Show Kondapalli toys", "Find jute bags", "Show Etikoppaka caskets", or "Track my order"...
                </span>
              )}
            </p>
          </div>

          {/* AI Response Display */}
          {(isProcessing || aiResponse) && (
            <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Hands2Haven Heritage Guide
                </span>
                {aiResponse && (
                  <button
                    onClick={() => speakText(aiResponse, selectedLanguage)}
                    className="p-1 text-stone-400 hover:text-amber-800 rounded"
                    title="Repeat voice output"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isProcessing ? (
                <div className="flex items-center gap-2 text-xs text-amber-800">
                  <div className="w-3 h-3 rounded-full border-2 border-amber-700 border-t-transparent animate-spin" />
                  <span>Consulting cooperative knowledge base...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{aiResponse}</p>
              )}

              {/* Matched crafts quick cards */}
              {suggestedCrafts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-100 space-y-2">
                  <span className="text-[11px] font-semibold text-amber-900">
                    Recommended Cooperative Crafts:
                  </span>
                  <div className="space-y-1.5">
                    {suggestedCrafts.map((craft) => (
                      <div
                        key={craft.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={craft.imageUrl}
                            alt={craft.name}
                            className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                          />
                          <div>
                            <div className="font-semibold text-stone-900">{craft.name}</div>
                            <div className="text-[10px] text-stone-500">
                              {craft.village} • ₹{craft.price}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onSelectProductToBook(craft);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-all shadow-2xs"
                        >
                          Book Now <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Voice Prompt Suggestions */}
          <div>
            <span className="text-xs font-semibold text-stone-700 block mb-2">
              Try asking:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Show Kondapalli dancing dolls',
                'Find eco-friendly jute bags',
                'Show Etikoppaka lacquer caskets',
                'Tell me about Srikalahasti Kalamkari',
                'Handcrafted brass pitchers in Budithi',
                'Track my active bookings',
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExamplePrompt(query)}
                  className="px-2.5 py-1 text-xs rounded-xl bg-stone-100 text-stone-700 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 transition-all"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
