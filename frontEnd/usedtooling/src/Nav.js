import { useEffect, useState } from 'react';
import './App.css'
import homeIcon from './homeIcon.png';
import searchIcon from './searchIcon.png';
import menuIcon from './menbutton.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Nav = ({ onInputChange }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };


  const [isScrolled, setIsScrolled] = useState(false);
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(true);

  function receivedFocus(){
    if (location.pathname !== '/store') navigate('/store?start=1&end=20');
  }

  function onSearchUpdate(event){
    setQ(event.target.value);
    onInputChange(event.target.value);
  }

  function onMenuPress(){
    setMenu(!menu);
    console.log(menu);
  }

  function logout(e){
    e.preventDefault();
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('auth_user');
    navigate('/');
  }

  function editUser(e){
    e.preventDefault();
    navigate('/userview', {state : {data: getUser(), editable: false}});
  }

  useEffect(() => {
    const handleScroll = () => {

      const scrollPosition = window.scrollY;
      const threshold = 225; 

      setIsScrolled(scrollPosition > threshold);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menu]);

  return (
    <div className={isScrolled? "fixed-nav": "Nav"}>
      <img className='mobileVisible'id={menu? '':'menuHidden'} onClick={onMenuPress} src={menuIcon}/>
      <a className='mobileHidden' href="/">
        <img className='menuHidden' src={homeIcon}/>
      </a>
      <a className='mobileHidden' href='/store'><h2>Store</h2></a>
      <a className='mobileHidden' href='/equipment'><h2>Equipment</h2></a>
      {
          (getUser() && (getUser().role === 'OWNER' || getUser().role === 'EDITOR'))? <a href='/users' className='mobileHidden'><h2>Users</h2></a> : ''
      }
      {
          (getUser() && (getUser().role === 'OWNER'))? <a href='/views' className='mobileHidden'><h2>Views</h2></a> : ''
      }
      <a className='mobileHidden' href='/#rigging'><h2>Rigging Services</h2></a>
      <a className='mobileHidden' href='/#about'><h2>About Us</h2></a>
      <a className='mobileHidden' href='/#contact'><h2>Contact Us</h2></a>

      <div className='mobileVisible menum' id={menu?'menuHidden' : 'mobilem'}>
        <a style={{'fontSize': 'xx-large'}} className='mobileVisible' onClick={onMenuPress}>&lt;</a>
        <a href='/' onClick={onMenuPress}><h2>Home</h2></a>
        <a href='/store' onClick={onMenuPress}><h2>Store</h2></a>
        <a href='/equipment' onClick={onMenuPress}><h2>Equipment</h2></a>
        {
          (getUser() && (getUser().role == 'OWNER' || getUser().role == 'EDITOR'))? <a href='/users' onClick={onMenuPress}><h2>Users</h2></a> : ''
        }
        {
          (getUser() && (getUser().role == 'OWNER'))? <a href='/views' onClick={onMenuPress}><h2>Views</h2></a> : ''
        }
        <a href='/#rigging' onClick={onMenuPress}><h2>Rigging Services</h2></a>
        <a href='/#about' onClick={onMenuPress}><h2>About Us</h2></a>
        <a href='/#contact' onClick={onMenuPress}><h2>Contact Us</h2></a>

        <div className='navlogin'>
        {
          getUser()? <a> <span onClick={editUser} style={{cursor: 'pointer'}}>Welcome {getUser().firstName}!</span> <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span> <span style={{cursor: 'pointer'}} onClick={logout}>Logout</span> </a> :
          <a style={{cursor: 'pointer', paddingLeft: '35%', paddingRight: '35%', paddingTop: '15%', paddingBottom:'15%'}} href='/login'>Login</a>
        }
      </div>
      </div>

      <div id={menu?'' : 'menuHidden'} className='search'>
        <input type='text' placeholder='Search Tools' onFocus={receivedFocus} onChange={onSearchUpdate}/>
        <img src={searchIcon}/>
      </div>

      <div className='mobileHidden'>
        <div className='navlogin'>
          {
            getUser()? <a> <span onClick={editUser} style={{cursor: 'pointer'}}>Welcome {getUser().firstName}!</span> <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span> <span style={{cursor: 'pointer'}} onClick={logout}>Logout</span> </a> :
            <a style={{cursor: 'pointer', paddingLeft: '35%', paddingRight: '35%', paddingTop: '15%', paddingBottom:'15%'}} href='/login'>Login</a>
          }
        </div>
      </div>
    </div>
  );
}

export default Nav;