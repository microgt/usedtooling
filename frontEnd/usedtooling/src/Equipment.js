import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import './App.css'
import { Link, json } from 'react-router-dom';
import EquipmentBox from './EquipmentBox.js';
import { useLocation } from 'react-router-dom';

const Equipment = () => {

  const location = useLocation();
  const [startPage, setStartPage] = useState(0);
  const [equipment, setEquipment] = useState([]);
  const [rando, setRando] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const [initialVAlue, setInitialValue] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('datenew');

  useEffect(()=>{
    if(location.state && location.state.data){
      const data = {target: {value: location.state.data}}
      handleSearch(data);
    }
  }, [location.state]);
  
  useEffect(()=>{
    fetch('https://www.usedtooling.com/api/allequipment?start='+ startPage+'&end=5',{method: 'GET',
  mode: 'cors',
  headers: {
      'Content-Type': 'application/json',
  }}).then(response => response.json())
  .then(res => setEquipment([...res]));
  },[startPage, rando]);
  
  useEffect(()=>{
    setBoxes(equipment.map(e=><EquipmentBox value={e} key={Math.random()} onUpdate={updatePage} />));
  }, [equipment]);

  function moveForward(){
    if(boxes.length <= 0){
      setStartPage(startPage-1);
      return;
    }
    (boxes.length < 5)? setStartPage(startPage) : setStartPage(startPage+1);
  }
  function moveBackwords(){
    if(startPage > 0) setStartPage(startPage-1);
  }

  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };

  function updatePage(){
    setRando(Math.random());
  }

  function handleSearch(e){
    if(e.preventDefault) e.preventDefault();
    const filter = e.target.value? e.target.value: initialVAlue;
    if(filter) setInitialValue(filter);
    const terms = [];
    if(searchTerm.length >0) terms.push('esterm='+searchTerm);
    if(filter && filter !='ALL') terms.push('cterm='+filter);
    terms.push('sort='+ sort);

    const phrase = terms.length > 1? terms.join('&&') : terms[0];
    fetch('https://www.usedtooling.com/api/esearch?'+phrase
    ,{method: 'GET',
      mode: 'cors',
      headers: {
      'Content-Type': 'application/json',
  }}).then(response => response.json())
  .then(res => setEquipment([...res]))
  }

  function handleInputChange(e){
    e.preventDefault();
      setSearchTerm(e.target.value);
  }
  
  function handleSort(e){
    if(e.preventDefault) e.preventDefault();
    setSort(e.target.value);
    handleSearch({target:{value:initialVAlue}});
  }
  function resetSort(e){
    e.preventDefault();
    setSort('datenew');
    handleSort({target: {value: 'datenew'}});
  }
  return (
    <div className='Home'>
          <Header />
          <Nav onInputChange={handleSearch}/>
          <div className='equipment'>
            <a>Equipment</a>
              <div className='equipmentcontrols'>
                
                {
                  (getUser() && getUser().role !== 'USER')?
                    <a href='/addequipment'>Add Equipment</a>
                  :
                  ''
                }
                
                <form onSubmit={handleSearch}>
                  <input type='text' name='esterm' onClick={resetSort} value={searchTerm} onChange={handleInputChange} placeholder='Search Equipment'/>
                  <input type='submit' value='Search'/>
                  <label htmlFor='category'>Equipment Category: </label>
                  <select name='category' onClick={resetSort} value={initialVAlue} onChange={handleSearch}>
                      <option value='ALL'>All Equipment</option>
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
                <label htmlFor='sort'>Sort By: </label>
                <select name='sort' value={sort} onChange={handleSort}>
                      <option value='datenew'>Date Added (Newest First)</option>
                      <option value='dateold'>Date Added (Oldest First)</option>
                      <option value='pricelow'>Price (Lowest First)</option>
                      <option value='pricehigh'>Price (Highest First)</option>
                      <option value='alphaa'>Alphabetically (A to Z)</option>
                      <option value='alphaz'>Alphabetically (Z to A)</option>
                </select>
                </form>
              </div>
              <div className='equipmentContent'>
                {boxes}
              </div>
              {
                (equipment.length > 5)? 
                <div></div>
                :
                <div className='pageControls'>
                  <a onClick={moveBackwords}>
                  &lt; Previous Page
                  </a>
                  <a>{startPage+1}</a>
                  <a onClick={moveForward}>
                    Next Page &gt;
                  </a>
                </div>
              }
              
          </div>  
          <Footer />
    </div>
  );
}

export default Equipment;