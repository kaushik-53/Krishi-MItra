import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, Bell, MapPin, Database, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { marketService, type MandiPrice } from '@/services/market.service';
import { MAJOR_CROPS } from '@/lib/constants';

export default function MarketPrediction() {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<MandiPrice[]>([]);

  useEffect(() => {
    async function loadPrices() {
      setLoading(true);
      try {
        const liveData = await marketService.getLivePrices(500);
        setPrices(liveData);
      } catch (error) {
        console.error('Failed to load market data', error);
      } finally {
        setLoading(false);
      }
    }
    loadPrices();
  }, []);

  const chartData = marketService.aggregateByCrop(prices, selectedCrop);
  const recentPrices = prices.slice(0, 15);

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 max-w-5xl mx-auto">
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{t('market.title')}</h1>
            <p className="text-text-secondary mt-1">Real-time mandi prices across India</p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Bell className="w-4 h-4" />}>{t('market.priceAlert')}</Button>
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
               <h3 className="text-xl font-semibold text-text-primary mb-3">Market Data Unavailable</h3>
               <p className="text-text-muted max-w-md mx-auto mb-6">
                 Unable to fetch data. Please check your API key or try again later.
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">{selectedCrop} — Price by Market</h3>
                    <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="glass-input text-sm py-1.5 px-3 w-auto">
                      {MAJOR_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                      <option value="Tomato">Tomato</option>
                      <option value="Onion">Onion</option>
                      <option value="Potato">Potato</option>
                      <option value="Wheat">Wheat</option>
                    </select>
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
    </PageWrapper>
  );
}
