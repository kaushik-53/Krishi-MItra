import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Image, X, Download, Share2, History } from 'lucide-react';
import { toast } from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import AIThinkingLoader from '@/components/loaders/AIThinkingLoader';

import { fadeInUp, staggerContainer } from '@/lib/animations';
import { SEVERITY_COLORS } from '@/lib/constants';
import { aiService } from '@/services/ai.service';
import { diseaseService } from '@/services/disease.service';
import { ENV } from '@/config/env';

interface DetectionResult {
  diseaseName: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  treatments: { type: 'organic' | 'chemical'; name: string; dosage: string; application: string }[];
  prevention: string[];
}

const demoResult: DetectionResult = {
  diseaseName: 'Early Blight (Alternaria solani)',
  confidence: 94.2,
  severity: 'medium',
  description: 'Early blight is a common fungal disease affecting tomato and potato plants. Dark concentric rings appear on lower leaves first.',
  treatments: [
    { type: 'organic', name: 'Neem Oil Spray', dosage: '5ml per litre water', application: 'Spray on affected leaves every 7 days' },
    { type: 'organic', name: 'Trichoderma', dosage: '10g per litre', application: 'Soil drench around plant base' },
    { type: 'chemical', name: 'Mancozeb 75% WP', dosage: '2g per litre water', application: 'Foliar spray every 10-14 days' },
    { type: 'chemical', name: 'Chlorothalonil', dosage: '2g per litre', application: 'Preventive spray before symptoms appear' },
  ],
  prevention: ['Use disease-resistant varieties', 'Practice crop rotation (3-year cycle)', 'Remove infected plant debris', 'Ensure proper spacing for air circulation', 'Avoid overhead irrigation'],
};

