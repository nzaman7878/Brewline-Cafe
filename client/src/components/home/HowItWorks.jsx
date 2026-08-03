import { motion } from 'framer-motion';
import { Smartphone, SlidersHorizontal, PackageCheck } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Smartphone,
      title: '1. Browse & Order',
      desc: 'Explore our artisan menu and select your favorite roasts, teas, or fresh pastries right from your phone.'
    },
    {
      icon: SlidersHorizontal,
      title: '2. Customize',
      desc: 'Milk alternatives? Extra shot? Make it yours with our deep customization options.'
    },
    {
      icon: PackageCheck,
      title: '3. Grab & Go',
      desc: 'Track your order in real-time and pick it up exactly when it is hot and ready. No waiting.'
    }
  ];

  return (
    <section className="py-24 px-4 bg-surface border-y border-outline">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface mb-4">
            How It Works
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Your daily coffee run, reimagined for speed and quality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-outline z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full bg-background border-4 border-surface flex items-center justify-center text-primary shadow-xl shadow-primary/10 mb-6">
                <step.icon size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-3">{step.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
