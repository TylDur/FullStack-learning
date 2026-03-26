import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // Add this import

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, signInWithGoogle, error, setError } = useAuth();
  const { success, error: showError } = useToast(); // Add toast
  const navigate = useNavigate();

  // Email/Password Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    
    // Password validation
    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    const result = await signup(email, password);
    
    if (result.success) {
      success("Account created successfully! 🎉");
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      showError(result.error || "Signup failed");
    }
    
    setLoading(false);
  };

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      success("Account created with Google! 🎉");
      navigate('/dashboard');
    } else {
      showError(result.error || "Google sign up failed");
    }
    
    setGoogleLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        
        {error && (
          <div style={styles.error}>{error}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading || googleLoading}
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || googleLoading}
              style={styles.input}
              placeholder="you@example.com"
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
              placeholder="••••••••"
            />
            <small style={styles.small}>Must be at least 6 characters</small>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading || googleLoading}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || googleLoading} 
            style={styles.button}
          >
            {loading ? 'Creating Account...' : 'Sign Up with Email'}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine}></div>
        </div>
        
        {/* Google Sign Up Button */}
        <button 
          onClick={handleGoogleSignUp}
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
          <span>{googleLoading ? 'Signing up...' : 'Continue with Google'}</span>
        </button>
        
        <p style={styles.link}>
          Already have an account? <Link to="/login" style={styles.linkText}>Login</Link>
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
  },
  small: {
    display: 'block',
    marginTop: '0.25rem',
    color: '#666',
    fontSize: '0.8rem',
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

export default Signup;