import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sprout, Beaker, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { fertilizerInputSchema, type FertilizerFormInput } from '@/lib/validators';
import { MAJOR_CROPS, SOIL_TYPES, IRRIGATION_TYPES, GROWTH_STAGES } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { aiService } from '@/services/ai.service';

export default function FertilizerRecommendation() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const { user } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FertilizerFormInput>({
    resolver: zodResolver(fertilizerInputSchema),
    defaultValues: { 
      landSizeAcres: user?.farm?.landSizeAcres || 2, 
      budget: 'medium', 
      growthStage: 'seedling',
      cropType: user?.farm?.primaryCrop || '',
      soilType: user?.farm?.soilType || '',
      irrigationType: user?.farm?.irrigationType || '',
    },
  });

  const onSubmit = async (data: FertilizerFormInput) => {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const prompt = `I need a fertilizer recommendation for my farm. 
Crop: ${data.cropType}
Soil Type: ${data.soilType}
Soil pH: ${data.soilPh || 'Unknown'}
Growth Stage: ${data.growthStage}
Irrigation: ${data.irrigationType}
Land Size: ${data.landSizeAcres} acres
Budget: ${data.budget}

Please provide a structured, easy-to-read fertilizer schedule and list the specific fertilizers (NPK ratio or organic alternatives) I should apply right now for optimal yield. Keep it concise.`;

      const result = await aiService.chat(prompt);
      if (result.fallback) {
        toast.error(result.response);
      } else {
        setRecommendation(result.response);
        toast.success('Recommendation generated!');
      }
    } catch (error) {
      toast.error('AI Recommendation Service is temporarily unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 max-w-5xl mx-auto">
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{t('fertilizer.title')}</h1>
          <p className="text-text-secondary mt-1">{t('fertilizer.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('fertilizer.cropType')}</label>
                  <select {...register('cropType')} className="glass-input w-full">
                    <option value="">Select crop...</option>
                    {MAJOR_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.cropType && <p className="text-xs text-danger mt-1">{errors.cropType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('fertilizer.soilType')}</label>
                  <select {...register('soilType')} className="glass-input w-full">
                    <option value="">Select soil...</option>
                    {SOIL_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <Input label={t('fertilizer.soilPh')} type="number" step="0.1" min="0" max="14" placeholder="e.g. 6.5" {...register('soilPh', { valueAsNumber: true })} />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('fertilizer.growthStage')}</label>
                  <select {...register('growthStage')} className="glass-input w-full">
                    {GROWTH_STAGES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('fertilizer.irrigationType')}</label>
                  <select {...register('irrigationType')} className="glass-input w-full">
                    <option value="">Select...</option>
                    {IRRIGATION_TYPES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                </div>
                <Input label={t('fertilizer.landSize')} type="number" step="0.1" {...register('landSizeAcres', { valueAsNumber: true })} error={errors.landSizeAcres?.message} />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('fertilizer.budget')}</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((b) => (
                      <label key={b} className="flex-1">
                        <input type="radio" value={b} {...register('budget')} className="sr-only peer" />
                        <div className="p-2 rounded-xl text-center text-sm border border-glass-border cursor-pointer peer-checked:bg-primary-400/15 peer-checked:border-primary-400/30 peer-checked:text-primary-400 text-text-muted hover:bg-surface-3 transition-all">
                          {b.charAt(0).toUpperCase() + b.slice(1)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<Beaker className="w-4 h-4" />}>
                  {t('fertilizer.getRecommendation')}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Results Area */}
          <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-4">
            {recommendation ? (
               <Card className="h-full">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-primary-400/20 flex items-center justify-center">
                     <CheckCircle2 className="w-6 h-6 text-primary-400" />
                   </div>
                   <h3 className="text-xl font-semibold text-text-primary">Your AI Recommendation</h3>
                 </div>
                 <div className="p-4 rounded-xl bg-surface-2 border border-glass-border text-text-secondary leading-relaxed whitespace-pre-wrap text-sm">
                   {recommendation}
                 </div>
               </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center py-16 text-center h-full">
                <Sprout className="w-16 h-16 text-text-muted/30 mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">No Recommendations Yet</h3>
                <p className="text-text-muted max-w-sm">Fill in the form to get personalized fertilizer recommendations powered by Krishi Mitra AI.</p>
              </Card>
            )}
          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
