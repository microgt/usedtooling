import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import './App.css'
import { Link, json } from 'react-router-dom';
import EquipmentBox from './EquipmentBox.js';
import { useLocation, useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
    formData.append('pwd', e.target.pwd.value);
    formData.append('role', e.target.role? e.target.role.value : null);
    formData.append('token', getAuthToken());
    formData.append('uid', getUser().id);

    if(e.target.pwd.value !== e.target.cpwd.value){
      setMessage("Passwords Do Not Match");
      formData.uname = '';
    }

    if(formData.uname !== ''){
        fetch('http://69.18.26.126:8080/adduser', {
          method: 'post',
          body: formData
        }).then(response => response.json()).then(res => {
            setMessage(res.message);
            redirect(res.url);
        });
    }
  }

  function redirect(url){
    if(url) navigate(url);
  }



  return (
    <div className='Home'>
          <Header />
          <Nav />     
          <div className='loginform'>
            <h2>Create User</h2>
              <div className='userform'>
                  <form onSubmit={handleRegister}>
                    <label htmlFor ='fname'>First Name: </label>
                    <input required type='text' name='fname' />
                    <label htmlFor ='lname'>Last Name: </label>
                    <input required type='text' name='lname'/>
                    <label htmlFor ='email'>Email: </label>
                    <input required title='Please Enter a Valid Email Address' pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' type='text' name='email'/>
                    <label htmlFor ='phone'>Phone: </label>
                    <input required title='Please Enter a Valid Phone Number' pattern="[0-9]{10}" type='text' name='phone'/>
                    <label htmlFor ='uname'>Username: </label>
                    <input required title='User Name Must Consist of At Lease 6 Characters' pattern="^[a-zA-Z0-9]{6,}$" type='text' name='uname' />
                    <label htmlFor ='pwd'>Password: </label>
                    <input required type='password' title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit." pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$" name='pwd'/>
                    <label htmlFor ='cpwd' >Confirm Password: </label>
                    <input required title="Please enter the same password as above." pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$" type='password' name='cpwd'/>

                    {
                      (getUser().role === 'OWNER')?
                    <div>
                      <label htmlFor ='role'>Role: </label>
                        <select name='role'>
                          <option value='USER'>User</option>
                          <option value='EDITOR'>Editor</option>
                          <option value='ADMIN'>Admin</option>
                          <option value='OWNER'>Owner</option>
                        </select>
                      </div>
                      :
                      ''
                    }

                    <input type='submit' value='Register'/>
                  </form>
              </div>
          <a>{message}</a>  
          </div>  
          <Footer />
    </div>
  );
}

export default AddUser;