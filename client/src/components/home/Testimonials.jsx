import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Daily Commuter",
      text: "The order ahead feature saves me 15 minutes every morning. And the pour-over? Absolutely flawless.",
      rating: 5
    },
    {
      name: "Marcus T.",
      role: "Local Artist",
      text: "Brewline's atmosphere is unmatched, but getting their signature cold brew ready exactly when I walk in the door is magic.",
      rating: 5
    },
    {
      name: "Elena R.",
      role: "Coffee Enthusiast",
      text: "I've tried every cafe in the city. The single-origin Ethiopian roast here is the best I've ever had. Period.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface mb-4">
            Don't Just Take Our Word
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            See what our community of coffee lovers has to say.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-surface p-8 rounded-card border border-outline relative"
            >
              <Quote size={40} className="absolute top-6 right-6 text-outline opacity-50" />
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={18} className="text-primary fill-primary" />
                ))}
              </div>
              <p className="text-on-surface-variant italic mb-8 relative z-10">
                "{review.text}"
              </p>
              <div>
                <p className="font-bold text-on-surface">{review.name}</p>
                <p className="text-xs text-primary uppercase tracking-wider mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
