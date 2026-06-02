import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { X, ChevronRight, User, PlusCircle, ArrowLeft } from 'lucide-react';

const GoogleLoginButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState('list'); // 'list' | 'custom' | 'processing'
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const mockAccounts = [
    { name: 'Admin User', email: 'admin@eduhub.com', initials: 'AU', role: 'admin' },
    { name: 'John Doe', email: 'john@example.com', initials: 'JD', role: 'user' },
  ];

  const handleOpen = () => {
    setIsOpen(true);
    setAuthStep('list');
    setCustomName('');
    setCustomEmail('');
    setSelectedUser(null);
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while authenticating
    setIsOpen(false);
  };

  const executeGoogleLogin = async (email, name) => {
    setLoading(true);
    setAuthStep('processing');
    setSelectedUser({ name, email });

    // Simulate Google authorization verification
    setTimeout(async () => {
      const result = await googleLogin(email, name);
      setLoading(false);

      if (result.success) {
        toast.success(`Signed in as ${name}`);
        setIsOpen(false);
        navigate(from, { replace: true });
      } else {
        toast.error(result.message);
        setAuthStep('list');
      }
    }, 1200);
  };

  const handleSelectAccount = (account) => {
    executeGoogleLogin(account.email, account.name);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName || !customEmail) {
      toast.error('Please enter name and email');
      return;
    }
    executeGoogleLogin(customEmail, customName);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
          />
        </svg>
        <span className="text-slate-800">Continue with Google</span>
      </button>

      {/* Google Account Selector Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-[400px] overflow-hidden border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200 py-8 px-6 text-slate-800 font-sans">
            {/* Close button */}
            {!loading && (
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {/* Google Logo Header */}
            <div className="flex flex-col items-center mb-6">
              <svg className="h-8 w-auto mb-4" viewBox="0 0 24 24" width="32" height="32">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <h3 className="text-xl font-medium text-slate-900">Sign in with Google</h3>
              <p className="text-sm text-slate-500 mt-1">to continue to <span className="font-semibold text-primary-600">EduHub</span></p>
            </div>

            {/* Step 1: List Accounts */}
            {authStep === 'list' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                  {mockAccounts.map((acc, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAccount(acc)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                          {acc.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{acc.name}</p>
                          <p className="text-xs text-slate-500">{acc.email}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md capitalize">
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setAuthStep('custom')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 text-left transition-colors rounded-2xl border border-dashed border-slate-200 mt-2 text-slate-600 hover:text-slate-800 font-medium group"
                >
                  <PlusCircle size={20} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                  <span className="text-sm">Use another account</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
                  To continue, Google will share your name, email address, profile picture, and language preference with EduHub.
                </p>
              </div>
            )}

            {/* Step 2: Custom account input */}
            {authStep === 'custom' && (
              <form onSubmit={handleCustomSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                  type="button"
                  onClick={() => setAuthStep('list')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors mb-2"
                >
                  <ArrowLeft size={14} /> Back to account list
                </button>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 ml-0.5">Google User Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl text-sm transition-all focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 ml-0.5">Google Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl text-sm transition-all focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 mt-4"
                >
                  Sign in
                </button>
              </form>
            )}

            {/* Step 3: Authenticating/Processing */}
            {authStep === 'processing' && (
              <div className="flex flex-col items-center py-10 animate-in fade-in duration-300">
                <div className="relative flex items-center justify-center mb-6">
                  {/* Google colors loading rings */}
                  <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-500 border-r-green-500 border-b-yellow-500 border-l-red-500 animate-spin"></div>
                </div>
                <h4 className="text-base font-semibold text-slate-800">Signing you in...</h4>
                {selectedUser && (
                  <div className="mt-4 text-center">
                    <p className="text-xs font-semibold text-slate-600">{selectedUser.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedUser.email}</p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-6 italic">Verifying credentials with Google...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleLoginButton;
