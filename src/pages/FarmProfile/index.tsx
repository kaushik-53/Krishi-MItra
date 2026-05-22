import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MapPin, Crop, Droplets, Edit3, Save, Ruler, X, Sprout, AlertCircle } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { INDIAN_STATES, MAJOR_CROPS, SOIL_TYPES, IRRIGATION_TYPES } from '@/lib/constants';
import type { FarmDetails } from '@/types';

export default function FarmProfile() {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FarmDetails>({
    defaultValues: user?.farm || {
      state: '', district: '', taluka: '', landSizeAcres: 0, 
      soilType: 'loamy', irrigationType: 'rainfed', primaryCrop: '', secondaryCrops: []
    }
  });

  const onSubmit = async (data: FarmDetails) => {
    if (!user) return;
    try {
      setIsLoading(true);
      // Ensure no NaN values are sent to Firestore which causes silent crashes
      const cleanData = {
        ...data,
        landSizeAcres: isNaN(data.landSizeAcres) ? 0 : data.landSizeAcres,
      };
      
      await authService.updateProfile(user.uid, { farm: cleanData });
      const updatedUser = await authService.getUserProfile(user.uid);
      if (updatedUser) setUser(updatedUser);
      setIsEditing(false);
      toast.success(hasFarmData ? 'Profile updated!' : 'Profile setup complete!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null; // Or some loading state if not loaded

  const hasFarmData = !!user.farm && !!user.farm.primaryCrop;

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 w-full max-w-5xl mx-auto">
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{t('farm.title')}</h1>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} leftIcon={<Edit3 className="w-4 h-4" />}>
              {hasFarmData ? t('farm.edit') : 'Setup Profile'}
            </Button>
          )}
        </motion.div>

        {/* Profile Header */}
        <motion.div variants={fadeInUp}>
          <Card className="flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/5 rounded-full blur-3xl" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-4xl text-white font-bold shadow-lg shadow-primary-500/20 z-10">
              {user.displayName?.[0]?.toUpperCase() || '🌾'}
            </div>
            <div className="text-center sm:text-left z-10">
              <h2 className="text-xl font-bold text-text-primary">{user.displayName || 'Farmer'}</h2>
              <p className="text-sm text-text-muted mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="success" className="capitalize">{user.role}</Badge>
                <Badge variant="default" className="uppercase">{user.language}</Badge>
                {hasFarmData && <Badge variant="warning">{user.farm.state}</Badge>}
              </div>
            </div>
          </Card>
        </motion.div>

        {isEditing ? (
          <motion.div variants={fadeInUp} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">Edit Farm Details</h3>
                <Button variant="ghost" size="sm" onClick={() => { reset(); setIsEditing(false); }} className="text-text-muted hover:text-text-primary">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">State</label>
                    <select {...register('state')} className="glass-input w-full" required>
                      <option value="">Select State...</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <Input label="District" placeholder="e.g. Pune" {...register('district')} required />
                  <Input label="Taluka / Village" placeholder="e.g. Haveli" {...register('taluka')} />
                  
                  <Input label="Land Size (Acres)" type="number" step="0.1" {...register('landSizeAcres', { valueAsNumber: true })} required />
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Soil Type</label>
                    <select {...register('soilType')} className="glass-input w-full" required>
                      {SOIL_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Irrigation Type</label>
                    <select {...register('irrigationType')} className="glass-input w-full" required>
                      {IRRIGATION_TYPES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Primary Crop</label>
                    <select {...register('primaryCrop')} className="glass-input w-full" required>
                      <option value="">Select Crop...</option>
                      {MAJOR_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
                  <Button type="button" variant="ghost" onClick={() => { reset(); setIsEditing(false); }}>Cancel</Button>
                  <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>Save Profile</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        ) : !hasFarmData ? (
          <motion.div variants={fadeInUp}>
            <Card className="flex flex-col items-center justify-center py-16 text-center bg-surface-2/30 border-dashed border-2 border-glass-border">
              <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Profile Incomplete</h3>
              <p className="text-text-muted max-w-md mx-auto mb-6">
                Tell us about your farm to get personalized weather alerts, fertilizer recommendations, and market predictions.
              </p>
              <Button onClick={() => setIsEditing(true)} leftIcon={<Sprout className="w-5 h-5" />}>
                Setup Farm Profile
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-400" /> Location & Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-2/50 border border-glass-border">
                  <div className="w-10 h-10 rounded-xl bg-primary-400/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Location</p>
                    <p className="text-sm font-medium text-text-primary">{user.farm.district}, {user.farm.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-2/50 border border-glass-border">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Land Size</p>
                    <p className="text-sm font-medium text-text-primary">{user.farm.landSizeAcres} Acres</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-2/50 border border-glass-border">
                  <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Irrigation</p>
                    <p className="text-sm font-medium text-text-primary capitalize">{user.farm.irrigationType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-2/50 border border-glass-border">
                  <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Soil Type</p>
                    <p className="text-sm font-medium text-text-primary capitalize">{user.farm.soilType}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                <Crop className="w-5 h-5 text-primary-400" /> My Crops
              </h3>
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl bg-primary-400/10 border border-primary-400/20 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Crop className="w-24 h-24 text-primary-600" />
                  </div>
                  <p className="text-xs text-primary-600 font-medium mb-1">Primary Crop</p>
                  <p className="text-xl font-bold text-primary-500">{user.farm.primaryCrop}</p>
                </div>
                
                {user.farm.secondaryCrops && user.farm.secondaryCrops.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-text-muted mb-2">Secondary Crops</p>
                    <div className="flex flex-wrap gap-2">
                      {user.farm.secondaryCrops.map((crop) => (
                        <Badge key={crop} variant="default">{crop}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}
