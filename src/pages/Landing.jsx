import { Link } from 'react-router-dom'
import { useState } from 'react'
import DarkModeToggle from '../components/DarkModeToggle'
import { supabase } from '../lib/supabase'

const FEATURES = [
  { icon: '🧠', title: 'AI pet advisor', desc: 'Ask anything about your pet. Gets smarter the more you track.', bg: 'bg-violet-50 dark:bg-violet-900/30' },
  { icon: '📊', title: 'Health tracking', desc: 'Log meals, weight, and vet visits with full history and trends.', bg: 'bg-teal-50 dark:bg-teal-900/30' },
  { icon: '🔔', title: 'Smart reminders', desc: 'Never miss feeding time, medications, or vet appointments.', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  { icon: '🐾', title: 'Multi-pet support', desc: 'Manage all your pets from a single account.', bg: 'bg-pink-50 dark:bg-pink-900/30' },
]

const STEPS = [
  { step: '1', title: 'Add your pet', desc: "Name, breed, age — done in 30 seconds" },
  { step: '2', title: 'Track their health', desc: 'Log meals, weight, and vet visits daily' },
  { step: '3', title: 'Ask AI anything', desc: "Get advice based on your pet's real data" },
]

const TESTIMONIALS = [
  { name: 'Sarah K.', pet: 'Dog mom', text: "Finally an app that actually understands my dog's needs. The AI advice is surprisingly accurate!" },
  { name: 'Ahmed R.', pet: 'Cat parent', text: "Tracking my cat's weight and vet visits has never been easier. Love the reminders." },
  { name: 'Priya M.', pet: 'Rabbit owner', text: "Didn't expect to find an app that supports rabbits too. PawPal covers everything." },
]

export default function Landing() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleWaitlist = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('waitlist').insert({ email })
    if (error && error.code === '23505') {
      setSubmitted(true)
      return
    }
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">PawPal</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">Features</a>
          <a href="#how" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">Log in</Link>
          <DarkModeToggle />
          <Link to="/signup" className="bg-violet-600 text-white text-sm px-3 sm:px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center max-w-3xl mx-auto">
        <div className="inline-block bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          AI-powered pet care
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
          Your pet's health,<br />tracked and understood
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
          Log meals, track weight, schedule vet visits — then ask our AI anything about your pet's wellbeing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link to="/signup" className="bg-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors">
            Start for free
          </Link>
          <a href="#how" className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            See how it works
          </a>
        </div>

        {/* App preview */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 max-w-md mx-auto text-left shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xl">🐶</div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Bruno</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Golden Retriever · 3 yrs · 14kg</p>
            </div>
            <div className="ml-auto bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">
              Healthy
            </div>
          </div>
          <div className="bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 mb-2 max-w-xs">
            Is Bruno's diet balanced based on his recent meals?
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs ml-auto leading-relaxed">
            Bruno's protein intake looks great! I'd suggest adding more omega-3 rich foods given his age. His weight trend is stable — keep it up! 🐾
          </div>
        </div>
      </section>

      {/* Social proof */}
      <div className="bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-4 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Trusted by <span className="text-gray-700 dark:text-gray-300 font-medium">500+ pet owners</span> across 20+ countries
        </p>
      </div>

      {/* Features */}
      <section id="features" className="px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">Features</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Everything your pet needs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-sm dark:hover:bg-gray-900 transition-all">
              <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">How it works</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Up and running in 3 steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center text-lg font-semibold mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pet owners love it</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl p-5">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center text-xs font-semibold text-violet-700 dark:text-violet-300">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">Pricing</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Simple, transparent pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto">
            {/* Free */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-left">
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-2">Free</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">$0</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">forever</p>
              <ul className="flex flex-col gap-3 mb-6 text-sm">
                {['Up to 2 pets', 'Health tracking', 'Basic reminders'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-green-500">✓</span> {item}
                  </li>
                ))}
                {['AI chat'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-gray-300 dark:text-gray-600">
                    <span>✕</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block text-center border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-violet-600 rounded-2xl p-6 text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                Most popular
              </div>
              <p className="text-sm font-medium text-violet-300 mb-2">Pro</p>
              <p className="text-4xl font-bold text-white mb-1">$7</p>
              <p className="text-sm text-violet-300 mb-6">per month</p>
              <ul className="flex flex-col gap-3 mb-6 text-sm">
                {['Unlimited pets', 'Health tracking', 'Smart reminders', 'Unlimited AI chat'].map(item => (
                  <li key="item" className="flex items-center gap-2 text-violet-100">
                    <span className="text-green-300">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block text-center bg-white text-violet-700 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-50 transition-colors">
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-violet-600 dark:bg-violet-700 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Your pet deserves better care</h2>
        <p className="text-violet-200 mb-8 max-w-md mx-auto">
          Join thousands of pet owners who track, understand, and improve their pet's health with PawPal.
        </p>
        {submitted ? (
          <p className="text-white font-medium">You're on the list! We'll be in touch 🐾</p>
        ) : (
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <input
              type="email" placeholder="Enter your email" value={email}
              onChange={e => setEmail(e.target.value)} required
              className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white bg-white"
            />
            <button type="submit"
              className="bg-white text-violet-700 px-5 py-3 rounded-xl text-sm font-medium hover:bg-violet-50 transition-colors whitespace-nowrap">
              Join waitlist
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-8 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-600">© 2025 PawPal. Built with ❤️ for pet lovers.</p>
      </footer>

    </div>
  )
}