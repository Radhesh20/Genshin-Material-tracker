import React from 'react';
import { Heart, Star } from 'lucide-react';

const Footer: React.FC = () => {
  const quotes = [
    "Adventure awaits those who dare to explore.",
    "Every journey begins with a single step.",
    "Collect memories, not just materials.",
    "The stars guide us to our destiny."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <footer className="relative mt-16 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-8">
        {/* Quote Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <p className="text-lg italic text-gray-300 font-light">
              "{randomQuote}"
            </p>
            <Star className="w-4 h-4 text-yellow-400 ml-2" />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span className="text-gray-400">by</span>
            <span className="font-semibold text-cyan-300">Radhesh</span>
          </div>

          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Genshin Material Tracker. All rights reserved.
          </div>

          <div className="text-gray-500 text-sm">
            Track your adventure progress
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-60"
              style={{
                animationDelay: `${i * 0.2}s`,
                animation: 'pulse 2s infinite'
              }}
            ></div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;