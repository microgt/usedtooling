import React, { useEffect, useState } from 'react';
import './App.css'
import ToolBox from './ToolBox';

const NewTools = () => {

  const [items, setItems] = useState([]);
  const [boxPosition, setBoxPosition] = useState(-125);
  const [boxes, setBoxes] = useState([]); 

  useEffect(()=>{
    fetch('http://69.18.26.126:8080/getnew', {
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
      setBoxes(items.map(item => <ToolBox value={item}/>));
  }, [items]);

  function moveLeft(){
      let newPos = boxPosition +25;
      if(newPos > 0) newPos = 0;
      if(newPos < -125) newPos = -125;
      setBoxPosition(newPos);
  }
    function moveRight(){
        let newPos = boxPosition -25;
        if(newPos > 0) newPos = 0;
        if(newPos < -125) newPos = -125;
        setBoxPosition(newPos);
  }

  return (
    <div className="newTools">
      <a>New Tools</a>
      <div className='tools'>
        <button onClick={moveRight} id='lt'>&lt;</button>
          <div style={{translate: boxPosition+"%", display: 'flex'}}> 
            {boxes}
          </div>
        <button onClick={moveLeft} id='gt'>&gt;</button>
      </div>
    </div>
  );
}


export default NewTools;