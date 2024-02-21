"use client";
import { useState, useEffect, useContext } from "react";
import { Loading } from "../components/Loading";
import { UserContext } from "../layout";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function MainDashboard({setModify, setCreate, editing, setLoading, todos}) {
  const user = useContext(UserContext).user
  const router = useRouter();
  console.log(todos?.length)
  useEffect(() => {
    if (!user) {
      router.push('/login', undefined, { shallow: true, replace: true });
    }
  }, [user, router]);

  const handleDelete = async (e) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/single_todos/${e.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.tokens.access}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        const data = await response.json();
        const key = Object.keys(data)[0];
            const errorMessage = `${key}: ${data[key][0]}`;
            toast.error(errorMessage)
        throw new Error('Failed to delete todo');
      }
      toast.success('Todo Deleted');
      window.location.reload(false);
  
      console.log('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    } finally {
      setLoading(false)
    }
  };
  
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
          {todos?.length > 0 ? (
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
                    <button className="status delete" onClick={() => handleDelete(todo)}>Delete</button>
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