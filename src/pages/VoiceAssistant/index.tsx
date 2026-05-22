import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import { fadeInUp } from '@/lib/animations';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function VoiceAssistant() {
  const { t } = useTranslation();
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const toggleListening = async () => {
    if (state === 'idle') {
      setState('listening');
      setTranscript('');
      setResponse('');
      // Simulate listening
      setTimeout(() => {
        setTranscript('मेरे गेहूं की फसल में पीलापन आ रहा है, क्या करूं?');
        setState('processing');
        setTimeout(() => {
          setResponse('पत्तियों का पीला होना नाइट्रोजन की कमी या Early Blight के कारण हो सकता है। 5 ग्राम यूरिया प्रति लीटर पानी का छिड़काव करें। अगर भूरे धब्बे दिखें तो Mancozeb 2 ग्राम/लीटर का उपयोग करें।');
          setState('speaking');
          setTimeout(() => setState('idle'), 5000);
        }, 2000);
      }, 3000);
    } else {
      setState('idle');
    }
  };

  const orbSize = state === 'listening' ? 200 : state === 'processing' ? 180 : 160;
  const orbColor = state === 'listening' ? 'from-primary-400 to-primary-600' : state === 'processing' ? 'from-amber-400 to-amber-600' : state === 'speaking' ? 'from-info to-blue-600' : 'from-primary-600 to-primary-900';

  return (
    <PageWrapper>
      <motion.div {...fadeInUp} className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <h1 className="text-2xl font-bold font-display text-text-primary mb-2">{t('voice.title')}</h1>
        <p className="text-sm text-text-muted mb-12">
          {state === 'idle' && t('voice.tapToSpeak')}
          {state === 'listening' && t('voice.listening')}
          {state === 'processing' && t('voice.processing')}
          {state === 'speaking' && t('voice.speaking')}
        </p>

        {/* Voice Orb */}
        <div className="relative mb-12">
          {/* Pulse rings */}
          {(state === 'listening' || state === 'speaking') && (
            <>
              <motion.div className="absolute inset-0 rounded-full border-2 border-primary-400/20" style={{ width: orbSize + 40, height: orbSize + 40, top: -20, left: -20 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
              <motion.div className="absolute inset-0 rounded-full border-2 border-primary-400/10" style={{ width: orbSize + 80, height: orbSize + 80, top: -40, left: -40 }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
            </>
          )}

          <motion.button onClick={toggleListening}
            animate={{ width: orbSize, height: orbSize }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`rounded-full bg-gradient-to-br ${orbColor} flex items-center justify-center shadow-2xl relative overflow-hidden cursor-pointer`}
            style={{ boxShadow: state !== 'idle' ? '0 0 60px rgba(82,183,136,0.3)' : '0 0 20px rgba(82,183,136,0.1)' }}
          >
            {/* Animated waves inside orb when active */}
            {state === 'listening' && (
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div key={i} className="w-1 bg-white/40 rounded-full"
                    animate={{ height: [12, 30 + Math.random() * 20, 12] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.1 }} />
                ))}
              </div>
            )}

            <div className="relative z-10">
              {state === 'idle' && <Mic className="w-12 h-12 text-white" />}
              {state === 'listening' && <Mic className="w-12 h-12 text-white animate-pulse" />}
              {state === 'processing' && (
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-3 h-3 rounded-full bg-white"
                      animate={{ y: [0, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              )}
              {state === 'speaking' && <Volume2 className="w-12 h-12 text-white" />}
            </div>
          </motion.button>
        </div>

        {/* Transcript */}
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
                <p className="text-xs text-primary-400 mb-1 flex items-center gap-1">🌾 Krishi Mitra:</p>
                <p className="text-sm text-text-primary leading-relaxed font-hindi">{response}</p>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
