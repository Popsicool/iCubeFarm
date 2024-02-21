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
  if (!contxt.user){
    router.push('/login', undefined, { shallow: true, replace: true });
}
  const editing = (e) => {
  setEdit(e)
  }
  return (
  <>
  {loading ? <><Loading/></>: <>
    {!modify ? 
    <MainDashboard setModify= {setModify} setCreate = {setCreate} editing={editing} setLoading={setLoading}/> 
    :
    create ? <New setModify= {setModify} setCreate = {setCreate} setLoading={setLoading}/>
    :
    <Edit setModify= {setModify} setLoading={setLoading} setCreate = {setCreate} edit={edit}/>}
  </>}
    
  </>
  );
}
