import Link from 'next/link';
import { Droplets, Truck, Clock, Shield, Phone, Mail, MapPin } from 'lucide-react';

const features = [
  { icon: Droplets, title: 'Pure RO Water', desc: '7-stage purified water meeting WHO standards' },
  { icon: Truck, title: 'Daily Delivery', desc: 'Reliable doorstep delivery, rain or shine' },
  { icon: Clock, title: 'Flexible Plans', desc: 'Daily, alternate days, weekly or custom schedules' },
  { icon: Shield, title: 'Quality Assured', desc: 'Regular lab testing and sealed packaging' },
];

const plans = [
  { name: 'Home Essential', price: 40, unit: '20L Can', freq: 'Daily', popular: false },
  { name: 'Family Pack', price: 42, unit: '20L Can', freq: 'Alternate Days', popular: true },
  { name: 'Office Bulk', price: 35, unit: '20L Can', freq: 'Daily (5+ cans)', popular: false },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">AquaPure</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-600">Features</Link>
            <Link href="#plans" className="text-sm font-medium text-gray-600 hover:text-primary-600">Plans</Link>
            <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-primary-600">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm">Login</Link>
            <Link href="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-20 md:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Pure Water, <span className="text-primary-600">Delivered Daily</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Premium RO purified water delivered fresh to your doorstep every day.
            Subscribe to a plan that fits your home or business needs.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="btn-primary px-8 py-3 text-base">
              Start Your Subscription
            </Link>
            <Link href="#plans" className="btn-secondary px-8 py-3 text-base">
              View Plans
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-1">✓ Free Delivery</span>
            <span className="flex items-center gap-1">✓ No Commitment</span>
            <span className="flex items-center gap-1">✓ Pause Anytime</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">Why Choose AquaPure?</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-600">
            We ensure every drop of water meets the highest purity standards
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="card text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <f.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-600">
            Choose a plan that works for you. No hidden charges.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card relative text-center ${plan.popular ? 'border-primary-500 ring-2 ring-primary-500/20' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500">/{plan.unit}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.freq} delivery</p>
                <Link
                  href="/register"
                  className={`mt-6 w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Subscribe Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">Get In Touch</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="card flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <Phone className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Call Us</p>
                <p className="text-sm text-gray-500">+92 300 1234567</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <Mail className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">support@aquapure.com</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <MapPin className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Office</p>
                <p className="text-sm text-gray-500">Pune, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-semibold text-gray-700">AquaPure Delivery</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 AquaPure. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
