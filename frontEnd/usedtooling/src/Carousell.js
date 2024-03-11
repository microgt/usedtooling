import { useEffect, useState } from 'react';
import './App.css'
import p1 from './c1.jpg';
import p2 from './c2.jpg';
import p3 from './c3.jpg';
import p4 from './c4.jpg';
const pics = [p1, p2, p3, p4];
let nav = [];




const NewTools = () => {
  const [index, setIndex] = useState(0);

  let timer;

  const navClick = ((i) =>{
    setIndex(parseInt(i.target.id));
    populateNav(index);
    clearTimeout(timer);
  });

  const generateDot = (className, i)=>{
    return (
      <a key={Math.random()} className={className} id={i} onClick={navClick}></a>
    );
  };

  function populateNav() {
    nav = pics.map((x, y)=>{
    if(y == index){
      return generateDot("dotCurrent", y);
    }else{
      return generateDot("dot", y);
    }});
  }

  populateNav(index);

  useEffect(() => {
    timer = setTimeout(() => {
      setIndex(index + 1);
      if(index +1 == pics.length) setIndex(0);
      populateNav(index);
    }, 10000);
  },[index]);

  return (
    <div className="gallery mobileHidden">
        <img key={Math.random()} className="active" src={pics[index]}/>
        <div className='dots'> {nav} </div> 
    </div>
  );
}

export default NewTools;