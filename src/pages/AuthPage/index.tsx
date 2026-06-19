import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/config/firebase';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validators';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Eye, EyeOff, Sprout, Cloud, Sun, X, KeyRound } from 'lucide-react';

export default function AuthPage() {
  const { mode } = useParams<{ mode: string }>();
  const isLogin = mode !== 'register';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const handleGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !db) {
      toast.error('Firebase not configured. Add your API keys to .env file.');
      return;
    }
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName: result.user.displayName || '',
        email: result.user.email || '',
        phone: result.user.phoneNumber || '',
        photoURL: result.user.photoURL || '',
        role: 'farmer',
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now(),
        language: 'en',
        onboardingComplete: false,
      }, { merge: true });
      toast.success('Welcome to Krishi Mitra!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (data: LoginInput) => {
    if (!isFirebaseConfigured || !auth) { toast.error('Firebase not configured.'); return; }
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterInput) => {
    if (!isFirebaseConfigured || !auth || !db) { toast.error('Firebase not configured.'); return; }
    try {
      setIsLoading(true);
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName: data.name,
        email: data.email,
        phone: '',
        photoURL: '',
        role: 'farmer',
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now(),
        language: 'en',
        onboardingComplete: false,
      });
      toast.success('Account created! Welcome to Krishi Mitra!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !auth) {
      toast.error('Firebase not configured.');
      return;
    }
    if (!forgotEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    try {
      setForgotLoading(true);
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      toast.success('Reset link sent! Check your inbox — and your Spam/Junk folder too.', { duration: 6000 });
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setForgotLoading(false);
    }
  };

  // Animation Variants
  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -50 : 50 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
    exit: { opacity: 0, x: isLogin ? 50 : -50, transition: { duration: 0.3, ease: 'easeIn' as const } }
  };

  const floatingAnimation = (delay: number) => ({
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 5, repeat: Infinity, delay, ease: 'easeInOut' as const }
  });

  return (
    <div className="min-h-screen bg-surface-0 flex relative overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-400/20 blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-400/10 blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
      />

      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-center lg:justify-between px-4 lg:px-12 py-8 relative z-10">
        
        {/* Left Side: Branding & Graphics (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 pr-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-12">
            <motion.div 
              whileHover={{ rotate: 180 }} 
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl shadow-lg shadow-primary-500/30"
            >
              🌾
            </motion.div>
            <span className="text-3xl font-bold font-display text-text-primary tracking-tight">{t('app.name')}</span>
          </Link>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-text' : 'register-text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold font-display text-text-primary leading-tight mb-6">
                {isLogin ? 'Welcome Back to Your Farm.' : 'Join the Farming Revolution.'}
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed max-w-md mb-12">
                {isLogin 
                  ? 'Sign in to access your personalized crop advisory, weather forecasts, and AI-powered disease detection.'
                  : 'Create an account to get smart, localized recommendations to boost your crop yield and protect your harvest.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Floating Decorative Elements */}
          <div className="relative h-40">
            <motion.div animate={floatingAnimation(0)} className="absolute top-0 left-0 p-4 bg-surface-1/50 backdrop-blur-md border border-glass-border rounded-2xl shadow-xl">
              <Sprout className="w-8 h-8 text-primary-400" />
            </motion.div>
            <motion.div animate={floatingAnimation(1.5)} className="absolute top-12 left-32 p-4 bg-surface-1/50 backdrop-blur-md border border-glass-border rounded-2xl shadow-xl">
              <Cloud className="w-8 h-8 text-blue-400" />
            </motion.div>
            <motion.div animate={floatingAnimation(3)} className="absolute -top-4 left-64 p-4 bg-surface-1/50 backdrop-blur-md border border-glass-border rounded-2xl shadow-xl">
              <Sun className="w-8 h-8 text-amber-400" />
            </motion.div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-md lg:w-1/2 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full glass-card p-8 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle card highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-amber-400" />

            <div className="text-center mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl">🌾</div>
                <span className="text-2xl font-bold font-display text-text-primary">{t('app.name')}</span>
              </Link>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-2 text-center lg:text-left">
              {isLogin ? t('auth.login') : t('auth.register')}
            </h2>
            <p className="text-sm text-text-muted mb-8 text-center lg:text-left">{t('app.tagline')}</p>

            <Button variant="secondary" fullWidth onClick={handleGoogle} isLoading={isLoading} className="mb-6 h-12 shadow-sm hover:shadow-md transition-shadow" leftIcon={
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            }>{t('auth.google')}</Button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-glass-border" />
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('auth.or')}</span>
              <div className="flex-1 h-px bg-glass-border" />
            </div>

            <div className="relative overflow-hidden min-h-[200px]">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form 
                    key="login-form"
                    variants={formVariants}
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    onSubmit={loginForm.handleSubmit(handleLoginSubmit)} 
                    className="space-y-5"
                  >
                    <Input label={t('auth.email')} type="email" autoComplete="email" leftIcon={<Mail className="w-4 h-4" />} {...loginForm.register('email')} error={loginForm.formState.errors.email?.message} />
                    <Input label={t('auth.password')} type={showPassword ? 'text' : 'password'} autoComplete="current-password" leftIcon={<Lock className="w-4 h-4" />} rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-muted hover:text-text-primary transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} {...loginForm.register('password')} error={loginForm.formState.errors.password?.message} />
                    <div className="flex justify-end -mt-2">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs text-primary-500 hover:text-primary-400 transition-colors font-medium"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                    <Button type="submit" fullWidth isLoading={isLoading} className="mt-2 h-12">{t('auth.login')}</Button>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="register-form"
                    variants={formVariants}
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} 
                    className="space-y-5"
                  >
                    <Input label={t('auth.name')} autoComplete="name" leftIcon={<User className="w-4 h-4" />} {...registerForm.register('name')} error={registerForm.formState.errors.name?.message} />
                    <Input label={t('auth.email')} type="email" autoComplete="email" leftIcon={<Mail className="w-4 h-4" />} {...registerForm.register('email')} error={registerForm.formState.errors.email?.message} />
                    <Input label={t('auth.password')} type={showPassword ? 'text' : 'password'} autoComplete="new-password" leftIcon={<Lock className="w-4 h-4" />} rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-muted hover:text-text-primary transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} {...registerForm.register('password')} error={registerForm.formState.errors.password?.message} />
                    <Input label={t('auth.confirmPassword')} type="password" autoComplete="new-password" leftIcon={<Lock className="w-4 h-4" />} {...registerForm.register('confirmPassword')} error={registerForm.formState.errors.confirmPassword?.message} />
                    <Button type="submit" fullWidth isLoading={isLoading} className="mt-2 h-12">{t('auth.register')}</Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <p className="text-sm text-text-muted text-center mt-8">
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
              <Link to={isLogin ? '/auth/register' : '/auth/login'} className="text-primary-500 hover:text-primary-400 transition-colors font-semibold">
                {isLogin ? t('auth.register') : t('auth.login')}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            key="forgot-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowForgotModal(false); }}
          >
            <motion.div
              key="forgot-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-sm glass-card p-8 shadow-2xl relative overflow-hidden"
            >
              {/* top gradient bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-amber-400" />

              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center border border-primary-400/30">
                  <KeyRound className="w-7 h-7 text-primary-400" />
                </div>
              </div>

              <h3 className="text-xl font-bold font-display text-text-primary text-center mb-1">
                Reset Your Password
              </h3>
              <p className="text-sm text-text-muted text-center mb-6">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <Input
                  label={t('auth.email')}
                  type="email"
                  autoComplete="email"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your@email.com"
                />
                <Button
                  type="submit"
                  fullWidth
                  isLoading={forgotLoading}
                  className="h-11"
                >
                  Send Reset Link
                </Button>
              </form>
              <p className="text-xs text-text-muted text-center mt-4 flex items-center justify-center gap-1.5">
                <span>📬</span>
                <span>Didn't see it? Check your <strong className="text-text-secondary">Spam / Junk</strong> folder.</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
