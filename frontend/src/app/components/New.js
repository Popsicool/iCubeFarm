import { useState, useContext } from "react"
import { toast } from 'react-toastify';
import { UserContext } from "../layout";

export default function New({setModify, setCreate, setLoading}){
    const user = useContext(UserContext).user
    const [task, settask] = useState("")
    const [date, setDate] = useState("")
    const [error, showError] = useState(false)
    const close = () => {
        setModify(false)
        setCreate(false)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if ((task.length < 1)  || (date.length < 1)){
            showError(true)
            return
        }
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('task', task);
            formData.append('date', date);
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
              const data = await response.json();
                const key = Object.keys(data)[0];
                const errorMessage = `${key}: ${data[key][0]}`;
                toast.error(errorMessage)
                setLoading(false)
              throw new Error(errorMessage);
            }
            toast.success('Todo created successfully');
            const data = await response.json();
            contxt.auth(data)
            setLoading(false)
            router.push('/dashboard', undefined, { shallow: true, replace: true });
    
          } catch (error) {
            console.error('Error:', error.message);
            setLoading(false)
          }
    }
    return(
            <div className="todos">
                <button className="close" onClick={close}>Close</button>
                <h2 className="newT">New Task</h2>
                {error && <><p className="errorText">All fields are required</p></>} 
                <form onSubmit={handleSubmit}>
                    <label for="tt">Title</label><br/>
                    <input type="text" value={task} id="tt" onChange={(e) => settask(e.target.value)}/><br/>
                    <label for="dt">Date</label><br/>
                    <input type="date" id="dt" value={date} onChange={(e) => setDate(e.target.value)}/><br/>
                    <button className="login-btn">Create</button>
                </form>

            </div>
    )
}