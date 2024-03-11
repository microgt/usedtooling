import React, { useEffect, useState } from 'react';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import './App.css'
import { useNavigate } from 'react-router-dom';

const Views = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split('T')[0];
  const [boxes, setBoxes] = useState([]);
  const [date, setDate] = useState(currentDate);
  const [dateTo, setDateTo] = useState(currentDate);
  const [sort, setSort] = useState('recent');
  const [filter, setFilter] = useState(['All', '']);
  const GEO_DISTANCE = 50;

  async function getAllViews(){
    const formData = new FormData();
    formData.append('token', getAuthToken()? getAuthToken() : null);
    formData.append('user', getUser()? getUser().userName : "");
    formData.append('date', date);
    formData.append('dateTo', dateTo);
    const response = await fetch('https://www.usedtooling.com/api/views', {method: 'POST', body: formData});
    
    const responseData = await response.json();
    const filteredData = responseData.filter(a => filterHelper(a));
    const sortedDate = filteredData.sort((a, b) => sortHelper(a, b));
    setBoxes(sortedDate.map(v => <div className='view' key={Math.random()}>
      <a title={v.vip} name='IP' onClick={updateFilter}>{v.ip}</a>
      <a title={v.url} name='URL' onClick={updateFilter}>{v.url}</a>
      <a title={formatAgent(v.agent)} name='Device' onClick={updateFilter}>{formatAgent(v.agent)}</a>
      <a title={v.user? v.user.userName : 'None'} name='Username' onClick={updateFilter}>{v.user? v.user.userName : 'None'}</a>
      <div style={{display:'flex', gap:'15%'}}>
          <a onClick={updateFilter} name='Distance'>{(v.lon != null)? v.lat + ", " + v.lon : 'Unavailable'}</a>
          {(v.lon != null)?
          <a style={{color:'darkred'}} href={(v.lon != null)?'https://www.openstreetmap.org/#map=18/'+ v.lat +'/'+ v.lon : ''} target={(v.lon != null)?'_blank' : ''}>&#10687;</a> : ''}
      </div>
      <a title={v.country} name='Country' onClick={updateFilter}>{v.country}</a>
      <a title={v.regionName} name='Region' onClick={updateFilter}>{v.regionName}</a>
      <a title={v.city} name='City' onClick={updateFilter}>{v.city}</a>
      <a title={v.zip} name='Zip' onClick={updateFilter}>{v.zip}</a>

      <a name='Time' onClick={updateFilter}>{formatDate(v.dateTime)}</a>
    </div>));
  }

  function formatDate(date){
    const d = date.split('T');
    const t = d[1];
    return d[0].replaceAll('-', '/') + ' - ' + t.substring(0, t.length -10);
  }

  function formatAgent(agent){
    const a = agent.split(' (');
    return a[1]? a[1].split(') ')[0] : 'Unavailable';
  }

  function filterHelper(a){
    if(filter[0] === 'All') return true;
    if(filter[0] === 'IP') return a.ip === filter[1];
    if(filter[0] === 'URL') return a.url === filter[1];
    if(filter[0] === 'Device') return (a.agent? a.agent.includes(filter[1]) : 'Unavailable' === filter[1]);
    if(filter[0] === 'Username') return (a.user? a.user.userName === filter[1] : 'None' === filter[1]);
    if(filter[0] === 'Time') return (a.dateTime.includes(filter[1].replaceAll('/', '-').split(' - ').join('T')));
    if(filter[0] === 'Distance'){
      if(!a.lon || filter[1] === 'null, null') return false;
      const coordinates = {latitude: a.lat, longitude: a.lon};
      const bCoords = filter[1].split(', ');
      const baseCoordinates = {latitude: bCoords[1], longitude: bCoords[0]};
      const distance = haversineDistance(baseCoordinates, coordinates);
      return distance <= GEO_DISTANCE;
    }
    if(filter[0] === 'Country') return a.country === filter[1];
    if(filter[0] === 'Region') return a.regionName === filter[1];
    if(filter[0] === 'City') return a.city === filter[1];
    if(filter[0] === 'Zip') return a.zip === filter[1];
  }

  function sortHelper(a, b){
    if(sort === 'recent') return (new Date(b.dateTime) - new Date(a.dateTime));
    if(sort === 'oldest') return (new Date(a.dateTime) - new Date(b.dateTime));
    if(sort === 'userasc') return (a.user? a.user.userName.localeCompare(b.user? b.user.userName : 'None') : 'None'.localeCompare(b.user? b.user.userName : 'None'));
    if(sort === 'userdes') return (b.user? b.user.userName.localeCompare(a.user? a.user.userName : 'None') : 'None'.localeCompare(a.user? a.user.userName : 'None'));
    if(sort === 'urlasc') return a.url.localeCompare(b.url);
    if(sort === 'urldes') return b.url.localeCompare(a.url);
    if(sort === 'ipasc') return a.ip.localeCompare(b.ip);
    if(sort === 'ipdes') return b.ip.localeCompare(a.ip);
    if(sort === 'devasc') return (a.agent? a.agent.localeCompare(b.agent) : 'Unavailable'.localeCompare(b.agent? b.agent : 'Unavailable'));
    if(sort === 'devdes') return (b.agent? b.agent.localeCompare(a.agent) : 'Unavailable'.localeCompare(a.agent? a.agent : 'Unavailable'));
  }

  // Function to calculate the distance between two sets of coordinates using the Haversine formula
  const haversineDistance = (coord1, coord2) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRadians(coord2.latitude - coord1.latitude);
    const dLon = toRadians(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in miles
    return distance;
  };

  const toRadians = (degree) => {
    return degree * (Math.PI / 180);
  };
// End of radius logic

  const getUser = () => {
    return JSON.parse(window.localStorage.getItem('auth_user'));
  };

  useEffect(()=>{
    if(getUser() && getUser().role ==='OWNER'){
      getAllViews();
    }else{
      navigate('/');
    }
  }, [date, dateTo, sort, filter]);  

  const getAuthToken = () =>{
    return window.localStorage.getItem('auth_token');
  };

  function refreshViews(e){
    e.preventDefault();
    setDate(e.target.value);
  }
  function refreshViewsTo(e){
    e.preventDefault();
    setDateTo(e.target.value);
  }

  function updateSort(e){
    e.preventDefault();
    setSort(e.target.value);
  }

  function clearFilter(e){
    e.preventDefault();
    setFilter(['All', '']);
  }
  
  function updateFilter(e){
    e.preventDefault();
    setFilter([e.target.name, e.target.text]);
  }

  return (
    <div className="Views">
      <Header />
      <Nav />
      <a>Site Views</a>
      <div className='viewcontrols'>
        <h3>{boxes.length? boxes.length : 0} Views</h3>

        <div className='dateselect'>
          <label htmlFor='from'>Date From: </label>
          <input onChange={refreshViews} value={date} type='date' name='from'/>
          <label htmlFor='to'>Date To: </label>
          <input onChange={refreshViewsTo} value={dateTo} type='date' name='to'/>
        </div>
        
        <div>
          <label htmlFor='sort'>Sort By: </label>
          <select onChange={updateSort} name='sort' value={sort}>
            <option value='recent'>Most Recent First</option>
            <option value='oldest'>Oldest First</option>
            <option value='userasc'>Username Ascending</option>
            <option value='userdes'>Username Descending</option>
            <option value='urlasc'>URL Ascending</option>
            <option value='urldes'>URL Descending</option>
            <option value='ipasc'>IP Ascending</option>
            <option value='ipdes'>IP Descending</option>
            <option value='devasc'>User Device Ascending</option>
            <option value='devdes'>User Device Descending</option>
          </select>
        </div>
        
          {
            filter[0] !== 'All'? <div><label>Filter By: {filter[0]}</label><button className='clearFiltersBtn' onClick={clearFilter}>Clear Filter</button></div> : ''
          }
      </div>
      <div className='viewdisplay'>
        <div className='view'>
          <h3>IP</h3>
          <h3>URL</h3>
          <h3>Device</h3>
          <h3>User</h3>
          <h3>Location</h3>
          <h3>country</h3>
          <h3>Region</h3>
          <h3>City</h3>
          <h3>zip</h3>
          <h3>Time</h3>
        </div>
        {
          boxes
        }
      </div>
      
      <Footer />
    </div>
  );
}

export default Views;