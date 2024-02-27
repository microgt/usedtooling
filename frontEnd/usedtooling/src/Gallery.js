import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import './App.css'
import playbtn from './playbtn.png'

let nav = [];




const NewTools = (eq) => {
  const [index, setIndex] = useState(0);
  const [pics, setPics] = useState([]);

  useEffect(()=>{
    setPics(eq.equipment.eq.pictures.map(picture => "http://69.18.26.126:8080/loadimg?imageurl="+picture));
  }, []);

  let timer;

  const navClick = ((i) =>{
    setIndex(parseInt(i.target.id));
    populateNav(index);
    clearTimeout(timer);
  });

  const generateDot = (className, i)=>{
    return (
        pics.length > 0 && pics[i].split('.')[pics[i].split('.').length-1] === 'mp4'?
        <img className={className} id={i} onClick={navClick} src={playbtn}/>
        :
        <img className={className} id={i} onClick={navClick} src={pics[i]}/>      
    );
  };

  function populateNav() {
    nav = pics.map((x, y)=>{
    if(y == index){
      return generateDot("gdotCurrent", y);
    }else{
      return generateDot("gdot", y);
    }});
  }

  populateNav(index);

  useEffect(() => {
    advancePreview();
  },[index]);

  function advancePreview(){
    timer = setTimeout(() => {
      setIndex(index + 1);
      if(index +1 == pics.length) setIndex(0);
      populateNav(index);
    }, 10000);
  }

  function pause(){
    clearTimeout(timer);
  }

  return (
    <div className="picgallery">
      {
        pics.length > 0 && pics[index].split('.')[pics[index].split('.').length-1] === 'mp4'?
        <ReactPlayer onPlay={pause} onEnded={advancePreview} key={Math.random()} className='active' url={pics[index]} controls={true}/>
        :
        <img key={Math.random()} className="active" src={pics[index]}/>
      }
        
        <div className='gdots'> {nav} </div> 
    </div>
  );
}

export default NewTools;