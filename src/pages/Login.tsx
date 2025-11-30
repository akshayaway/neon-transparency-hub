import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import ParticleBackground from '@/components/ParticleBackground';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || 'Failed to sign in');
      setIsLoading(false);
    } else {
      toast.success('Welcome back!');
      navigate('/');
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

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <ParticleBackground />
      
      {/* Nebula effect */}
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
              <LogIn className="w-16 h-16 text-primary mx-auto mb-4 neon-glow" />
            </motion.div>
            <h1 className="text-3xl font-heading uppercase text-glow mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your SuperFunded account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 neon-glow"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <p className="text-xs text-muted-foreground/60 text-center mt-6">
            By continuing you agree to receive account-related emails.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
