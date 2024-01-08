import { useEffect, useState } from 'react';
import './App.css'
import homeIcon from './homeIcon.png';
import searchIcon from './searchIcon.png';
import menuIcon from './menbutton.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Nav = ({ onInputChange }) => {

  const navigate = useNavigate();
  const location = useLocation();

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
      <a className='mobileHidden' href='/#rigging'><h2>Rigging Services</h2></a>
      <a className='mobileHidden' href='/#about'><h2>About Us</h2></a>
      <a className='mobileHidden' href='/#contact'><h2>Contact Us</h2></a>

      <div className='mobileVisible menum' id={menu?'menuHidden' : 'mobilem'}>
        <a style={{'font-size': 'xx-large', 'padding': '5%'}} className='mobileVisible' onClick={onMenuPress}>&lt;</a>
        <a href='/' onClick={onMenuPress}><h2>Home</h2></a>
        <a href='/store' onClick={onMenuPress}><h2>Store</h2></a>
        <a href='/#rigging' onClick={onMenuPress}><h2>Rigging Services</h2></a>
        <a href='/#about' onClick={onMenuPress}><h2>About Us</h2></a>
        <a href='/#contact' onClick={onMenuPress}><h2>Contact Us</h2></a>
      </div>

      <div id={menu?'' : 'menuHidden'} className='search'>
        <input type='text' placeholder='Search' onFocus={receivedFocus} onChange={onSearchUpdate}/>
        <img src={searchIcon}/>
      </div>
    </div>
  );
}

export default Nav;