// Helper function to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String || '');
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function DiseaseDetection() {
  const { t } = useTranslation();
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

  // History states
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.slice(0, 3 - images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 3));
  }, [images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }, maxFiles: 3, maxSize: 5 * 1024 * 1024,
  });

  const removeImage = (index: number) => {
    setImages((prev) => { URL.revokeObjectURL(prev[index]!.preview); return prev.filter((_, i) => i !== index); });
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setIsAnalyzing(true);
    setResult(null);

    let base64Image = '';
    try {
      base64Image = await fileToBase64(images[0]!.file);
    } catch (err) {
      console.error('Failed to convert image:', err);
      toast.error('Failed to read image file');
      setIsAnalyzing(false);
      return;
    }

    try {
      const parsedResult = await aiService.detectDisease(base64Image);
      if (!parsedResult || typeof parsedResult !== 'object' || !parsedResult.diseaseName) {
        throw new Error('Invalid response from detection service');
      }

      // Save to Firestore Database instead of Firebase Storage
      try {
        await diseaseService.saveDetection({
          imageUrl: `data:image/jpeg;base64,${base64Image}`,
          imageUrls: [],
          diseaseName: parsedResult.diseaseName,
          diseaseNameHi: parsedResult.diseaseName,
          confidence: parsedResult.confidence,
          severity: parsedResult.severity,
          description: parsedResult.description,
          descriptionHi: parsedResult.description,
          treatments: (parsedResult.treatments || []).map((t: any) => ({
            type: t.type,
            name: t.name,
            nameHi: t.name,
            dosage: t.dosage,
            application: t.application,
            applicationHi: t.application,
            precautions: []
          })),
          preventionTips: parsedResult.prevention || [],
          preventionTipsHi: parsedResult.prevention || [],
          cropType: 'Crop',
        });
        toast.success('Analysis completed and saved to history!');
      } catch (dbError) {
        console.error('Failed to save to history:', dbError);
        toast.error('Failed to save analysis to history.');
      }

      setResult(parsedResult);
    } catch (error: any) {
      console.error('Disease detection failed:', error);
      toast.error(error.message || 'Local detection service offline');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await diseaseService.getHistory();
      setHistoryList(data);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 w-full">
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{t('disease.title')}</h1>
            <p className="text-text-secondary mt-1">{t('disease.subtitle')}</p>
          </div>
          <Button variant="outline" leftIcon={<History className="w-4 h-4" />} onClick={() => { setShowHistory(true); fetchHistory(); }}>
            {t('disease.history') || 'History'}
          </Button>
        </motion.div>

        {/* Upload Area */}
        <motion.div variants={fadeInUp}>
          <Card>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? 'border-primary-400 bg-primary-400/5' : 'border-glass-border hover:border-primary-400/50 hover:bg-surface-2/50'
              }`}
            >
              <input {...getInputProps()} />
              <motion.div animate={isDragActive ? { scale: 1.05 } : { scale: 1 }} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-primary-400/10 border border-primary-400/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary-400" />
                </div>
                <p className="text-text-primary font-medium">{t('disease.dragDrop')}</p>
                <p className="text-xs text-text-muted">JPEG, PNG, WebP • Max 5MB • Up to 3 images</p>
              </motion.div>
            </div>

            {/* Image previews */}
            {images.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img.preview} alt={`Crop image ${i + 1}`} className="w-24 h-24 object-cover rounded-xl border border-glass-border" />
                    <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <Button onClick={() => { if (images.length === 0) { const input = document.querySelector('input[type="file"]') as HTMLInputElement; input?.click(); } else { handleAnalyze(); } }} isLoading={isAnalyzing} leftIcon={<Image className="w-4 h-4" />}>
                {images.length === 0 ? 'Select Image' : 'Analyze Image'}
              </Button>
              <Button variant="outline" leftIcon={<Camera className="w-4 h-4" />}>{t('disease.camera')}</Button>
            </div>
          </Card>
        </motion.div>

        {/* AI Thinking */}
        {isAnalyzing && (
          <motion.div variants={fadeInUp}><Card><AIThinkingLoader /></Card></motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !isAnalyzing && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Disease Name & Confidence */}
              <Card>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary font-display">{result.diseaseName}</h2>
                    <p className="text-sm text-text-secondary mt-1">{result.description}</p>
                  </div>
                  <Badge variant={result.severity === 'critical' || result.severity === 'high' ? 'danger' : result.severity === 'medium' ? 'warning' : 'success'} size="md">
                    {result.severity.toUpperCase()}
                  </Badge>
                </div>

                {/* Confidence Meter */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted">{t('disease.confidence')}</span>
                      <span className="font-mono font-bold text-primary-400">{result.confidence}%</span>
                    </div>
                    <div className="h-3 bg-surface-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Treatment Options */}
              <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-4">{t('disease.treatment')}</h3>
                <div className="flex gap-2 mb-4">
                  {(['organic', 'chemical'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-primary-400/15 text-primary-400 border border-primary-400/30' : 'text-text-muted hover:text-text-primary bg-surface-2'}`}>
                      {t(`disease.${tab}`)}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {result.treatments.filter((tr) => tr.type === activeTab).map((tr, i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface-2/50 border border-glass-border">
                      <p className="font-medium text-text-primary">{tr.name}</p>
                      <p className="text-xs text-text-muted mt-1"><span className="text-primary-400">Dosage:</span> {tr.dosage}</p>
                      <p className="text-xs text-text-muted"><span className="text-primary-400">Application:</span> {tr.application}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Prevention */}
              <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-3">{t('disease.prevention')}</h3>
                <ul className="space-y-2">
                  {result.prevention.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-primary-400 mt-0.5">✓</span> {tip}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>{t('disease.downloadPdf')}</Button>
                <Button variant="outline" leftIcon={<Share2 className="w-4 h-4" />}>{t('disease.share')}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* History Modal */}
      <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title={t('disease.history') || 'Detection History'} size="lg">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center p-8">
            <Spinner size="lg" className="text-primary-400" />
          </div>
        ) : historyList.length === 0 ? (
          <div className="text-center p-8 text-text-muted">
            No detection history found. Run an analysis to save your first result!
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {historyList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-surface-2 border border-glass-border flex gap-4 hover:border-primary-400/50 transition-colors cursor-pointer"
                onClick={() => {
                  setResult({
                    diseaseName: item.diseaseName,
                    confidence: item.confidence,
                    severity: item.severity,
                    description: item.description,
                    treatments: item.treatments.map((tr: any) => ({
                      type: tr.type,
                      name: tr.name,
                      dosage: tr.dosage,
                      application: tr.application
                    })),
                    prevention: item.preventionTips || []
                  });
                  setShowHistory(false);
                }}
              >
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.diseaseName} className="w-20 h-20 object-cover rounded-xl border border-glass-border flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-text-primary text-base">{item.diseaseName}</h4>
                    <Badge variant={item.severity === 'critical' || item.severity === 'high' ? 'danger' : item.severity === 'medium' ? 'warning' : 'success'} size="sm">
                      {item.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Confidence: <span className="font-mono text-primary-400 font-bold">{item.confidence}%</span>
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {item.detectedAt ? new Date(item.detectedAt.seconds * 1000).toLocaleString() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
