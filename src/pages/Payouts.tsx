import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PayoutCard from '@/components/PayoutCard';
import ParticleBackground from '@/components/ParticleBackground';
import { useNavigate } from 'react-router-dom';

// Mock data - will be replaced with Supabase data
const mockPayouts = [
  { id: 1, traderName: '@trader_mike', amount: 5420, date: 'Dec 10, 2025', status: 'verified' as const },
  { id: 2, traderName: '@forex_king', amount: 8750, date: 'Dec 9, 2025', status: 'verified' as const },
  { id: 3, traderName: '@profit_hunter', amount: 3200, date: 'Dec 8, 2025', status: 'pending' as const },
  { id: 4, traderName: '@crypto_wizard', amount: 12500, date: 'Dec 7, 2025', status: 'verified' as const },
  { id: 5, traderName: '@day_trader_99', amount: 4800, date: 'Dec 6, 2025', status: 'verified' as const },
  { id: 6, traderName: '@scalp_master', amount: 6300, date: 'Dec 5, 2025', status: 'verified' as const },
];

export default function Payouts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayouts = mockPayouts.filter(payout =>
    payout.traderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pb-20">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <h1 className="text-5xl md:text-6xl font-heading uppercase mb-4 text-glow">
            Payout Feed
          </h1>
          <p className="text-xl text-muted-foreground">
            Every payout. Every trader. Full transparency.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 glass-morph p-6 rounded-xl"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by trader name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20"
              />
            </div>
            <Button variant="outline" className="border-primary/50">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* Payout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayouts.map((payout, index) => (
            <PayoutCard
              key={payout.id}
              traderName={payout.traderName}
              amount={payout.amount}
              date={payout.date}
              status={payout.status}
              delay={index * 0.1}
            />
          ))}
        </div>

        {filteredPayouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-muted-foreground">No payouts found matching your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
