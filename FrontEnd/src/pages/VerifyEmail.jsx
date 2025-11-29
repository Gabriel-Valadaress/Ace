import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

/**
 * Email verification page
 */
function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!email || !token) {
        setStatus('error');
        setMessage('Invalid verification link. Please request a new one.');
        return;
      }

      const result = await verifyEmail(email, token);

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    };

    verify();
  }, [email, token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'verifying' && (
            <>
              <Loading size="large" />
              <h1 className="mt-4 text-xl font-bold text-gray-900">Verifying your email...</h1>
              <p className="mt-2 text-gray-600">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link to="/login">
                <Button>Go to Login</Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                <Link to="/login">
                  <Button variant="outline" fullWidth>Go to Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="ghost" fullWidth>Create New Account</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;