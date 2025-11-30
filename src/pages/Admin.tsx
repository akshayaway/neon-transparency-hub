import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ParticleBackground from '@/components/ParticleBackground';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  ArrowLeft
} from 'lucide-react';

interface Payout {
  id: string;
  trader_name: string;
  twitter_handle: string | null;
  amount: number;
  currency: string;
  date: string;
  proof_url: string | null;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    email: string;
    display_name: string | null;
  };
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [viewProofModal, setViewProofModal] = useState(false);
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalAmount: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchPendingPayouts();
    fetchStats();
  }, [isAdmin, navigate]);

  const fetchPendingPayouts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payouts')
      .select(`
        *,
        profiles!payouts_user_id_fkey (email, display_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch pending payouts');
      console.error(error);
    } else {
      setPendingPayouts(data as any || []);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const [pendingRes, approvedRes] = await Promise.all([
      supabase.from('payouts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('payouts').select('amount').eq('status', 'approved')
    ]);

    setStats({
      totalPending: pendingRes.count || 0,
      totalApproved: approvedRes.data?.length || 0,
      totalAmount: approvedRes.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
    });
  };

  const handleApprove = async () => {
    if (!selectedPayout || !user) return;
    
    setActionLoading(true);
    const { error } = await supabase
      .from('payouts')
      .update({
        status: 'approved',
        admin_id: user.id,
        admin_notes: adminNotes || null,
        verified_at: new Date().toISOString()
      })
      .eq('id', selectedPayout.id);

    if (error) {
      toast.error('Failed to approve payout');
      console.error(error);
    } else {
      toast.success('Payout approved successfully');
      fetchPendingPayouts();
      fetchStats();
      setActionModal(null);
      setSelectedPayout(null);
      setAdminNotes('');
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedPayout || !user) return;
    
    if (!adminNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    const { error } = await supabase
      .from('payouts')
      .update({
        status: 'rejected',
        admin_id: user.id,
        admin_notes: adminNotes
      })
      .eq('id', selectedPayout.id);

    if (error) {
      toast.error('Failed to reject payout');
      console.error(error);
    } else {
      toast.success('Payout rejected');
      fetchPendingPayouts();
      fetchStats();
      setActionModal(null);
      setSelectedPayout(null);
      setAdminNotes('');
    }
    setActionLoading(false);
  };

  const getProofUrl = (proofUrl: string | null) => {
    if (!proofUrl) return null;
    const { data } = supabase.storage.from('proofs').getPublicUrl(proofUrl);
    return data.publicUrl;
  };

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
            Admin Panel
          </h1>
          <p className="text-xl text-muted-foreground">
            Review and verify payout submissions
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-morph p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                  <p className="text-3xl font-heading text-primary">{stats.totalPending}</p>
                </div>
                <Clock className="w-10 h-10 text-primary/50" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-morph p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-3xl font-heading text-green-400">{stats.totalApproved}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400/50" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-morph p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Approved</p>
                  <p className="text-3xl font-heading text-primary">
                    ${stats.totalAmount.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-primary/50" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Pending Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-heading uppercase mb-6 text-glow">
            Pending Submissions
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-primary animate-pulse">Loading...</div>
            </div>
          ) : pendingPayouts.length === 0 ? (
            <Card className="glass-morph p-12 text-center border-2 border-primary/20">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">All caught up! No pending submissions.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingPayouts.map((payout, index) => (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-morph p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-heading text-primary">
                            {payout.trader_name}
                          </h3>
                          {payout.twitter_handle && (
                            <span className="text-sm text-muted-foreground">
                              {payout.twitter_handle}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {payout.amount.toLocaleString()} {payout.currency}
                          </span>
                          <span>Date: {new Date(payout.date).toLocaleDateString()}</span>
                          <span>Submitted: {new Date(payout.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          By: {payout.profiles?.display_name || payout.profiles?.email}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPayout(payout);
                            setViewProofModal(true);
                          }}
                          className="border-primary/50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Proof
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPayout(payout);
                            setActionModal('approve');
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPayout(payout);
                            setActionModal('reject');
                          }}
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* View Proof Modal */}
      <Dialog open={viewProofModal} onOpenChange={setViewProofModal}>
        <DialogContent className="max-w-4xl glass-morph border-2 border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-glow">Payout Proof</DialogTitle>
            <DialogDescription>
              {selectedPayout?.trader_name} - ${selectedPayout?.amount.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedPayout?.proof_url ? (
              <img
                src={getProofUrl(selectedPayout.proof_url) || ''}
                alt="Payout proof"
                className="w-full rounded-lg border-2 border-primary/20"
              />
            ) : (
              <p className="text-muted-foreground text-center py-12">No proof uploaded</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={actionModal === 'approve'} onOpenChange={(open) => !open && setActionModal(null)}>
        <DialogContent className="glass-morph border-2 border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-glow">Approve Payout</DialogTitle>
            <DialogDescription>
              Approve this payout and make it public on the Transparency Feed?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">Optional Admin Note</p>
              <Textarea
                placeholder="Add any notes about this approval..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="bg-background/50 border-primary/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionModal(null);
                setAdminNotes('');
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? 'Approving...' : 'Approve Payout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={actionModal === 'reject'} onOpenChange={(open) => !open && setActionModal(null)}>
        <DialogContent className="glass-morph border-2 border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-glow">Reject Payout</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payout.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2 text-destructive">Rejection Reason (Required)</p>
              <Textarea
                placeholder="Explain why this payout is being rejected..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="bg-background/50 border-destructive/50"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionModal(null);
                setAdminNotes('');
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading}
              variant="destructive"
            >
              {actionLoading ? 'Rejecting...' : 'Reject Payout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
