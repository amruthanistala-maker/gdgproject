import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseVoiceInputOptions {
  language?: string;
  onTranscriptChange?: (text: string) => void;
  onFinalResult?: (finalText: string) => void;
}

export function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const { language = 'en-IN', onTranscriptChange, onFinalResult } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [volume, setVolume] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const isExplicitlyStoppedRef = useRef(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const accumulatedTranscriptRef = useRef('');

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setAudioError('Speech recognition is not supported in this browser. You can type queries directly.');
    }
  }, []);

  // Cleanup audio tracks on unmount
  const stopAudioMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setVolume(0);
  }, []);

  // Setup Web Audio Analyser to show continuous live mic levels without dropping
  const startAudioMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      microphoneStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setVolume(normalized);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err: any) {
      console.warn('Microphone audio context setup notice:', err.message);
    }
  }, []);

  // Continuous speech recognition that auto-reconnects smoothly on pauses (no voice breaks)
  const startListening = useCallback(() => {
    setAudioError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setAudioError('Speech recognition is not natively available. You can also use keyboard search.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      isExplicitlyStoppedRef.current = false;
      accumulatedTranscriptRef.current = '';
      setTranscript('');
      setInterimText('');

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalizedPortion = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalizedPortion += res[0].transcript + ' ';
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (finalizedPortion) {
          accumulatedTranscriptRef.current = (
            accumulatedTranscriptRef.current + ' ' + finalizedPortion
          ).trim();
          setTranscript(accumulatedTranscriptRef.current);
          onTranscriptChange?.(accumulatedTranscriptRef.current);
        }

        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'not-allowed') {
          setAudioError('Microphone permission denied. Please allow microphone access in your browser.');
          isExplicitlyStoppedRef.current = true;
          setIsListening(false);
          stopAudioMonitoring();
        } else if (event.error === 'network') {
          setAudioError('Voice network glitch detected. Reconnecting voice channel...');
        }
      };

      // Seamless auto-reconnect: if browser cuts off recognition due to silent pause, auto-restart immediately!
      recognition.onend = () => {
        if (!isExplicitlyStoppedRef.current) {
          // Restart immediately to prevent voice breaks
          try {
            recognition.start();
          } catch (e) {
            // Slight delay fallback
            setTimeout(() => {
              if (!isExplicitlyStoppedRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch {}
              }
            }, 100);
          }
        } else {
          setIsListening(false);
          stopAudioMonitoring();
          const completeText = accumulatedTranscriptRef.current.trim();
          if (completeText) {
            onFinalResult?.(completeText);
          }
        }
      };

      recognition.start();
      startAudioMonitoring();
    } catch (err: any) {
      console.error('Failed to initialize voice recognition:', err);
      setAudioError(err.message || 'Microphone activation error');
      setIsListening(false);
    }
  }, [language, onFinalResult, onTranscriptChange, startAudioMonitoring, stopAudioMonitoring]);

  const stopListening = useCallback(() => {
    isExplicitlyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    stopAudioMonitoring();

    const complete = accumulatedTranscriptRef.current.trim();
    if (complete) {
      onFinalResult?.(complete);
    }
  }, [onFinalResult, stopAudioMonitoring]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = '';
    setTranscript('');
    setInterimText('');
  }, []);

  return {
    isListening,
    transcript,
    interimText,
    fullText: (transcript + ' ' + interimText).trim(),
    volume,
    audioError,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
  };
}

// Helper to speak out responses smoothly
export function speakText(text: string, lang = 'en-IN') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}
