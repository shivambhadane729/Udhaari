import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Landing = () => {
  const { user, login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-body">
      {/* Structural Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] -mr-64 -mt-64" />
      
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-surface-container/30">
        <div className="max-w-[1440px] mx-auto px-8 h-20 flex justify-between items-center text-monolith uppercase tracking-widest text-sm">
          <div className="flex items-center gap-2">
             <span className="material-symbols-outlined text-secondary text-3xl">account_balance_wallet</span>
             <span className="font-bold text-xl tracking-tighter text-primary">UDHAARI</span>
          </div>
          <div className="hidden md:flex items-center gap-12 text-[#8B9290]">
            <a href="#features" className="hover:text-primary transition-colors">Ecosystem</a>
            <button onClick={() => setIsLogin(true)} className="hover:text-primary transition-colors">Sign In</button>
            <button 
              onClick={() => setIsLogin(false)}
              className="bg-secondary text-white px-8 py-3 rounded-xl hover:bg-secondary-dark transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-40 max-w-[1440px] mx-auto px-8 pb-32">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Hero Column */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col pt-12"
          >
            <motion.span variants={itemVariants} className="inline-block text-secondary tracking-[0.3em] text-[10px] font-bold mb-8 uppercase">
              Financial Precision
            </motion.span>
            
            <motion.h1 variants={itemVariants} className="text-monolith text-6xl md:text-8xl mb-10 text-primary">
              Modular split <br/>
              <span className="text-secondary">for modern life.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-[#8B9290] text-xl max-w-xl leading-relaxed mb-12">
              We distill complexity into clarity. Udhaari organizes your shared expenses as modular pillars, supporting your financial architecture with precision.
            </motion.p>
            
            {/* Signature Reveal Section */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-10 mt-12 bg-slate-50 p-10 border border-slate-100 rounded-3xl">
              <div className="space-y-4">
                <span className="text-secondary font-headline text-2xl font-bold">01</span>
                <h4 className="font-bold text-lg text-primary">Intentional Sync</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Cross-device verification ensuring every settlement is mathematically perfect and instant.</p>
              </div>
              <div className="space-y-4">
                <span className="text-secondary font-headline text-2xl font-bold">02</span>
                <h4 className="font-bold text-lg text-primary">Silent Authority</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">No clutter. No friction. Just the pure architecture of your spending, visualized in real-time.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Auth Column */}
          <div className="lg:col-span-5 pt-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card shadow-2xl relative z-10 p-10 bg-white"
            >
              <div className="mb-12 text-center lg:text-left">
                <h2 className="text-3xl text-monolith mb-2 text-primary">
                  {isLogin ? 'AUTHENTICATE' : 'ESTABLISH'}
                </h2>
                <p className="text-slate-500 text-sm tracking-tight capitalize font-bold uppercase">
                  {isLogin ? 'Enter credentials to access ecosystem' : 'Begin your financial architecture'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-4 mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">info</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#8B9290] mb-2 font-headline">IDENTITY / EMAIL</label>
                  <input
                    type="email"
                    required
                    className="input"
                    placeholder="entity@udhaari.tech"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#8B9290] mb-2 font-headline">SECURE TOKEN / PASSWORD</label>
                  <input
                    type="password"
                    required
                    className="input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary h-14 text-sm font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        {isLogin ? 'Log In' : 'Create Identity'}
                        <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="px-4 bg-white text-[#8B9290] font-bold tracking-widest">ECOSYSTEM ACCESS</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full btn-secondary h-14 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest border-slate-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.15C1.43 8.55 1 10.22 1 12s.43 3.45 1.15 4.93l3.69-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.15 7.07l3.69 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign In with Google
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-slate-50 text-center text-[10px] tracking-widest font-bold text-[#8B9290]">
                {isLogin ? "NEW TO THE ECOSYSTEM? " : "ALREADY ESTABLISHED? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  {isLogin ? "INITIALIZE NOW" : "AUTHENTICATE"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Grid (Asymmetric) */}
        <section className="mt-40 grid md:grid-cols-12 gap-8" id="features">
          <div className="md:col-span-8 group cursor-pointer">
            <div className="metric-card h-full p-16 hover:bg-slate-50 transition-all duration-700 shadow-sm">
               <span className="material-symbols-outlined text-secondary text-5xl mb-12">architecture</span>
               <h3 className="text-monolith text-4xl mb-6 text-primary">Group Monoliths</h3>
               <p className="text-slate-500 text-lg max-w-md leading-relaxed font-medium">
                  Defining the core DNA of your group expenses. We navigate the intersection of shared costs and creative life to manage every split with silent authority.
               </p>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="metric-card h-full p-12 flex flex-col justify-between bg-primary text-white hover:bg-primary-dark border-none rounded-3xl shadow-xl">
               <div>
                  <span className="material-symbols-outlined text-5xl mb-10 text-secondary">insights</span>
                  <h3 className="text-monolith text-3xl mb-4 text-white">Precision Analytics</h3>
                  <p className="opacity-80 leading-relaxed font-medium font-headline uppercase text-[10px] tracking-widest">
                    Every transaction is distilled into pure insights. Visualize your spending patterns through a minimalist lens.
                  </p>
               </div>
               <div className="mt-12 flex items-center font-bold tracking-[0.3em] text-[10px] uppercase">
                  Discover System <span className="material-symbols-outlined ml-2 text-sm">trending_flat</span>
               </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="metric-card h-full p-12 border-slate-100 rounded-3xl shadow-sm">
               <span className="material-symbol-outlined text-secondary text-4xl mb-10">lock</span>
               <h3 className="text-monolith text-2xl mb-4 text-primary uppercase tracking-widest">Encrypted Trust</h3>
               <p className="text-slate-500 text-xs leading-relaxed mb-8 uppercase font-bold tracking-tight">
                  User data that feels like a curated gallery walk. Intuitive, frictionless, and deeply respectful of your privacy.
               </p>
               <div className="space-y-4 pt-4">
                  <div className="h-[1px] bg-slate-100 w-full" />
                  <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-400">
                     <span>ENCRYPTION</span>
                     <span className="text-primary">AES-256</span>
                  </div>
               </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="metric-card h-full p-16 bg-slate-50 text-primary border-slate-100 group overflow-hidden relative rounded-3xl shadow-sm">
               <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-all duration-700 group-hover:scale-150" />
               <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="material-symbols-outlined text-secondary text-5xl mb-12">hub</span>
                    <h3 className="text-monolith text-5xl mb-6 leading-tight uppercase">Universal Settlement</h3>
                    <p className="text-slate-500 text-lg leading-relaxed mb-10 font-bold uppercase tracking-tight">The ultimate feature. Any debt, any currency, liquidated through our modular settling engine.</p>
                    <button className="border border-secondary/20 px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary hover:text-white transition-all rounded-xl">
                       Learn Protocol
                    </button>
                  </div>
                  <div className="relative opacity-20 group-hover:opacity-40 transition-opacity">
                     <span className="material-symbols-outlined text-secondary text-[12rem] float-right">deployed_code</span>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-100 py-20 px-8 text-center bg-white text-on-surface">
         <div className="text-monolith text-xl tracking-tighter mb-8 bg-zinc-400">UDHAARI / MONOLITH</div>
         <p className="text-[#8B9290] text-xs font-bold tracking-widest uppercase mb-12">© 2024 Silent Authority Ecosystem. All rights reserved.</p>
         <div className="flex justify-center gap-12 text-[#8B9290]">
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">public</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">fingerprint</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">language</span>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
