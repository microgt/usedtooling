import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import './App.css'
import { Link, json } from 'react-router-dom';
import EquipmentBox from './EquipmentBox.js';
import { useLocation, useNavigate } from 'react-router-dom';

const UserView = () => {
  const location = useLocation();
  const usr = location.state?.data || {};
  const [message, setMessage] = useState('');
  const [r, setR] = useState(usr.role);
  const [uinfo, setUinfo] = useState({
    id: usr.id,
    fname: usr.firstName,
    lname: usr.lastName,
    email: usr.email,
    phone: usr.phone,
    uname: usr.userName,
    pwd: usr.password,
    cpwd: usr.password,
    role: usr.role
  });
  
  const navigate = useNavigate();
  const [canEdit, setCanEdit] = useState(location.state?.editable);

  const getAuthToken = () =>{
    return window.localStorage.getItem('auth_token');
  };
  const setAuthToken = (token) => {
    window.localStorage.setItem('auth_token', token);
  };

  const setUser = (user) => {
    window.localStorage.setItem('auth_user', JSON.stringify(user));
  };

  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };

  function handleRegister(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', e.target.fname.value);
    formData.append('lastName', e.target.lname.value);
    formData.append('email', e.target.email.value);
    formData.append('phone', e.target.phone.value);
    formData.append('uname', e.target.uname.value);
    formData.append('pwd', e.target.pwd.value !== ''? e.target.pwd.value : usr.password);
    formData.append('role', e.target.role.value);
    formData.append('token', getAuthToken());
    
    if(e.target.pwd.value !== '' && e.target.cpwd.value !== usr.password){
      setMessage("Invalid Password");
      formData.uname = '';
    }else if(e.target.pwd.value !== '' && e.target.pwd.value === usr.password){
      setMessage("New Password Cannot Be The Same As The Old Password");
      formData.uname = '';
    }else if(e.target.pwd.value !== '' && e.target.pwd.value !== e.target.npwd.value){
      setMessage("Passwords Do Not Match");
      formData.uname = '';
    }
    
    if(formData.uname !== ''){
        fetch('http://69.18.26.126:8080/handleregister', {
          method: 'post',
          body: formData
        }).then(response => response.json()).then(res => {
          if(res.user && res.user.userName == getUser().userName) {
            setUser(res.user);
          }
          redirect(res.url);
        });
    }
  }

  function redirect(url){
    navigate(url);
  }

  function enableEditing(e){
    e.preventDefault();
    setCanEdit(true);
  }

  function deleteUser(e){
    e.preventDefault();
    if(window.confirm("Are You Sure You Want To Delete " + usr.firstName + " " + usr.lastName + " (" + usr.userName + ")" + "?") == true) confirmDelete(e.target.id);
  }

  function confirmDelete(id){
    const formData = new FormData();
    formData.append('uid', id);
    formData.append('token', getAuthToken());
    fetch('http://69.18.26.126:8080/deleteuser', {
      method : 'POST',
      body : formData
    }).then(response => response.text()).then(text => {logout();});
  }

  function logout(){
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('auth_user');
    navigate('/');
  }

  function handleOnChange(e){
    e.preventDefault();
    setUinfo((prevUinfo) => ({
      ...prevUinfo,
      [e.target.name]: e.target.value,
    }));
  }
  function updateRole(e){
    e.preventDefault();
    usr.role = e.target.value;
    setR(usr.role);
  }
  
  return (
    <div className='Home'>
          <Header />
          <Nav />
          
          <div className='loginform'>
            <h2>User Information</h2>
              <div className='userform'>
                  <form id='edituser' onSubmit={handleRegister}>
                    <label htmlFor ='uid'>User ID: </label>
                    <input disabled type='tex' value={usr.id} name='uid' />
                    
                    <label htmlFor ='fname'>First Name: </label>
                    <input onChange={handleOnChange} disabled={!canEdit} type='text' required value={uinfo.fname} name='fname' />
                    <label htmlFor ='lname'>Last Name: </label>
                    <input onChange={handleOnChange} disabled={!canEdit} value={uinfo.lname} type='text' required name='lname'/>
                    <label htmlFor ='email'>Email: </label>
                    <input title='Please Enter a Valid Email Address' pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required onChange={handleOnChange} disabled={!canEdit} type='text' value={uinfo.email} name='email'/>
                    <label htmlFor ='phone'>Phone: </label>
                    <input title='Please Enter a Valid Phone Number' pattern="[0-9]{10}" required onChange={handleOnChange} disabled={!canEdit} type='text' value={uinfo.phone} name='phone'/>
                    <label htmlFor ='uname'>Username: </label>
                    <input title='User Name Must Consist of At Lease 6 Characters' pattern="^[a-zA-Z0-9]{6,}$" required disabled type='text' value={uinfo.uname} name='uname' />
                    <label htmlFor='jdate'>Date Joined: </label>
                    <input disabled type='text' value={usr.joinDate} name='jdate' />
                    {
                      canEdit?
                      <div>
                        <label htmlFor ='cpwd'>Current Password: </label>
                        <input title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit." name='cpwd' type='password'/>
                        <label htmlFor ='pwd'>New Password: </label>
                        <input title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit." pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$" type='password' name='pwd'/>
                        <label htmlFor ='npwd'>Confirm Password: </label>
                        <input title="Please enter the same password as above." pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$" type='password' name='npwd'/>
                      </div>
                      :
                      ''
                    }
                    
                    

                    {
                      (getUser().role === 'OWNER' && canEdit)?
                    <div>
                      <label htmlFor ='role'>Role: </label>
                        <select onChange={updateRole} value={r} name='role'>
                          <option value='USER'>User</option>
                          <option value='EDITOR'>Editor</option>
                          <option value='ADMIN'>Admin</option>
                          <option value='OWNER'>Owner</option>
                        </select>
                      </div>
                      :
                      ''
                    }
                    
                    
                  </form>
              </div>
          <a>{message}</a>
              <div className='loginControls'>
                <button name='delete' onClick={deleteUser} id={usr.id}>Delete</button>
                {
                  !canEdit? <button name='edit' onClick={enableEditing}>Edit</button> :
                  <button type="submit" form="edituser" name='save'>Save</button>
                }
                
              </div>   
          </div>  
          <Footer />
    </div>
  );
}

export default UserView;