import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Container from '@/components/layout/Container';

const testimonials = [
  { name: 'Rajesh Kumar', crop: 'Wheat & Rice', state: 'Uttar Pradesh', quote: 'Krishi Mitra helped me identify a rust disease in my wheat crop early. The AI recommended treatment saved my entire harvest worth ₹2 lakh.', quoteHi: 'कृषि मित्र ने मेरी गेहूं की फसल में जल्दी रस्ट रोग की पहचान कर ली। AI की सलाह ने मेरी ₹2 लाख की फसल बचा ली।' },
  { name: 'Sunita Devi', crop: 'Cotton & Soybean', state: 'Maharashtra', quote: 'The market price predictions are spot on! I sold my cotton at the right time and earned 20% more than last season.', quoteHi: 'बाज़ार भाव पूर्वानुमान बिल्कुल सही निकलता है! मैंने सही समय पर कपास बेची और पिछली बार से 20% ज़्यादा कमाया।' },
  { name: 'Arvind Patel', crop: 'Sugarcane', state: 'Gujarat', quote: 'The voice assistant in Hindi is a game changer. I can ask questions while working in the field without touching my phone.', quoteHi: 'हिंदी वॉयस असिस्टेंट कमाल का है। मैं खेत में काम करते हुए बिना फोन छुए सवाल पूछ सकता हूं।' },
];

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(0);
  const lang = i18n.language;

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const item = testimonials[current]!;

  return (
    <section className="py-24" id="testimonials">
      <Container size="md" clean>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary mb-4">{t('testimonials.title')}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-amber-400 mx-auto rounded-full" />
        </motion.div>

        <div className="relative glass-card p-8 sm:p-12">
          <Quote className="absolute top-6 left-6 w-10 h-10 text-primary-400/20" />
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">{item.name[0]}</div>
              <p className="text-lg sm:text-xl text-text-primary leading-relaxed mb-6 italic max-w-2xl mx-auto">"{lang === 'hi' ? item.quoteHi : item.quote}"</p>
              <p className="text-base font-semibold text-text-primary">{item.name}</p>
              <p className="text-sm text-primary-400">{item.crop} — {item.state}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)} className="p-2 rounded-full bg-surface-2 border border-glass-border hover:border-primary-400/30 transition-colors" aria-label="Previous"><ChevronLeft className="w-5 h-5 text-text-secondary" /></button>
            <div className="flex gap-2">{testimonials.map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary-400' : 'bg-surface-3'}`} />))}</div>
            <button onClick={() => setCurrent((p) => (p + 1) % testimonials.length)} className="p-2 rounded-full bg-surface-2 border border-glass-border hover:border-primary-400/30 transition-colors" aria-label="Next"><ChevronRight className="w-5 h-5 text-text-secondary" /></button>
          </div>
        </div>
      </Container>
    </section>
  );
}
