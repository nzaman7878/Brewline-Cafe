import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';

export const LocationHours = () => {
  return (
    <section className="py-24 px-4 bg-surface border-t border-outline">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Image Placeholder (Map or Storefront) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-video md:aspect-square bg-surface-variant rounded-card overflow-hidden border border-outline relative"
          >
            {/* If we had a map image, it would go here. We'll use a stylized div for now */}
            <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
              <MapPin size={64} className="text-primary opacity-50" />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface mb-2">
                Visit Us
              </h2>
              <p className="text-on-surface-variant">The best coffee in town, right around the corner.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Address</h4>
                  <p className="text-on-surface-variant text-sm mt-1">123 Artisan Ave<br />Coffee District, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Hours</h4>
                  <p className="text-on-surface-variant text-sm mt-1">Mon - Fri: 6:30 AM - 7:00 PM<br />Sat - Sun: 8:00 AM - 5:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Contact</h4>
                  <p className="text-on-surface-variant text-sm mt-1">(555) 123-4567<br />hello@brewlinecafe.com</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
