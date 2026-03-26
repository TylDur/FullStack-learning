import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // Add this import

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); 
  const { login, signInWithGoogle, error, setError } = useAuth();
  const { success, error: showError } = useToast(); // Add toast
  const navigate = useNavigate();

  // Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      success("Welcome back! 🎉"); // Add success toast
      navigate('/dashboard');
    } else {
      showError(result.error || "Login failed"); // Add error toast
    }
    
    setLoading(false);
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    
    const result = await signInWithGoogle(); 
    
    if (result.success) {
      success("Logged in with Google! 🎉"); // Add success toast
      navigate('/dashboard');
    } else {
      showError(result.error || "Google sign in failed"); // Add error toast
    }
    
    setGoogleLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login to Your Account</h2>
        
        {error && (
          <div style={styles.error}>{error}</div>
        )}
        
        {/* Email/Password Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || googleLoading}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || googleLoading}
              style={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || googleLoading} 
            style={styles.button}
          >
            {loading ? 'Logging in...' : 'Login with Email'}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Google Sign In Button */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          style={styles.googleButton}
          onMouseEnter={(e) => {
            if (!(loading || googleLoading)) {
              e.target.style.backgroundColor = '#f8f8f8';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white';
          }}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google"
            style={styles.googleIcon}
          />
          <span>{googleLoading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>
        
        <p style={styles.link}>
          Don't have an account? <Link to="/signup" style={styles.linkText}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'transform 0.2s',
  },
  googleButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'white',
    color: '#757575',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.3s',
    marginBottom: '1rem',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    gap: '10px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#ddd',
  },
  dividerText: {
    color: '#999',
    fontSize: '0.9rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '5px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#666',
  },
  linkText: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
  }
};

// Add hover and focus styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  input:focus {
    outline: none;
    border-color: #667eea;
  }
  a:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(styleSheet);

export default Login;