import { motion } from "framer-motion";

const quotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    text: "It's not about being the best. It's about being better than you were yesterday.",
    author: "Unknown"
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown"
  },
  {
    text: "The hard days are the best because that's when champions are made.",
    author: "Gabrielle Reece"
  },
  {
    text: "Don't wish for it. Work for it.",
    author: "Unknown"
  }
];

export function MotivationCard() {
  // Pick a random quote that changes daily
  const today = new Date().toDateString();
  const quoteIndex = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % quotes.length;
  const quote = quotes[quoteIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gradient-to-br from-orange-400 to-pink-600 rounded-2xl p-6 text-white"
    >
      <svg className="h-8 w-8 text-orange-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <blockquote className="text-xl font-medium">
        "{quote.text}"
      </blockquote>
      <p className="mt-2 text-orange-200">— {quote.author}</p>
    </motion.div>
  );
}