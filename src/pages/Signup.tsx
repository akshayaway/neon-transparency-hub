import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ParticleBackground from '@/components/ParticleBackground';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  useEffect(() => {
    if (user && !loading && !showVerificationMessage) {
      navigate('/');
    }
  }, [user, loading, navigate, showVerificationMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, displayName);

    if (error) {
      toast.error(error.message || 'Failed to sign up');
      setIsLoading(false);
    } else {
      setShowVerificationMessage(true);
      toast.success('Account created! Check your email for verification.');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <ParticleBackground />
        <div className="text-2xl text-primary animate-pulse">Loading...</div>
      </div>
    );
  }

  if (showVerificationMessage) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <ParticleBackground />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="glass-morph p-8 border-2 border-primary/20 text-center">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-heading uppercase text-glow mb-4">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a verification link to <span className="text-primary">{email}</span>.
              Click the link to verify your account and start submitting payout proofs.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Once verified, you can submit your payout proofs for review.
              </p>
            </div>
            <Button onClick={() => navigate('/login')} size="lg" className="w-full">
              Go to Login
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <ParticleBackground />
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(155,77,255,0.15), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-morph p-8 border-2 border-primary/20">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <UserPlus className="w-16 h-16 text-primary mx-auto mb-4 neon-glow" />
            </motion.div>
            <h1 className="text-3xl font-heading uppercase text-glow mb-2">Join SuperFunded</h1>
            <p className="text-muted-foreground">Create your account to start submitting proofs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="displayName" className="flex items-center text-foreground mb-2">
                <User className="w-4 h-4 mr-2 text-primary" />
                Display Name
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="@your_handle"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center text-foreground mb-2">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="trader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center text-foreground mb-2">
                <Lock className="w-4 h-4 mr-2 text-primary" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I confirm I am a real trader and agree to the terms and conditions
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 neon-glow"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
