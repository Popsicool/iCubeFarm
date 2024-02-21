"use client"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react'
import { UserContext } from '../../layout';
import { toast } from 'react-toastify';
import { Loading } from "@/app/components/Loading";


export default function SignUp(){
    
    const contxt = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const router = useRouter() 
    if (contxt.user){
        router.push('/', undefined, { shallow: true, replace: true });
    }
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
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
            const response = await fetch('http://localhost:8000/auth/signup/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const data = await response.json();
                const key = Object.keys(data)[0];
                const errorMessage = `${key}: ${data[key][0]}`;
                toast.error(errorMessage)
                setLoading(false)
              throw new Error('Sign up failed');
            }
            toast.success('Sign up successful!');
            setLoading(false)
            router.push('/login', undefined, { shallow: true, replace: true });
            setFormData({
              email: '',
              first_name: '',
              last_name: '',
              password: ''
            });

          } catch (error) {
            console.error('Error signing up:', error.message);
            setLoading(false)
          }
      };
    return <>
    {loading ? <Loading/> :
    <div className="Login-page">
        <div className="login-wrap">
        <h3>Create an account</h3>
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
        <label>First Name:</label><br/>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Last Name:</label><br/>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
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
      <button type="submit" className='logon'>Sign Up</button>
          </form>
        <button className="login-btn">Sign up with Google</button>

        </div>

        </div>

    </div>
    }
    </>
}