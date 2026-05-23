import { ENV } from '@/config/env';

export interface MandiPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

export const marketService = {
  /**
   * Fetch live mandi prices from Data.gov.in Agmarknet API
   */
  async getLivePrices(limit = 100, state?: string): Promise<MandiPrice[]> {
    const key = ENV.market.dataGovKey;
    if (!key) return [];
    
    try {
      let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${key}&format=json&limit=${limit}`;
      if (state) {
        url += `&filters[state.keyword]=${encodeURIComponent(state)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch market data');
      
      const data = await res.json();
      return data.records || [];
    } catch (error) {
      console.error('Market fetch error:', error);
      return [];
    }
  },

  /**
   * Filter and aggregate prices for a specific crop to show price trends
   * Note: The live API only gives the latest data snapshot usually, so we 
   * group by market to show spatial variance if historical data isn't deeply paged.
   */
  aggregateByCrop(records: MandiPrice[], cropName: string) {
    const filtered = records.filter((r) => r.commodity.toLowerCase().includes(cropName.toLowerCase()));
    
    // Sort by arrival_date (descending) or just map them for the chart
    // We will use the market name as the X-axis to show spatial variance for the current day
    return filtered.map(r => ({
      name: r.market.substring(0, 10), // truncate long market names
      price: parseInt(r.modal_price) || 0,
      state: r.state
    })).filter(r => r.price > 0);
  }
};
