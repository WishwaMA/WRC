// app/admin/login/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // තාවකාලිකව ආරක්ෂිත පරිපාලක පිවිසුමක් (පසුව Firebase Auth හෝ env වෙත මාරු කළ හැක)
    if (username === 'admin' && password === 'wrc@2026') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid Username or Password!');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-yellow-400 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-900 rounded-full flex items-center justify-center text-yellow-400 mx-auto shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-emerald-950">WRC Admin Portal</h1>
          <p className="text-xs text-gray-500">Sign in to manage school web contents</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-900 text-yellow-400 font-bold py-3 rounded-lg hover:bg-emerald-950 transition shadow-md cursor-pointer"
          >
            Login to Dashboard
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-emerald-700 hover:underline">← Back to Main Website</a>
        </div>

      </div>
    </div>
  );
}