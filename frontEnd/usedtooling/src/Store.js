import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import ToolBox from './ToolBox.js';
import './App.css'

const Store = () => {


  const [items, setItems] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(20);
  const [isScrolled, setIsScrolled] = useState(Math.random());
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("date");
  let timer;

  function onFilterChange(event){
    setFilter(event.target.options[event.target.selectedIndex].attributes.name.value);
  }

  function handleSearch(query){
    clearTimeout(timer);
     timer = setTimeout(() => {
      setQ(query);
    }, 2000);
    
    if(query.length<1){
      setItems([]);
    }
    setStart(1);
  }

  
  
  useEffect(()=>{
    
    const url = function () {
      if(q.length <= 0) {
        return'https://www.usedtooling.com/api/getnew?start='+start+'&end='+end;
      }else{
        return'https://www.usedtooling.com/api/search?q=' + q;
      }
    }();
    fetch(url, {
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
        if(q.length > 0) {
          setItems([...data]);
        }else{
          setItems(([...items, ...data]));
        } 
    }) 
    .catch(error => {
        console.error('Fetch error:', error);
    });
      }, [q ,isScrolled]);

  useEffect(()=>{
    setBoxes(items.sort((item1, item2)=> {
      switch (filter){
        case 'date':
          return item1.id2 - item1.id;
          break;
        case 'lowprice':
          return parseFloat(item1.price.split("$")[1].replace(',','')) > parseFloat(item2.price.split("$")[1].replace(',',''))? 1:-1;
          break;
        case 'highprice':
          return parseFloat(item1.price.split("$")[1].replace(',','')) > parseFloat(item2.price.split("$")[1].replace(',',''))? -1:1;
          break;
        case 'atoz':
          return item1.title > item2.title? 1:-1;
          break;
        case 'ztoa':
          return item1.title > item2.title? -1:1;
          break;
      }
    })
      .map(item => <ToolBox key={Math.random()} value={item}/>));
  }, [items, filter]);

  window.addEventListener('scroll', loadMore);

    function loadMore(){
      if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
          setStart(start+1);
          setIsScrolled(Math.random());
      }
    }
  
  return (
    <div className='Home'>
          <Header />
          <Nav onInputChange={handleSearch}/>
          <div className='filterbar'>
            <label htmlFor='filterby'>Filter by: </label>
            <select name='filterby' onChange={onFilterChange}>
              <option name='date' defaultValue="selected">Date added</option>
              <option name='lowprice'>Price; low to high</option>
              <option name='highprice'>Price; high to low</option>
              <option name='atoz'>Alphabetically; A to Z</option>
              <option name='ztoa'>Alphabetically; Z to A</option>
            </select>
          </div>
          {q.length > 0? <div className='icount'><h3>{boxes.length} results</h3></div>: ""}
          <div className='ContactForm'>
            <a>Store</a>

              <div className='storeContent'>
                {boxes}
              </div>
      
          </div>  
          <Footer />
    </div>
  );
}

export default Store;