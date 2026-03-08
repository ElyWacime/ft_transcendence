/**
 * Example component showing how to use the new secure JWT authentication
 * 
 * This demonstrates:
 * 1. Using useAuth hook to access auth state
 * 2. Using useAuthenticatedFetch for API calls
 * 3. Handling loading states
 * 4. Automatic token refresh (happens behind the scenes)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAuthenticatedFetch } from '@/lib/useAuthenticatedFetch';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export function ExampleAuthenticatedComponent() {
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const api = useAuthenticatedFetch();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example: Load data on component mount
  useEffect(() => {
    if (isLoggedIn) {
      loadProfile();
    }
  }, [isLoggedIn]);

  // Example: GET request
  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/users/profile');
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Example: PUT request (update profile)
  const updateProfileName = async (newName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/api/users/profile', {
        name: newName,
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        alert('Profile updated!');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string) => {
    try {
      const response = await api.post('/api/posts', {
        content,
        timestamp: new Date().toISOString(),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Post created:', data);
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  // Example: DELETE request
  const deleteAccount = async () => {
    if (!confirm('Are you sure?')) return;
    
    try {
      const response = await api.delete('/api/users/account');
      
      if (response.ok) {
        await logout();
        alert('Account deleted');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div>
        <p>Please log in to view this page</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Authenticated Component Example</h1>
      
      {/* Show current user info from context */}
      <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
        <h2>Current User (from context)</h2>
        <p><strong>ID:</strong> {user?.id}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Name:</strong> {user?.name}</p>
      </div>

      {/* Show profile data loaded from API */}
      <div style={{ background: '#e8f4f8', padding: '10px', marginBottom: '20px' }}>
        <h2>Profile Data (from API)</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {profile && (
          <div>
            <p><strong>ID:</strong> {profile.id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Name:</strong> {profile.name}</p>
            {profile.avatar && (
              <img src={profile.avatar} alt="Avatar" style={{ width: 100, height: 100 }} />
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={loadProfile} disabled={loading}>
          Reload Profile
        </button>
        
        <button 
          onClick={() => {
            const name = prompt('Enter new name:');
            if (name) updateProfileName(name);
          }}
          disabled={loading}
        >
          Update Name
        </button>
        
        <button 
          onClick={() => {
            const content = prompt('Enter post content:');
            if (content) createPost(content);
          }}
        >
          Create Post
        </button>
        
        <button onClick={logout} style={{ background: '#ff4444', color: 'white' }}>
          Logout
        </button>
      </div>

      {/* Info about automatic token refresh */}
      <div style={{ marginTop: '30px', padding: '15px', background: '#fffbea', border: '1px solid #f0e68c' }}>
        <h3>🔐 Security Features Active:</h3>
        <ul>
          <li>✅ Access token stored in memory (not localStorage)</li>
          <li>✅ Refresh token in httpOnly cookie (XSS protected)</li>
          <li>✅ Automatic token refresh when expired (seamless UX)</li>
          <li>✅ Session restored on page refresh (silent refresh)</li>
          <li>✅ Refresh token rotation on every refresh</li>
        </ul>
        <p><strong>Try this:</strong></p>
        <ol>
          <li>Wait 15+ minutes (access token expires)</li>
          <li>Click "Reload Profile" → Should work seamlessly!</li>
          <li>Check Network tab → You'll see /refresh call before profile load</li>
        </ol>
      </div>
    </div>
  );
}

/**
 * ALTERNATIVE: Using fetchWithAuth directly (without hook)
 * 
 * import { useAuth } from '@/context/AuthContext';
 * import { fetchWithAuth } from '@/lib/tokenRefresh';
 * 
 * function MyComponent() {
 *   const { accessToken, updateAccessToken } = useAuth();
 *   
 *   const loadData = async () => {
 *     const response = await fetchWithAuth(
 *       '/api/users/profile',
 *       { method: 'GET' },
 *       accessToken,
 *       updateAccessToken
 *     );
 *     const data = await response.json();
 *   };
 * }
 */

/**
 * ALTERNATIVE: Using raw fetch (less recommended, but works)
 * 
 * function MyComponent() {
 *   const { accessToken } = useAuth();
 *   
 *   const loadData = async () => {
 *     const response = await fetch('/api/users/profile', {
 *       headers: {
 *         Authorization: `Bearer ${accessToken}`,
 *       },
 *       credentials: 'include',  // Important: send cookies
 *     });
 *     
 *     if (response.status === 401) {
 *       // Handle 401 manually - not recommended, use interceptor instead
 *     }
 *     
 *     const data = await response.json();
 *   };
 * }
 */
