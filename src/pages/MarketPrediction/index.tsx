import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, Bell, MapPin, Database, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useNotificationStore } from '@/store/notificationStore';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { marketService, type MandiPrice } from '@/services/market.service';
import { MAJOR_CROPS } from '@/lib/constants';

const INDIAN_STATES = [
  'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function MarketPrediction() {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [selectedState, setSelectedState] = useState('All States');
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    async function loadPrices() {
      setLoading(true);
      try {
        const stateFilter = selectedState !== 'All States' ? selectedState : undefined;
        // Increase limit slightly when filtering to ensure we get enough crop variance
        const liveData = await marketService.getLivePrices(500, stateFilter);
        setPrices(liveData);
      } catch (error) {
        console.error('Failed to load market data', error);
      } finally {
        setLoading(false);
      }
    }
    loadPrices();
  }, [selectedState]);

  const chartData = marketService.aggregateByCrop(prices, selectedCrop);
  const recentPrices = prices.slice(0, 15);

  const handleSetAlert = () => {
    if (!alertPrice) return;
    
    toast.success(`Price alert set for ${selectedCrop} at ₹${alertPrice}`);
    setIsAlertModalOpen(false);
    
    // Simulate the price alert triggering after a short delay
    setTimeout(() => {
      import('firebase/firestore').then(({ Timestamp }) => {
        addNotification({
          id: Date.now().toString(),
          userId: 'user123',
          type: 'price',
          title: 'Price Alert Triggered',
          titleHi: 'कीमत अलर्ट ट्रिगर हुआ',
          message: `${selectedCrop} price has reached your target of ₹${alertPrice}. Current market trends show favorable conditions.`,
          messageHi: `${selectedCrop} की कीमत ₹${alertPrice} के आपके लक्ष्य तक पहुँच गई है। वर्तमान बाजार के रुझान अनुकूल स्थितियाँ दिखाते हैं।`,
          priority: 'high',
          isRead: false,
          deepLink: '/market',
          createdAt: Timestamp.now(),
          readAt: null,
          icon: 'trending-up'
        });
        
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-surface-1 shadow-lg rounded-xl border border-primary-500/30 pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary-400" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    Price Alert Triggered!
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {selectedCrop} has reached your target of ₹{alertPrice}.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-glass-border">
              <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-primary-400 hover:text-primary-300 focus:outline-none">
                Close
              </button>
            </div>
          </div>
        ));
      });
    }, 4000);
    
    setAlertPrice('');
  };

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 max-w-5xl mx-auto">
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{t('market.title')}</h1>
            <p className="text-text-secondary mt-1">Real-time mandi prices across India</p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Bell className="w-4 h-4" />} onClick={() => setIsAlertModalOpen(true)}>{t('market.priceAlert')}</Button>
        </motion.div>

        {loading ? (
           <motion.div variants={fadeInUp} className="flex justify-center py-24">
             <div className="flex flex-col items-center">
               <Loader2 className="w-10 h-10 animate-spin text-primary-400 mb-4" />
               <p className="text-text-muted">Fetching live prices from Data.gov.in...</p>
             </div>
           </motion.div>
        ) : prices.length === 0 ? (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-6 mt-12">
             <Card className="flex flex-col items-center justify-center py-24 text-center">
               <div className="w-20 h-20 rounded-full bg-surface-2 border-2 border-glass-border flex items-center justify-center mb-6">
                  <Database className="w-10 h-10 text-text-muted/50" />
               </div>
               <h3 className="text-xl font-semibold text-text-primary mb-3">
                 {selectedState !== 'All States' ? `No data for ${selectedState}` : 'Market Data Unavailable'}
               </h3>
               <p className="text-text-muted max-w-md mx-auto mb-6">
                 {selectedState !== 'All States' 
                   ? `The Mandis in ${selectedState} may not have uploaded their prices to the Government portal yet today. Please try another state.` 
                   : 'Unable to fetch data from the Government portal. Please try again later.'}
               </p>
             </Card>
          </motion.div>
        ) : (
          <>
            {/* Price Ticker */}
            <motion.div variants={fadeInUp} className="overflow-hidden rounded-2xl bg-surface-1 border border-glass-border p-3">
              <div className="flex gap-6 animate-marquee">
                {[...recentPrices, ...recentPrices].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-sm font-medium text-text-primary">{item.commodity} ({item.market})</span>
                    <span className="text-sm font-mono text-text-primary">₹{item.modal_price}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Price Chart */}
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                <Card>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Price by Market</h3>
                    <div className="flex gap-2">
                      <select 
                        value={selectedState} 
                        onChange={(e) => setSelectedState(e.target.value)} 
                        className="glass-input text-sm py-1.5 px-3 w-auto"
                      >
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select 
                        value={selectedCrop} 
                        onChange={(e) => setSelectedCrop(e.target.value)} 
                        className="glass-input text-sm py-1.5 px-3 w-auto"
                      >
                        {MAJOR_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                        <option value="Tomato">Tomato</option>
                        <option value="Onion">Onion</option>
                        <option value="Potato">Potato</option>
                        <option value="Wheat">Wheat</option>
                      </select>
                    </div>
                  </div>
                  
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E3025" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#5C7A6B', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#5C7A6B', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#1E3025' }} contentStyle={{ background: '#162419', border: '1px solid rgba(82,183,136,0.15)', borderRadius: '12px', color: '#F0FFF4' }} />
                        <Bar dataKey="price" fill="#52B788" radius={[4, 4, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[280px] text-text-muted">
                      No price data available for {selectedCrop} today.
                    </div>
                  )}

                  {/* Prediction placeholder */}
                  <div className="mt-4 p-4 rounded-xl bg-primary-600/10 border border-primary-400/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-primary-400" />
                      <p className="font-semibold text-text-primary">Market Insights</p>
                    </div>
                    <p className="text-sm text-text-secondary">Prices fluctuate based on current arrivals. Keep an eye on the ticker for live updates across states.</p>
                  </div>
                </Card>
              </motion.div>

              {/* Live Mandi Prices List */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <h3 className="text-sm font-medium text-text-secondary mb-4">{t('market.livePrice')}</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {recentPrices.map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-surface-2/50 hover:bg-surface-3 transition-colors cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-text-primary">{item.commodity}</p>
                            <p className="text-xs text-text-muted flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{item.market}, {item.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold font-mono text-text-primary">₹{item.modal_price}</p>
                            <p className="text-[10px] text-text-muted">{item.arrival_date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>

      <Modal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} title="Set Price Alert">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Get notified when the price of <strong>{selectedCrop}</strong> reaches your target.
          </p>
          <Input 
            label="Target Price (₹ per Quintal)" 
            type="number" 
            placeholder="e.g. 2500"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            leftIcon={<span className="text-text-muted font-bold ml-1">₹</span>}
          />
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="ghost" onClick={() => setIsAlertModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSetAlert}>Save Alert</Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
