import { signIn } from 'next-auth/react';

export default async function callback(req, res) {
  try {
    const session = await signIn('google', { callbackUrl: '/' });
    console.log(session.user)
    // const response = await fetch('https://your-backend-api.com/user', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${session.accessToken}`
    //   },
    //   body: JSON.stringify(session.user)
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to send user data to backend');
    // }
    // res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling callback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}