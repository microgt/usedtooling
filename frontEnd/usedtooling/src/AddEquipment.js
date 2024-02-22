import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import ToolBox from './ToolBox.js';
import './App.css'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Description } from '@mui/icons-material';

const AddEquipment = () => {

  const [pics, setpics] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function prepareData(props){
      props.preventDefault();

      const formData = new FormData();
      formData.append('name', props.target.name.value);
      formData.append('description', props.target.description.value);
      formData.append('category', props.target.category.value);
      formData.append('price', props.target.price.value);
      pics.forEach((pic, index) => {
        formData.append('pics', pic, pic.name);
      });
      
      let timer;
      fetch('http://69.18.26.126:8080/addequipment', {
        method: 'POST',
        body: formData
      }).then(response => response.text()).then(res => {
        setMessage(res + ", Redirecting....");
        timer = setTimeout(redirect, 2000);
      });

      function redirect(){
        clearTimeout(timer);
        navigate("/equipment");
      }
  }

  function updatePics(props){
    setpics([...pics, ...props.target.files]);
  }

  function clearPics(props){
    setpics([]);
  }

  useEffect(()=>{},[pics]);

  return (
    <div className='Home'>
          <Header />
          <Nav />
          <div className='ContactForm'>
            {message === ''? <a>New Equipment</a> : ''}

              {message === ''? 
                <div className='storeContent'>
                  <form onSubmit={prepareData}>
                    <label for='name'>Name: </label>
                    <input required type='text' name='name'/>
                    <label for='description'>Description: </label>
                    <textarea type='text' rows="15" cols="100" name='description'/>

                    <label required for='category'>Category: </label>
                    <select name='category'>
                      <option value='VERTICAL_LATHES'>Vertical Lathes</option>
                      <option value='VERTICAL_BORING_MILLS'>Vertical Boring Mills</option>
                      <option value='SURFACE_GRINDERS'>Surface Grinders</option>
                      <option value='RADIAL_DRILLS'>Radial Drills</option>
                      <option value='PRESS'>Press</option>
                      <option value='POST_DRILL_PRESSES'>Post Drill Pressess</option>
                      <option value='CNC_LATHES'>CNC Lathes</option>
                      <option value='CARBIDE_MILLING_INSERT'>Carbide Milling Insert</option>
                      <option value='BORING_MACHINES'>Boring Machines</option>
                      <option value='CNC_MACHINING_CENTERS'>CNC Machining Centers</option>
                      <option value='HORIZONTAL_BORING_MILLS'>Horizonal Boring Mills</option>
                      <option value='MISCELLANEOUS_EQUIPMENT_AND_MACHINES'>Misellaneous Equipment And Machines</option>
                      <option value='MANUAL_MILLING_MACHINES'>Manual Milling MAchines</option>
                      <option value='KNEE_MILLS'>Knee Mills</option>
                      <option value='BAND_SAWS'>Band Saws</option>
                      <option value='ENGINE_LATHES'>Engine Lathes</option>
                    </select>

                    <label for='price'>Price: </label>
                    <input required type='price' name='price'/>
                    <label id='upSelectBtn' htmlFor='fileinput'>Select Media</label>
                    <input id='fileinput' type='file' multiple name='x' accept='image/png, image/jpeg, video/mp4' onChange={updatePics} style={{display: 'none'}} />
                    <div id='uploadedpics'>
                        {pics.length > 0? <h5>{pics.length + " Items"}</h5> : ""}
                        {pics.map(pic => <img src={URL.createObjectURL(pic)} />)}
                    </div>
                    <input type='button' onClick={clearPics} value='Clear' style={{padding:'3%', margin: '2%'}} />
                    <input type='submit' value="Add Equipment" style={{padding:'3%', margin: '2%'}} />
                  </form>
                </div>
                :
                <a>{message}</a>
              }
              
          </div>  
          <Footer />
    </div>
  );
}

export default AddEquipment;