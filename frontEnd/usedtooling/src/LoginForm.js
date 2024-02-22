import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import './App.css'
import { Link, json } from 'react-router-dom';
import EquipmentBox from './EquipmentBox.js';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [pageState, setPageState] = useState('login');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [hide, setHide] = useState(false);

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

  

  function handleLogin(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('uname', e.target.uname.value);
    formData.append('pwd', e.target.pwd.value);
    
    if(formData.uname !== ''){
        fetch('http://69.18.26.126:8080/handlelogin', {
          method: 'post',
          body: formData
        }).then(response => response.json()).then(res => {
          if(res.token) setAuthToken(res.token);
          if(res.user) setUser(res.user);
          setMessage(res.message);
          redirect(res.url);
        });
    }
  }

  function handleRegister(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', e.target.fname.value);
    formData.append('lastName', e.target.lname.value);
    formData.append('email', e.target.email.value);
    formData.append('phone', e.target.phone.value);
    formData.append('uname', e.target.uname.value);
    formData.append('pwd', e.target.pwd.value);

    if(e.target.pwd.value !== e.target.cpwd.value){
      setMessage("Passwords Do Not Match");
      formData.uname = '';
    }

    if(formData.uname !== ''){
        fetch('http://69.18.26.126:8080/handleregister', {
          method: 'post',
          body: formData
        }).then(response => response.json()).then(res => {
          if(res.token) setAuthToken(res.token);
          if(res.user) {
            handleLogin(e);
          }else{
            setMessage(res.message);
            redirect(res.url);
          }
        });
    }
  }

  function redirect(url){
    navigate(url);
  }

  function updateForm(e){
    const newState = e.target.name;
    if(newState != pageState) setPageState(newState);
  }

  useEffect(()=>{
    if(getUser()) redirect('/');
  }, [pageState, hide]);

  return (
    <div className='Home'>
          <Header />
          <Nav />
          
          <div className='loginform'>
            <h2>{pageState.charAt(0).toUpperCase()+pageState.substring(1)}</h2>
          {
            pageState == 'login'?
            <div className='userform'>
                  <form onSubmit={handleLogin}>
                    <label for='uname'>Username: </label>
                    <input required type='text' name='uname' />
                    <label for='pwd'>Password: </label>
                    <input required type='password' name='pwd'/>
                    <input disabled={hide} type='submit' value='Login'/>
                  </form>
              </div>
              :
              <div className='userform'>
                  <form onSubmit={handleRegister}>
                    <label htmlFor ='fname'>First Name: </label>
                    <input required type='text' name='fname' />
                    <label htmlFor ='lname'>Last Name: </label>
                    <input required type='text' name='lname'/>
                    <label htmlFor ='email'>Email: </label>
                    <input required title='Please Enter a Valid Email Address' pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' type='text' name='email'/>
                    <label htmlFor ='phone'>Phone: </label>
                    <input title='Please Enter a Valid Phone Number' pattern="[0-9]{10}" required type='text' name='phone'/>
                    <label htmlFor ='uname'>Username: </label>
                    <input required title='User Name Must Consist of At Lease 6 Characters' pattern="^[a-zA-Z0-9]{6,}$" type='text' name='uname' />
                    <label htmlFor ='pwd'>Password: </label>
                    <input required type='password' title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit." pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$" name='pwd'/>
                    <label htmlFor ='cpwd'>Confirm Password: </label>
                    <input required title="Please enter the same password as above." pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$" type='password' name='cpwd'/>

                    <input disabled={hide} type='submit' value='Register'/>
                  </form>
              </div>
          }
          <a>{message}</a>
              <div className='loginControls'>
                <button name='login' onClick={updateForm}>Login</button>
                <button name='register' onClick={updateForm}>Register</button>
              </div>   
          </div>  
          <Footer />
    </div>
  );
}

export default LoginForm;