// src/pages/Offer.tsx
// Customize this with your actual offer content

export default function Offer() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <a href="/" className="text-amber-400 text-sm hover:underline">
          ← Back to sassolutions.ai
        </a>

        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-amber-400">
            Special Offer
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            {/* Replace with your offer description */}
            Elevate your business with our AI-powered automation solutions.
            Limited time Ramadan offer available now.
          </p>
        </header>

        {/* Offer Details — customize this section */}
        <div className="p-8 rounded-xl bg-white/5 border border-amber-500/20 space-y-6">
          <h2 className="text-2xl font-semibold text-amber-300">What You Get</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-1">✓</span>
              <span>Custom AI workflow automation setup</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-1">✓</span>
              <span>Integration with your existing tools</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 mt-1">✓</span>
              <span>30-day support and optimization</span>
            </li>
          </ul>

          <a
            href="https://calendly.com/YOUR_LINK" // Replace with your booking link
            className="inline-block mt-4 px-8 py-3 bg-amber-500 text-gray-950 font-bold rounded-lg
                       hover:bg-amber-400 transition-colors"
          >
            Book a Free Consultation →
          </a>
        </div>

        <p className="text-center text-sm text-gray-500">
          Questions? Reach out at{" "}
          <a href="mailto:contact@sassolutions.ai" className="text-amber-400 hover:underline">
            contact@sassolutions.ai
          </a>
        </p>
      </div>
    </div>
  );
}
