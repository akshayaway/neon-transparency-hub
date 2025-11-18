import { motion } from 'framer-motion';
import { ArrowDown, Coins, Search, MessageSquare, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero3DLogo from '@/components/Hero3DLogo';
import AnimatedCounter from '@/components/AnimatedCounter';
import ParticleBackground from '@/components/ParticleBackground';
import FeatureCard from '@/components/FeatureCard';
import PayoutCard from '@/components/PayoutCard';
import FloatingS from '@/components/FloatingS';
import StarField from '@/components/StarField';
import CursorTrail from '@/components/CursorTrail';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Background layers */}
      <StarField />
      <ParticleBackground />
      <CursorTrail />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Gradient background layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Radial gradient haze (farthest layer) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(155,77,255,0.15), transparent 60%)',
          }}
        />
        
        {/* Floating S behind text */}
        <div className="absolute inset-0 z-0">
          <FloatingS />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 text-center mb-8"
        >
          <Hero3DLogo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading uppercase mb-4 sm:mb-6 text-glow leading-tight"
          >
            Transparency. Trust. Traders First.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 sm:mb-4"
          >
            Where prop trading meets real proof.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
            className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-12 px-4"
          >
            SuperFunded is redefining trust in the prop firm industry — with real payouts, 
            verified traders, and full transparency.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4"
          >
            <Button 
              size="lg" 
              className="relative bg-primary hover:bg-primary/90 text-primary-foreground group text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(155,77,255,0.6)]"
              onClick={() => navigate('/payouts')}
              style={{
                boxShadow: '0 0 20px rgba(155, 77, 255, 0.4)',
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
              />
              <span className="relative z-10 flex items-center">
                <DollarSign className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
                View Real Payouts
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="relative border-2 border-primary/60 hover:border-primary hover:bg-primary/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(155,77,255,0.4)]"
              onClick={() => navigate('/submit')}
            >
              Submit Your Proof
            </Button>
          </motion.div>

          {/* Stats Counters */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 px-4"
          >
            <motion.div 
              className="space-y-2 flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full flex justify-center overflow-hidden">
                <motion.div
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(155, 77, 255, 0.6)',
                      '0 0 30px rgba(155, 77, 255, 0.8)',
                      '0 0 20px rgba(155, 77, 255, 0.6)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <AnimatedCounter end={12000000} prefix="$" suffix="+" />
                </motion.div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide text-center">Paid to Traders</p>
            </motion.div>
            <motion.div 
              className="space-y-2 flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full flex justify-center overflow-hidden">
                <motion.div
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(155, 77, 255, 0.6)',
                      '0 0 30px rgba(155, 77, 255, 0.8)',
                      '0 0 20px rgba(155, 77, 255, 0.6)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                >
                  <AnimatedCounter end={3000} suffix="+" />
                </motion.div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide text-center">Funded Accounts</p>
            </motion.div>
            <motion.div 
              className="space-y-2 flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full flex justify-center overflow-hidden">
                <motion.div
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(155, 77, 255, 0.6)',
                      '0 0 30px rgba(155, 77, 255, 0.8)',
                      '0 0 20px rgba(155, 77, 255, 0.6)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                >
                  <AnimatedCounter end={100} suffix="%" />
                </motion.div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide text-center">Transparent Payouts</p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 z-10"
        >
          <ArrowDown className="w-8 h-8 text-primary animate-glow-pulse" />
          <p className="text-sm text-muted-foreground mt-2">Scroll to explore</p>
        </motion.div>
      </section>

      {/* Why Transparency Matters */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase mb-4 text-glow">
              Why Transparency Matters
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">
              Trust isn't given. It's earned. Here's how we do it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={Coins}
              title="Weekly Payouts"
              description="We pay every week. Fast. Real. Reliable. No delays, no excuses."
              delay={0}
            />
            <FeatureCard
              icon={Search}
              title="Verified Proofs"
              description="All payouts are verified and visible. Every transaction, every trader."
              delay={0.2}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Real Reviews"
              description="See real traders talk about their experience. Unfiltered, authentic feedback."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Live Payout Feed Preview */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase mb-4 text-glow">
              Live Payout Feed
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">
              Real traders. Real money. Real proof.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            <PayoutCard
              traderName="@trader_mike"
              amount={5420}
              date="Dec 10, 2025"
              status="verified"
              delay={0}
            />
            <PayoutCard
              traderName="@forex_king"
              amount={8750}
              date="Dec 9, 2025"
              status="verified"
              delay={0.2}
            />
            <PayoutCard
              traderName="@profit_hunter"
              amount={3200}
              date="Dec 8, 2025"
              status="pending"
              delay={0.4}
            />
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary hover:bg-primary/10 group"
              onClick={() => navigate('/payouts')}
            >
              View All Payouts
              <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Transparency Dashboard Preview */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading uppercase mb-4 text-glow">
              Real-Time Transparency
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">
              Live stats. No smoke. No mirrors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-morph p-6 sm:p-8 text-center border-2 border-primary/20 rounded-xl"
            >
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
              <div className="overflow-hidden flex justify-center">
                <AnimatedCounter end={847} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase">Active Traders</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-morph p-6 sm:p-8 text-center border-2 border-primary/20 rounded-xl"
            >
              <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
              <div className="overflow-hidden flex justify-center">
                <AnimatedCounter end={2100000} prefix="$" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase">This Month</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-morph p-6 sm:p-8 text-center border-2 border-primary/20 rounded-xl"
            >
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
              <div className="overflow-hidden flex justify-center">
                <AnimatedCounter end={24} suffix=" hrs" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase">Avg Processing</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-morph p-6 sm:p-8 text-center border-2 border-primary/20 rounded-xl"
            >
              <Coins className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
              <div className="overflow-hidden flex justify-center">
                <AnimatedCounter end={156} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase">Payouts This Week</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 sm:py-12 px-4 border-t border-primary/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-heading text-primary mb-2">SuperFunded</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Transparency Pays.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
            <a href="#" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Telegram</a>
            <a href="#" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Discord</a>
            <a href="https://superfunded.com" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">superfunded.com</a>
          </div>

          <p className="text-sm text-muted-foreground/60">
            © 2025 SuperFunded. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
