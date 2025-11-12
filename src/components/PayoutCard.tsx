import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PayoutCardProps {
  traderName: string;
  amount: number;
  date: string;
  status: 'verified' | 'pending';
  proof?: string;
  delay?: number;
}

export default function PayoutCard({ 
  traderName, 
  amount, 
  date, 
  status, 
  proof,
  delay = 0 
}: PayoutCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: '0 0 40px rgba(155, 77, 255, 0.5)'
      }}
      className="group perspective-1000"
    >
      <Card className="glass-morph p-6 border-2 border-primary/20 hover:border-primary/50 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg text-foreground mb-1">{traderName}</h3>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          {status === 'verified' ? (
            <CheckCircle2 className="w-6 h-6 text-green-400 neon-glow" />
          ) : (
            <Clock className="w-6 h-6 text-yellow-400" />
          )}
        </div>
        
        <div className="mb-4">
          <p className="text-3xl font-mono font-bold text-primary text-glow">
            ${amount.toLocaleString()}
          </p>
        </div>

        {proof && (
          <div className="rounded-lg overflow-hidden border border-border">
            <img 
              src={proof} 
              alt="Payout proof" 
              className="w-full h-32 object-cover opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border/50">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            status === 'verified' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {status === 'verified' ? '✓ Verified' : '🕓 Pending'}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
