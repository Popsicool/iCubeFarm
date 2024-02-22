"use client"
import { useRouter } from 'next/navigation';
import { GoogleLogin } from "@react-oauth/google";
import { toast } from 'react-toastify';

export default function Social({setLoading, auth}) {
  const router = useRouter();
  const responseMessage = async (response) => {
    setLoading(true)
    console.log("success:", response);
    const user = {
      grant_type: "convert_token",
      client_id:
        process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      backend: "google-oauth2",
      token: response.credential,
    };

    console.log(user);

    try {
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      };

      const response = await fetch(
        "http://localhost:8000/api-auth/convert-token/",
        fetchOptions
      );
      if (!response.ok) {
        setLoading(false)
        toast.error("Could not validate with backend server. Please use other login/signin method")
        throw new Error("Could not validate with backend server. Please use other login/signin method");
      }

      const data = await response.json();
      const new_cre = {}
      const tokens = {}
      tokens.access = data.access_token
      tokens.refresh = data.refresh_token
      new_cre.tokens = tokens
      auth(new_cre)
      router.push('/dashboard', undefined, { shallow: true, replace: true });
    } catch (error) {
      console.error("Error:", error);
    } finally{
        setLoading(false)
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <GoogleLogin
      className="login-btn"
      onSuccess={responseMessage}
      onError={errorMessage}
    />
  );
}
