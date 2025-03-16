import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from './axios';

export const withAuth = (gssp: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const token = context.req.cookies['token'];

    if (!token) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    try {
      // トークンの検証
      await axios.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return await gssp(context);
    } catch (err) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }
  };
}; 