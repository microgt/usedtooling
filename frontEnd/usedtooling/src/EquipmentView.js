import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import { useLocation } from 'react-router-dom';
import './App.css'
import Gallery from './Gallery.js';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Product = () => {
  const location = useLocation();
  const equipment = location.state?.data || {};
  const navigate = useNavigate();

  function deleteEquipment(e){
    e.preventDefault();
    if(window.confirm("Are You Sure You Want To Remove This Item?") == true) confirmDelete(e.target.name);
  }

  function confirmDelete(id){
    const formData = new FormData();
    formData.append('eid', id);
    fetch('https://www.usedtooling.com/api/deleteequipment', {
      method : 'POST',
      body : formData
    }).then(response => response.text()).then(text => navigate("/equipment"));
  }

  async  function editequipment(){
    equipment.pictures = await Promise.all(
      equipment.pictures.map(async (p) => {
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
    navigate('/editequipment', {state: {data: equipment}});
  }

  const listCategory = (e) => {
    navigate("/equipment", {state: {data: e.target.id}});
  }
  
  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };

  return (
    <div className='Home'>
          <Header />
          <Nav />
            <div className='productContent'>
                <div className='etopInfo'>
                    <div className='leftInfo'>
                        <h2>{equipment.name}</h2>
                        <h4>SKU: {equipment.id}</h4>
                        <h2>Price: {equipment.price != '0'?'$'+equipment.price : "Contact Us For a Quote"}</h2>
                        <div className='ebayButtons'>
                            <a id='boeb' href='/contact'>Contact Us</a>
                            
                            {(getUser() && getUser().role !== 'USER')? <a id='voeb' className='deletebtn' onClick={deleteEquipment} name={equipment.id}>Remove Item</a>:''}
                            {(getUser() && getUser().role !== 'USER')? <a id='boeb' onClick={editequipment} item={equipment}>Edit Information</a> : ''}
                            
                            
                        </div>
                        <div id='pdesc' style={{marginTop: '10%'}}>
                          <div>
                            <a>Item category:</a> <a id={equipment.category} onClick={listCategory} style={{cursor: 'pointer'}}>{equipment.category.split('_').map(x=>x.substring(0,1)+x.substring(1).toLowerCase()).join(' ')}</a>
                          </div>
                          <div>
                            <h3>Description:</h3><pre>{equipment.description}</pre>
                          </div>
                      </div>
                    </div>
                    <Gallery equipment={{eq: equipment}}/>
                </div>
                <div>
                  
                </div>
                
            </div>
          <Footer />
    </div>
  );
}

export default Product;