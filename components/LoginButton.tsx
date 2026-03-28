'use client';

import { useAuth } from '@/context/auth-context';

export default function LoginButton() {
  const { user, login, logout, isAuthenticated, loading } = useAuth();

  if (loading) return <button disabled className="px-4 py-2 bg-gray-300 rounded">Loading...</button>;

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
        <span className="text-sm font-medium">{user.name}</span>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
    >
      Sign in with Google
    </button>
  );
}
