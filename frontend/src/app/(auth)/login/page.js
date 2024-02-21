"use client"
import { useRouter } from 'next/navigation';
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../layout';
import { Loading } from '@/app/components/Loading';
import { toast } from 'react-toastify';


export default function Login(){
  const contxt = useContext(UserContext)
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      if (contxt.user) {
        router.push('/dashboard', undefined, { shallow: true, replace: true });
      }
    }, [contxt.user, router]);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8000/auth/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const data = await response.json();
          const errorMessage = data.detail;
          setLoading(false)
          toast.error(errorMessage)
          throw new Error(errorMessage);
        }
        toast.success('Login successful!');
        const data = await response.json();
        contxt.auth(data)
        setLoading(false)
        setFormData({
          email: '',
          password: ''
        });
        router.push('/dashboard', undefined, { shallow: true, replace: true });

      } catch (error) {
        console.error('Error Logging:', error.message);
        setLoading(false)
      }
  };
  
    const handleLogin =  () => {
      setLoading(true);
      fetch('http://localhost:8000/api/auth/github/', {
        method: 'GET',
        credentials: 'include',
      })
      .then (res => {
        if (!res.ok){
          throw new Error("something went wrong")
        }
        return res.json()
      }).then(data => {
        setLoading(false);
      })
    };

    return <>
    {loading ? <Loading/> :
    <div className="Login-page">
        <div className="login-wrap">
        <h3>Welcome back!</h3>
        <div className="auth-form">
        <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label><br/>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label><br/>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className='logon'>Log in</button>
          </form>
        <button className="login-btn" onClick={handleLogin}>Login with Github</button>

        </div>
        </div>
    </div>
    }

    </>
}