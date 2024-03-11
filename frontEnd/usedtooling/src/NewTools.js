import React, { useEffect, useState } from 'react';
import './App.css'
import ToolBox from './ToolBox';

const NewTools = () => {

  const [items, setItems] = useState([]);
  const [boxes, setBoxes] = useState([]); 

  useEffect(()=>{
    fetch('https://www.usedtooling.com/api/getnew', {
      method: 'GET',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json',
      },
        }).then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          setItems(data);
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });
  },[]);
  useEffect(()=>{
      setBoxes(items.map(item => <ToolBox key={Math.random()} value={item}/>));
  }, [items]);

  function moveLeft(e){
    e.preventDefault();
    const container = document.querySelector('#newToolsContainer');
    container.scrollLeft +=250;
    console.log("left")
  }
    function moveRight(e){
      e.preventDefault();
      const container = document.querySelector('#newToolsContainer');
      container.scrollLeft -=250;
      console.log('right');
  }

  return (
    <div className="newTools">
      <a href='/store'>New Tools</a>
      <div className='tools'>
        <button onClick={moveRight} id='lt'>&lt;</button>
          <div id='newToolsContainer' style={{overflow: 'scroll', display: 'flex'}}> 
            {boxes}
          </div>
        <button onClick={moveLeft} id='gt'>&gt;</button>
      </div>
    </div>
  );
}


export default NewTools;