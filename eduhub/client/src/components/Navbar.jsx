import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">EduHub</Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  Admin Dashboard
                </Link>
              )}
              
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-slate-500">Hello,</span> {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="font-medium text-slate-600 hover:text-primary-600 transition-colors py-2">Login</Link>
              <Link 
                to="/register" 
                className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 shadow-sm hover:shadow-md transition-all font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;