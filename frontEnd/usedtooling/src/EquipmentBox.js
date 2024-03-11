import React, { useState } from 'react';
import './App.css'
import { Link, useNavigate } from 'react-router-dom';
import EditEquipment from './EditEquipment';

const ToolBox = (props) => {
  const [newImg, setNewImg] = useState('');
  const navigate = useNavigate();

  useState([newImg]);

  function deleteEquipment(e){
    e.preventDefault();
    if(window.confirm("Are You Sure You Want To Remove This Item?") == true) confirmDelete(e.target.id);
  }

  const getAuthToken = () =>{
    return window.localStorage.getItem('auth_token');
  };
  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };


  async  function editequipment(){
    let d = props.value;
    d.pictures = await Promise.all(
      props.value.pictures.map(async (p) => {
        const response = await fetch(
          "https://www.usedtooling.com/api/loadimg?imageurl=" +
            p
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }
  
        return response.blob();
      })
    );
    navigate('/editequipment', {state: {data: d}});
  }

  function confirmDelete(id){
    const formData = new FormData();
    formData.append('eid', id);
    fetch('https://www.usedtooling.com/api/deleteequipment', {
      method : 'POST',
      body : formData
    }).then(response => response.text()).then(props.onUpdate());
  }

  function fetchImage(){
    return fetch("https://www.usedtooling.com/api/getimage?pid=" + props.value.id).then(response => response.text()).then(img => setNewImg(img));
  };
  const navigateToChild = () => {
    navigate("/equipmentview", {state: {data: props.value}});
  };

  const listCategory = (e) => {
    navigate("/equipment", {state: {data: e.target.id}});
  }

  return (
    <div className="toolBox">
      <img onClick={navigateToChild} src={"https://www.usedtooling.com/api/loadimg?imageurl="+props.value.pictures[0]}/>
      
      {
        (getUser() && getUser().role !== 'USER')?
          <div >
            <a className='deletebtn' onClick={deleteEquipment} id={props.value.id}>&#9746;</a>
            <a className='editbtn' onClick={editequipment} style={{color: 'black'}} item={props.value}>&#9874;</a>
          </div>
        :
        ''
      }
      
      
      <h4 onClick={navigateToChild}>SKU: {props.value.id}</h4>
      <h3 onClick={navigateToChild}>{props.value.name}</h3>
      <h3 onClick={listCategory} id={props.value.category}>{props.value.category.split('_').map(x=> x.substring(0,1) + x.substring(1).toLowerCase()).join(' ')}</h3>
      <h3 onClick={navigateToChild}>{'$'+props.value.price}</h3>
      <button onClick={navigateToChild}>View Equipment</button>
    </div>
  );
}

export default ToolBox;