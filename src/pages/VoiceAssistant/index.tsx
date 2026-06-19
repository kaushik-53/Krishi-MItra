import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import { fadeInUp } from '@/lib/animations';
import { aiService } from '@/services/ai.service';
import toast from 'react-hot-toast';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

// Browser SpeechRecognition type
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function VoiceAssistant() {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [langMode, setLangMode] = useState<'hi-IN' | 'en-IN'>(
    i18n.language === 'hi' ? 'hi-IN' : 'en-IN'
  );
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMode;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Pick a voice matching the language if available
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(langMode.split('-')[0]));
    if (match) utterance.voice = match;

    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');
    synthRef.current = utterance;
    setState('speaking');
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setState('idle');
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      toast.error('Your browser does not support voice input. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = langMode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setTranscript('');
    setResponse('');
    setState('listening');

    recognition.onresult = async (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setState('processing');

      try {
        const result = await aiService.chat(spokenText, {
          preferredLanguage: langMode.startsWith('hi') ? 'hi' : 'en',
        });
        setResponse(result.response);
        speak(result.response);
      } catch {
        const errMsg = 'Sorry, I could not get a response. Please try again.';
        setResponse(errMsg);
        speak(errMsg);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        toast.error('Microphone permission denied. Please allow mic access in your browser.');
      } else if (event.error === 'no-speech') {
        toast('No speech detected. Please try again.', { icon: '🎤' });
      } else {
        toast.error(`Voice error: ${event.error}`);
      }
      setState('idle');
    };

    recognition.onend = () => {
      if (state === 'listening') setState('idle');
    };

    recognition.start();
  };

  const handleOrbClick = () => {
    if (state === 'listening') {
      recognitionRef.current?.abort();
      setState('idle');
    } else if (state === 'speaking') {
      stopSpeaking();
    } else if (state === 'idle') {
      startListening();
    }
  };

  const orbSize = state === 'listening' ? 200 : state === 'processing' ? 180 : 160;
  const orbColor =
    state === 'listening'
      ? 'from-primary-400 to-primary-600'
      : state === 'processing'
      ? 'from-amber-400 to-amber-600'
      : state === 'speaking'
      ? 'from-info to-blue-600'
      : 'from-primary-600 to-primary-900';

  const stateLabel =
    state === 'idle'
      ? t('voice.tapToSpeak')
      : state === 'listening'
      ? t('voice.listening')
      : state === 'processing'
      ? t('voice.processing')
      : t('voice.speaking');

  return (
    <PageWrapper>
      <motion.div {...fadeInUp} className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <h1 className="text-2xl font-bold font-display text-text-primary mb-2">{t('voice.title')}</h1>
        <p className="text-sm text-text-muted mb-4">{stateLabel}</p>

        {/* Language Toggle */}
        <div className="flex items-center gap-2 mb-10 bg-surface-2 border border-glass-border rounded-xl p-1">
          {(['en-IN', 'hi-IN'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLangMode(lang)}
              disabled={state !== 'idle'}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                langMode === lang
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {lang === 'hi-IN' ? '🇮🇳 Hindi' : '🇬🇧 English'}
            </button>
          ))}
        </div>

        {/* Voice Orb */}
        <div className="relative mb-12">
          {/* Pulse rings */}
          {(state === 'listening' || state === 'speaking') && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary-400/20"
                style={{ width: orbSize + 40, height: orbSize + 40, top: -20, left: -20 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary-400/10"
                style={{ width: orbSize + 80, height: orbSize + 80, top: -40, left: -40 }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          <motion.button
            onClick={handleOrbClick}
            animate={{ width: orbSize, height: orbSize }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full bg-gradient-to-br ${orbColor} flex items-center justify-center shadow-2xl relative overflow-hidden cursor-pointer`}
            style={{
              boxShadow:
                state !== 'idle'
                  ? '0 0 60px rgba(82,183,136,0.3)'
                  : '0 0 20px rgba(82,183,136,0.1)',
            }}
            title={state === 'listening' ? 'Tap to stop' : state === 'speaking' ? 'Tap to stop speaking' : 'Tap to speak'}
          >
            {/* Animated waveform inside orb when listening */}
            {state === 'listening' && (
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white/40 rounded-full"
                    animate={{ height: [10, 28 + i * 4, 10] }}
                    transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10">
              {state === 'idle' && <Mic className="w-12 h-12 text-white" />}
              {state === 'listening' && <MicOff className="w-12 h-12 text-white animate-pulse" />}
              {state === 'processing' && (
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 rounded-full bg-white"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              )}
              {state === 'speaking' && <Volume2 className="w-12 h-12 text-white" />}
            </div>
          </motion.button>
        </div>

        {/* Stop speaking button */}
        {state === 'speaking' && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={stopSpeaking}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-surface-2 border border-glass-border text-text-muted hover:text-danger hover:border-danger/30 transition-all text-sm"
          >
            <VolumeX className="w-4 h-4" /> Stop Speaking
          </motion.button>
        )}

        {/* Browser support warning */}
        {!SpeechRecognition && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center max-w-sm">
            ⚠️ Voice input requires Chrome or Edge browser. Other browsers are not supported.
          </div>
        )}

        {/* Transcript & Response */}
        <div className="w-full max-w-lg space-y-4">
          {transcript && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="text-center">
                <p className="text-xs text-text-muted mb-1">You said:</p>
                <p className="text-text-primary font-medium font-hindi">{transcript}</p>
              </Card>
            </motion.div>
          )}
          {response && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-primary-400/20">
                <p className="text-xs text-primary-400 mb-2 flex items-center gap-1">🌾 Krishi Mitra:</p>
                <p className="text-sm text-text-primary leading-relaxed font-hindi whitespace-pre-wrap">{response}</p>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
