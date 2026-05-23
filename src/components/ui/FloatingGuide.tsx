import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Globe, BookOpen } from 'lucide-react';
import Card from './Card';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/uiStore';

export default function FloatingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useUIStore();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  const detailedGuide = {
    en: {
      title: 'Welcome! How to use Krishi Mitra?',
      steps: [
        { title: '1. Create Your Account', desc: "First, click the 'Login / Register' button on the screen. You can sign up easily using your Google account. This creates your very own private profile." },
        { title: '2. Disease Detection', desc: "If your crop looks sick, don't worry! Tap 'Disease Detection', click a clear photo of the sick leaf with your phone, and our app will instantly tell you the disease and the exact medicine to use." },
        { title: '3. Weather Forecast', desc: "Before you water your crops or spray medicine, check the 'Weather' section. It tells you if it will rain today or tomorrow so your hard work doesn't wash away." },
        { title: '4. Fertilizer Advice', desc: "Not sure how much fertilizer to use? Go to 'Fertilizer Recommendation', enter what you are growing, and the app will tell you the exact amount of Urea or DAP your soil needs." },
        { title: '5. Market Prices (Mandi)', desc: "Don't sell your harvest blindly. Open 'Market Prices' to see the daily live rates of crops in your local Mandi, so you can negotiate the best price." },
        { title: '6. Ask the AI Chatbot', desc: "If you have ANY question about farming, just click on the 'AI Chatbot'. You can type or use your voice to ask anything, and it will reply like an expert agricultural scientist!" }
      ]
    },
    hi: {
      title: 'आपका स्वागत है! ऐप का उपयोग कैसे करें?',
      steps: [
        { title: '1. अपना खाता बनाएं', desc: "सबसे पहले स्क्रीन पर 'लॉग इन' बटन दबाएं। आप अपने गूगल (Google) खाते से आसानी से जुड़ सकते हैं। इससे आपका अपना निजी प्रोफाइल बन जाएगा।" },
        { title: '2. रोग की पहचान (बीमारी)', desc: "अगर फसल बीमार लग रही है, तो 'रोग पहचान' पर जाएं, अपने फोन के कैमरे से खराब पत्ते की साफ फोटो खींचें। हमारा ऐप तुरंत बीमारी का नाम और सही दवा बता देगा।" },
        { title: '3. मौसम की जानकारी', desc: "खेत में पानी देने या दवा छिड़कने से पहले 'मौसम' चेक करें। यह बताएगा कि आज या कल बारिश होगी या नहीं, ताकि आपकी मेहनत बर्बाद न हो।" },
        { title: '4. सही खाद (Fertilizer)', desc: "समझ नहीं आ रहा कि खेत में कितनी खाद डालनी है? 'उर्वरक सलाह' में जाएं, और ऐप आपको बताएगा कि मिट्टी को कितनी यूरिया या DAP की जरूरत है।" },
        { title: '5. सही मंडी भाव', desc: "अपनी फसल बिना भाव जाने न बेचें! 'मंडी भाव' खोलें और अपने आस-पास की मंडियों के आज के ताज़ा दाम देखें, ताकि आपको अपनी मेहनत का पूरा पैसा मिल सके।" },
        { title: '6. AI चैटबॉट से पूछें', desc: "खेती से जुड़ा कोई भी सवाल हो? बस 'AI चैटबॉट' पर जाएं और अपना सवाल बोलकर या लिखकर पूछें। यह आपको एक बड़े कृषि वैज्ञानिक की तरह जवाब देगा!" }
      ]
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[400px] max-w-full origin-bottom-right"
          >
            <Card className="relative overflow-hidden border-primary-500/30 bg-surface-1/95 backdrop-blur-md shadow-2xl flex flex-col max-h-[70vh]">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-3 border-b border-glass-border pb-3 shrink-0">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5 text-primary-400" />
                  </div>
                  <span className="truncate">Krishi Mitra Guide</span>
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:bg-surface-2 transition-colors bg-surface-1 border border-glass-border px-2.5 py-1.5 rounded-lg shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5 text-primary-400" />
                    {language === 'en' ? 'हिंदी' : 'English'}
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-text-muted hover:text-red-400 rounded-lg hover:bg-surface-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 py-2">
                <h4 className="text-base font-display font-bold text-primary-400 mb-4">{detailedGuide[language].title}</h4>
                <div className="space-y-4">
                  {detailedGuide[language].steps.map((step, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0 text-xs font-bold border border-primary-500/20">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-text-primary mb-1">{step.title}</h5>
                        <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative ${
          isOpen ? 'bg-primary-600' : 'bg-primary-500'
        }`}
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}
