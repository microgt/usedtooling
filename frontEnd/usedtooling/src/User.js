import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import './App.css'
import { Link, json } from 'react-router-dom';
import EquipmentBox from './EquipmentBox.js';
import { useLocation, useNavigate } from 'react-router-dom';
import UserView from './UserView.js';

const User = (uinfo) => {

  const location = useLocation();
 
  const [info, setInfo] = useState({});
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };
  const getAuthToken = () =>{
    return window.localStorage.getItem('auth_token');
  };

  function redirect(url){
    navigate(url);
  }

  useEffect(()=>{
    setInfo(getUser());
    setToken(getAuthToken());
  }, []);


  async function getUserInformation(e){
    e.preventDefault();
      let u = null;
      await fetch('http://69.18.26.126:8080/singleuser?uid=' + e.target.id + '&&token=' + token)
      .then(response => response.json())
      .then(res => navigate("/userview", {state: {data: res}}));
  }


  function editUser(e){
    e.preventDefault();
    navigate('/userview', {state : {data: uinfo.value,
    editable: true}});
  }

  function deleteUser(e){
    e.preventDefault();
    if(window.confirm("Are You Sure You Want To Delete " + info.firstName + " " + info.lastName + " (" + info.userName + ")" + "?") == true) confirmDelete(e.target.id);
  }

  function confirmDelete(id){
    const formData = new FormData();
    formData.append('uid', id);
    formData.append('token', getAuthToken());
    fetch('http://69.18.26.126:8080/deleteuser', {
      method : 'POST',
      body : formData
    }).then(response => response.text()).then(text => {alert(text); window.location.reload();});
  }

  return (
    <div className='userbox'>
            <div className='userinfo'>
                <a onClick={getUserInformation} id={uinfo.value.id}>{uinfo.value.firstName + ' ' + uinfo.value.lastName + ' - ' + uinfo.value.role.charAt(0) + uinfo.value.role.substring(1).toLowerCase()}</a>
            </div>
            
            {
              getUser() && (getUser().role === 'OWNER' || getUser().role === 'ADMIN')?
                <div className='usercontrols'>
                    <a onClick={editUser} id={uinfo.value.id} className='editbtn'>Edit</a>
                    <a onClick={deleteUser} id={uinfo.value.id} className='deletebtn'>Delete</a>
                </div>
              :
              ''
            }
            
    </div>
  );
}

export default User;