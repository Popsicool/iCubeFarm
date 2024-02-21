import { useState, useContext } from "react"
import { toast } from 'react-toastify';
import { UserContext } from "../layout";

export default function New({setModify, setCreate, setLoading}){
    const user = useContext(UserContext).user
    const auth = useContext(UserContext).auth
    const [formData, setFormData] = useState({
      task: '',
      date_due: ''
    });
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
    const [error, showError] = useState(false)
    const close = () => {
        setModify(false)
        setCreate(false)
    }
    const handleSubmit = async (e) => {
      setLoading(true)
      e.preventDefault();
      try {
        const token = user.tokens.access
        const response = await fetch('http://localhost:8000/api/v1/todos/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
          
        if (!response.ok) {
          if (response.status === 401){
            auth(null)
            return;
          }
          const data = await response.json();
            const key = Object.keys(data)[0];
            const errorMessage = `${key}: ${data[key][0]}`;
            toast.error(errorMessage)
            setLoading(false)
          throw new Error(errorMessage);
        }
        toast.success('Todo created successfully');
        const data = await response.json();
        setLoading(false)
        window.location.reload(false);
  
      } catch (error) {
        console.error('Error:', error.message);
        setLoading(false)
      }
    };
    return(
            <div className="todos">
                <button className="close" onClick={close}>Close</button>
                <h2 className="newT">New Task</h2>
                {error && <><p className="errorText">All fields are required</p></>} 
                <form onSubmit={handleSubmit}>
                    <label for="tt">Title</label><br/>
                    <input type="text" value={formData.task} id="tt" name="task" onChange={handleChange}/><br/>
                    <label for="dt">Date</label><br/>
                    <input type="date" id="dt" value={formData.date_due} name="date_due" onChange={handleChange}/><br/>
                    <button className="login-btn">Create</button>
                </form>

            </div>
    )
}