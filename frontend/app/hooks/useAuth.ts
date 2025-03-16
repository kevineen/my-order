import { useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  position?: string;
  avatarUrl?: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email, // FastAPIのOAuth2PasswordRequestFormはusernameを期待します
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'ログインに失敗しました');
      }

      const data: LoginResponse = await response.json();

      // トークンとユーザー情報を保存
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ダッシュボードにリダイレクト
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  };

  return {
    login,
    logout,
    getToken,
    getUser,
    loading,
    error,
  };
}; 