import { useState } from "react"
import { useContext } from 'react'
import { UserContext } from '../layout';


export default function Edit({setModify, setCreate, edit, setLoading}){
    const contxt = useContext(UserContext)
    const [title, setTitle] = useState(edit?.task)
    const [date, setDate] = useState(edit?.date_due)
    const [error, showError] = useState(false)
    const close = () => {
        setModify(false)
        setCreate(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if ((title.length < 1)  || (date.length < 1)){
            showError(true)
            return
        }
        setLoading(true)
        const url = `http://localhost:8000/api/v1/single_todos/${edit.id}`
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${50}`);
        var formdata = new FormData();
        formdata.append("task", title);
        formdata.append("date_due", date);
        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
            };
            fetch(url, requestOptions)
            .then(response => {
                if (!response.ok)
                {
                    if (response.status === 401)
                    {
                        contxt.auth(null)
                    }
                    else if(response.status === 400)
                    {
                        throw Error("Something went wrong")
                    }
                }
                response.json()
            })
            .then(() => {
                setLoading(false)
            })
            .catch(() => setLoading(false));
    }
    return(
            <div className="todos">
                <button className="close" onClick={close}>Close</button>
                <h2 className="newT">Edit Task</h2>
                {error && <><p className="errorText">All fields are required</p></>} 
                <form onSubmit={handleSubmit}>
                    <label for="tt">Title</label><br/>
                    <input type="text" value={title} id="tt" onChange={(e) => setTitle(e.target.value)}/><br/>
                    <label for="dt">Date</label><br/>
                    <input type="date" id="dt" value={date} onChange={(e) => setDate(e.target.value)}/><br/>
                    <button className="login-btn">Modify</button>
                </form>

            </div>
    )
}