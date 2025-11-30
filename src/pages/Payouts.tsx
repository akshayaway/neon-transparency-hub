import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PayoutCard from '@/components/PayoutCard';
import ParticleBackground from '@/components/ParticleBackground';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Payout {
  id: string;
  trader_name: string;
  amount: number;
  date: string;
  status: string;
  proof_url: string | null;
}

export default function Payouts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedPayouts();
  }, []);

  const fetchApprovedPayouts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('status', 'approved')
      .order('verified_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch payouts');
      console.error(error);
    } else {
      setPayouts(data || []);
    }
    setLoading(false);
  };

  const filteredPayouts = payouts.filter(payout =>
    payout.trader_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProofUrl = (proofUrl: string | null) => {
    if (!proofUrl) return undefined;
    const { data } = supabase.storage.from('proofs').getPublicUrl(proofUrl);
    return data.publicUrl;
  };

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
        {loading ? (
          <div className="text-center py-20">
            <div className="text-2xl text-primary animate-pulse">Loading payouts...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPayouts.map((payout, index) => (
                <PayoutCard
                  key={payout.id}
                  traderName={payout.trader_name}
                  amount={payout.amount}
                  date={new Date(payout.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                  status="verified"
                  proof={getProofUrl(payout.proof_url)}
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
                <p className="text-xl text-muted-foreground">
                  {searchTerm ? 'No payouts found matching your search.' : 'No approved payouts yet.'}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
