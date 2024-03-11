import React, { useState } from 'react';
import './App.css'
import StarContainer from './StarContainer';
import Product from './Product';
import { Link, useNavigate } from 'react-router-dom';

const ToolBox = (props) => {
  const dataToSend = { message: 'Hello from Parent!' };
  const [newImg, setNewImg] = useState('');
  const navigate = useNavigate();

  useState([newImg]);

  function fetchImage(){
    return fetch("https://www.usedtooling.com/api/getimage?pid=" + props.value.id).then(response => response.text()).then(img => setNewImg(img));
  };
  const navigateToChild = () => {
    navigate("/product", {state: {data: props.value}});
  };
  return (
    <div onClick={navigateToChild} className="toolBox">
      <img src={props.value.image == "https://ir.ebaystatic.com/cr/v/c1/s_1x2.gif"? fetchImage():props.value.image}/>
      <h3>{props.value.title}</h3>
      <h3>{props.value.price}</h3>
      {/*<StarContainer />*/}
      <button onClick={navigateToChild}>View the product</button>
    </div>
  );
}

export default ToolBox;