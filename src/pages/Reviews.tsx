import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ParticleBackground from '@/components/ParticleBackground';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockReviews = [
  {
    id: 1,
    name: 'Mike Thompson',
    handle: '@trader_mike',
    rating: 5,
    comment: 'Got paid within 24 hours. SuperFunded is the real deal. No BS, just straight payments.',
    verified: true,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    handle: '@forex_king',
    rating: 5,
    comment: 'Finally, a prop firm that actually pays. The transparency is unmatched.',
    verified: true,
  },
  {
    id: 3,
    name: 'Alex Rodriguez',
    handle: '@profit_hunter',
    rating: 5,
    comment: 'Been trading with them for 6 months. Every single payout has been on time. Highly recommend.',
    verified: true,
  },
];

export default function Reviews() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen pb-20">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
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
            Trader Reviews
          </h1>
          <p className="text-xl text-muted-foreground">
            Real feedback from real traders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-morph p-6 border-2 border-primary/20 hover:border-primary/40 transition-all h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-lg">{review.name}</h3>
                    <p className="text-sm text-muted-foreground">{review.handle}</p>
                  </div>
                  {review.verified && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  "{review.comment}"
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
