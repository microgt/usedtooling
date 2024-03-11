import React, { useEffect, useState } from 'react';
import './App.css'

const StarContainer = () => {

  const [data, setData] = useState([]);

  useEffect(()=> {

      let randomNumber = 3* Math.random() +3;
      if(randomNumber > 5) randomNumber = 5;

      let reviewRating = (randomNumber+"").slice(0, 3);

      let blueStarCount = Math.round(randomNumber);
      let greyStarCount = 5 - blueStarCount;

      let reviewCount = Math.round(50 * Math.random() + 1);
      
      const stars = ()=>{
        let s = [];
        for(let i = 0; i < blueStarCount; i++){
          s.push(<span key={Math.random()} className='blueStar'>&#9733;</span>);
        }
        for(let i = 0; i < greyStarCount; i++){
          s.push(<span key={Math.random()} className='greyStar'>&#9733;</span>);
        }
        return s;
      };

      setData({'stars': stars(), 'reviewRating': reviewRating, 'reviewCount': reviewCount});

  }, []);
  
  return (
    <div className="starContainer">
      {data.stars}
      <a>{data.reviewRating}</a>
      <a>({data.reviewCount})</a>
    </div>
  );
}

export default StarContainer;