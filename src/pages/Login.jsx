import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

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
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card shadow-minimal-hover border-transparent">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <Wallet className="text-primary" size={32} />
            </div>
          </div>

          <h1 className="text-2xl font-medium text-center text-zinc-900 mb-2">
            {isLogin ? 'Sign in' : 'Create your account'}
          </h1>
          <p className="text-zinc-600 text-center mb-8 text-sm">
            {isLogin ? 'Use your Udhaari Account' : 'Start tracking your spending today'}
          </p>

          {error && (
            <div className="bg-accent/10 border border-accent/20 text-accent text-sm p-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                required
                className="input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                type="password"
                required
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {isLogin ? "Create account" : "Sign in instead"}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <Loader2 className="animate-spin text-white" size={20} />
                ) : (
                  isLogin ? 'Next' : 'Next'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
