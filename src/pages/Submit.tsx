import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import ParticleBackground from '@/components/ParticleBackground';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Submit() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: profile?.display_name || '',
    twitter: profile?.twitter_handle || '',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload a proof screenshot');
      return;
    }

    setIsLoading(true);

    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Create payout record
      const { error: insertError } = await supabase
        .from('payouts')
        .insert({
          user_id: user.id,
          trader_name: formData.name,
          twitter_handle: formData.twitter || null,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          date: formData.date,
          proof_url: fileName,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      toast.success('Payout proof submitted! Awaiting verification.');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit payout proof');
    } finally {
      setIsLoading(false);
    }
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
    <ProtectedRoute>
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
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-foreground">
                  Twitter Handle (Optional)
                </Label>
                <Input
                  id="twitter"
                  type="text"
                  placeholder="@your_twitter"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-foreground">
                    Payout Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="5000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-foreground">
                    Currency
                  </Label>
                  <Input
                    id="currency"
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                    required
                    disabled={isLoading}
                  />
                </div>
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
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="proof" className="text-foreground">
                  Upload Proof (Screenshot)
                </Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg border border-primary/20"
                      />
                      <p className="text-sm text-muted-foreground mt-4">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground/60 mt-2">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 neon-glow"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Proof'}
              </Button>
            </form>
          </Card>
        </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
