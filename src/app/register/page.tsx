'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Droplets } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    customer_type: 'residential' as 'residential' | 'commercial',
    company_name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/login?registered=true');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Droplets className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">AquaPure</span>
          </Link>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            {step === 1 ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                  <input className="input-field" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="input-field" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <PhoneInput
                    value={form.phone}
                    onChange={(phone) => updateForm('phone', phone)}
                    placeholder="3001234567"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" className="input-field" value={form.password} onChange={(e) => updateForm('password', e.target.value)} minLength={6} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Account Type</label>
                  <select className="input-field" value={form.customer_type} onChange={(e) => updateForm('customer_type', e.target.value)}>
                    <option value="residential">Home / Residential</option>
                    <option value="commercial">Business / Commercial</option>
                  </select>
                </div>
                {form.customer_type === 'commercial' && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Company Name</label>
                    <input className="input-field" value={form.company_name} onChange={(e) => updateForm('company_name', e.target.value)} />
                  </div>
                )}
                <button type="submit" className="btn-primary w-full">Next: Address Details</button>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                  <textarea className="input-field" rows={2} value={form.address} onChange={(e) => updateForm('address', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                    <input className="input-field" value={form.city} onChange={(e) => updateForm('city', e.target.value)} required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
                    <input className="input-field" value={form.state} onChange={(e) => updateForm('state', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Pincode</label>
                  <input className="input-field" value={form.pincode} onChange={(e) => updateForm('pincode', e.target.value)} placeholder="6-digit pincode" required />
                </div>
                <div className="flex gap-3">
                  <button type="button" className="btn-secondary flex-1" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
