import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import ParticleBackground from '@/components/ParticleBackground';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Submit() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase submission
    setSubmitted(true);
    toast.success('Payout proof submitted! Awaiting verification.');
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 text-green-400 mx-auto animate-glow-pulse" />
          </div>
          <h2 className="text-4xl font-heading mb-4 text-glow">Submission Received!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Your payout proof has been submitted and is awaiting verification.
          </p>
          <Button onClick={() => navigate('/')} size="lg">
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
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
            Submit Proof
          </h1>
          <p className="text-xl text-muted-foreground">
            Show the world. Build trust. Get verified.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-morph p-8 border-2 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Trader Name / Handle
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="@your_handle"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-foreground">
                  Payout Amount ($)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="date" className="text-foreground">
                  Payout Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="proof" className="text-foreground">
                  Upload Proof (Screenshot)
                </Label>
                <div className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground/60 mt-2">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 neon-glow"
              >
                Submit Proof
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
