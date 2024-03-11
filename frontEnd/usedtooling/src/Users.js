import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import './App.css'
import { Link, json } from 'react-router-dom';
import EquipmentBox from './EquipmentBox.js';
import { useLocation, useNavigate } from 'react-router-dom';
import User from './User.js';

const Users = () => {

  const location = useLocation();
  const [startPage, setStartPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [rando, setRando] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('daten');
  const [pFilter, setPFilter] = useState('all');
  const navigate = useNavigate();
  const [rebuild, setRebuild] = useState(0);

  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };
  const getAuthToken = () =>{
    return window.localStorage.getItem('auth_token');
  };


  async function getUsers(){
    await fetch('https://www.usedtooling.com/api/allusers?token=' + getAuthToken()).then(response => response.json()).then(res => {
      if(res && res.length > 0){
        setBoxes(res.filter(f => f.userName !== '')
        //search
        .filter(usr => searchTerm === ''? true : searchHelper(usr))
        //sort
        .sort((usr1, usr2) => sortHelper(usr1, usr2))
        //filter
        .filter(usr => pFilter === 'all'? true : filterHelper(usr))
        .map(u => <User key={Math.random()} value={u}/>))
      }else{
        redirect('/')
      }
    });
  }
  

  function redirect(url){
    navigate(url);
  }







  function updatePage(e){
    e.preventDefault();
    setRebuild(Math.random());
  }

  function handleInputChange(e){
    e.preventDefault();
      setSearchTerm(e.target.value);
      updatePage(e);
  }
  function handleSortChange(e){
    e.preventDefault();
      setSort(e.target.value);
      updatePage(e);
  }
  function handleFilterChange(e){
    e.preventDefault();
    setPFilter(e.target.value);
    updatePage(e);
  }

  useEffect(()=>{getUsers()}, [rebuild]);
  
  function searchHelper(usr){
    if(usr.userName.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    if(usr.firstName.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    if(usr.lastName.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    if(usr.email.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    if(usr.phone.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    return false;
  }
  function sortHelper(usr1, usr2){
    if(sort === 'daten') return usr2.id - usr1.id;
    if(sort === 'dateo') return usr1.id - usr2.id;
    if(sort === 'az') return (usr1.firstName + ' ' + usr1.lastName).localeCompare(usr2.firstName + ' ' + usr2.lastName);
    if(sort === 'za') return (usr2.firstName + ' ' + usr2.lastName).localeCompare(usr1.firstName + ' ' + usr1.lastName);
  }
  function filterHelper(usr){
    return usr.role === pFilter;
  }

  function addusr(){
    navigate('/adduser');
  }

  return (
    <div className='Home'>
          <Header />
          <Nav />
          <div className='equipment'>
            <a>Users</a>
            <div className='usrcontorlbar'>
              <button onClick={addusr}>Add User</button>
              <div>
                <label htmlFor='search'>Search Users: </label>
                <input onChange={handleInputChange} value={searchTerm} type='text' name='search'/>
              </div>
              <div>
                <label htmlFor='sort'>Sort By: </label>
                <select onChange={handleSortChange} name='sort'>
                  <option value='daten'>Date Added (Newest First)</option>
                  <option value='dateo'>Date Added (Oldest First)</option>
                  <option value='az'>Alphabetically (A to Z)</option>
                  <option value='za'>Alphabetically (Z to A)</option>
                </select>
              </div>
              <div>
                <label htmlFor='filter'>Filter By Privilege: </label>
                <select onChange={handleFilterChange} name='filter'>
                  <option value='all'>All</option>
                  <option value='USER'>Users</option>
                  <option value='EDITOR'>Editors</option>
                  <option value='ADMIN'>Admins</option>
                  <option value='OWNER'>Owners</option>
                </select>
              </div>
              <a>Users: {boxes.length}</a>
            </div>
            <div className='userslist'>
                {boxes}
            </div>
              
          </div>  
          <Footer />
    </div>
  );
}

export default Users;