"use client";
import { useState, useEffect, useContext } from "react";
import { Loading } from "../components/Loading";
import { UserContext } from "../layout";
import { useRouter } from 'next/navigation';


export default function MainDashboard({setModify, setCreate, editing, setLoading}) {
  const user = useContext(UserContext).user
  const router = useRouter();
  if (!user){
    router.push('/login', undefined, { shallow: true, replace: true });
}
  const [todos, setTodos] = useState([])
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const token = user.tokens.access
        const response = await fetch('http://localhost:8000/api/v1/todos/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        console.log( await jsonData.results)
        setTodos(await jsonData.results);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
    };
  }, []); ;
  const openNew = () => {
    setModify(true)
    setCreate(true)
  }
  const openModify = (todo) => {
    editing(todo)
    setModify(true)
    setCreate(false)
  }
  return (
        <>
        <h3 className="welcome">Welcome back {user?.first_name} {user?.last_name}</h3>
          {todos ? (
            <div className="todos">
              <div className="filters">
                <div>
                  <select>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Expired</option>
                  </select>
                  <button className="filter-btn">Filter</button>
                </div>

                <div>
                  <form>
                    <input type="text"/>
                    <button className="filter-btn">Search</button>
                  </form>
                </div>

              </div>
              <div className="todo todo-head">
                    <p className="title">Title</p>
                    <p className="status">Status</p>
                    <p className="status">Date</p>
                </div>
              {todos.map((todo) => (
                <div className="todo" key={todo.id}>
                    <p className="title">{todo.task}</p>
                    <p className="status">{todo.status}</p>
                    <p className="status">{todo.date}</p>
                    <button className="status edit" onClick={() => openModify(todo)}>Edit</button>
                    <button className="status delete">Delete</button>
                </div>
              ))}
              <button className="login-btn" onClick={openNew}>Create New</button>
            </div>
          ) : (
            <div className="Login-page">
              <div className="login-wrap">
                <h3>NO Todo yet</h3>
                <button className="login-btn" onClick={openNew}>Create One</button>
              </div>
            </div>
          )}
        </>
  )
}