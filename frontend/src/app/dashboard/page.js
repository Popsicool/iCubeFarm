"use client";
import { useEffect, useState, useContext } from "react";
import { Loading } from "../components/Loading";
import MainDashboard from "../components/MainDashboard";
import New from "../components/New";
import { useRouter } from 'next/navigation';
import Edit from "../components/Edit";
import { UserContext } from "../layout";


export default function Dashboard() {
  const [loading, setLoading] = useState(false);  
  const [modify, setModify] = useState(false)
  const [create, setCreate ] = useState(false)
  const [edit, setEdit ] = useState(null)
  const contxt = useContext(UserContext)
  const router = useRouter();
  const [todos, setTodos] = useState(null)
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const token = contxt.user?.tokens.access
        const response = await fetch('http://localhost:8000/api/v1/todos/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          console.log(response.json())
          // if (response.status === 401){
          //   contxt.auth(null)
          //   return;
          // }
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setTodos(await jsonData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error)
      }
    };

    fetchData();
    return () => {
    };
  }, []); ;
  useEffect(() => {
    if (!contxt.user) {
      router.push('/login', undefined, { shallow: true, replace: true });
    }
  }, [contxt.user, router]);

  const editing = (e) => {
  setEdit(e)
  }
  return (
  <>
  {loading ? <><Loading/></>: <>
    {!modify ? 
    <MainDashboard setModify= {setModify} setCreate = {setCreate} editing={editing} setLoading={setLoading} todos={todos}/> 
    :
    create ? <New setModify= {setModify} setCreate = {setCreate} setLoading={setLoading}/>
    :
    <Edit setModify= {setModify} setLoading={setLoading} setCreate = {setCreate} edit={edit}/>}
  </>}
    
  </>
  );
}
