import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ParticleBackground from './ParticleBackground';

interface ProtectedRouteProps {
  children: ReactNode;
  requireVerified?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireVerified = false,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (requireAdmin && !isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, requireAdmin, navigate]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <ParticleBackground />
        <div className="text-2xl text-primary animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  // If verification is required and user is not verified, show warning
  if (requireVerified && profile && !profile.is_verified) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <ParticleBackground />
        <div className="relative z-10 text-center max-w-md">
          <div className="glass-morph p-8 border-2 border-primary/20 rounded-lg">
            <h2 className="text-2xl font-heading uppercase text-glow mb-4">Email Verification Required</h2>
            <p className="text-muted-foreground mb-6">
              Please verify your email address to submit payout proofs. Check your inbox for the verification link.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="text-primary hover:underline"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
