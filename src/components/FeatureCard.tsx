import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.03 }}
    >
      <Card className="glass-morph p-8 h-full border-2 border-primary/10 hover:border-primary/30 transition-all group">
        <div className="mb-6 relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors neon-glow">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent animate-pulse" />
        </div>
        
        <h3 className="font-heading text-xl mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  );
}
