import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import ToolBox from './ToolBox.js';
import './App.css'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Description, GavelSharp, Margin } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import Gallery from './Gallery.js'; 


const EditEquipment = () => {

  const location = useLocation();
  const [equipment, setEquipment] = useState(location.state?.data || {});
  const [pics, setpics] = useState([]);
  useEffect(()=>setpics(equipment.pictures),[equipment]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function prepareData(props){
      props.preventDefault();

      const formData = new FormData();
      formData.append('id', equipment.id);
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

  function handleInputChange(e) {
    switch (e.target.name) {
      case 'name':
        setEquipment((prevState) => ({ ...prevState, name: e.target.value }));
        break;
      case 'description':
        setEquipment((prevState) => ({ ...prevState, description: e.target.value }));
        break;
      case 'category':
        setEquipment((prevState) => ({ ...prevState, category: e.target.value }));
        break;
      case 'price':
        setEquipment((prevState) => ({ ...prevState, price: e.target.value }));
        break;
      default:
        break;
    }
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
                    <h3>SKU: {equipment.id}</h3>
                    <label for='name'>Name: </label>
                    <input required type='text' onChange={handleInputChange} name='name' value={equipment.name}/>
                    <label for='description'>Description: </label>
                    <textarea required type='text' rows="15" cols="100" onChange={handleInputChange} placeholder='description' name='description' value={equipment.description}/>
                    
                    <label for='category'>Category: </label>
                    <select required name='category' onChange={handleInputChange} value={equipment.category}>
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
                    <input type='price' onChange={handleInputChange} name='price' value={equipment.price}/>
                    
                    <label id='upSelectBtn'  htmlFor='fileinput'>Select Pictures</label>
                    <input id='fileinput' type='file' multiple name='x' accept='image/png, image/jpeg video/mp4' onChange={updatePics} style={{display: 'none'}} />
                    <div id='uploadedpics'>
                        {pics.length > 0? <h5>{pics.length + " Items"}</h5> : ""}
                        {pics.map(pic => <img src={URL.createObjectURL(pic)} />)}
                    </div>
                    <input type='button' onClick={clearPics} value='Clear Pictures' style={{padding:'3%', margin: '2%'}}/>
                    <input type='submit' style={{padding:'3%', margin: '2%'}} value="Save Changes"/>
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

export default EditEquipment;