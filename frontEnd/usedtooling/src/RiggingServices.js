import React from 'react';
import r1 from './r1.jpg';
import r2 from './r2.jpg';
import './App.css'

const RiggingServices = () => {
  return (
    <div id='rigging' className="riggingServices">
      <a>Rigging Services</a>
      <div className='riggingContent'>
        <p>
        Looking for a reliable rigging and machinery moving service? Anderson Tooling, Inc. has been a trusted provider of rigging services for over two decades, specializing in construction and industrial rigging services and machinery moving. 
        </p>
          <h4>Our services include:</h4>
          <ul>
            <li>Installations, removal and rigging of machinery and equipment all over the United States.</li>
            <li>Plant relocating millwright</li>
            <li>Crating.</li>
            <li>Palletizing.</li>
            <li>Logistics.</li>
            <li>Shipping and export.</li>
          </ul>
        <p>
        </p>
        <p>We are a small company that pays direct attention to our customers needs.</p>
        <p>Our goal is to take the load off the customer by handling there complete project.</p>
        <p>As rigging service professionals, we are dedicated to completing rigging projects safely and on-time.</p>
        <p>Our experienced Master Riggers, operating engineers, teamster drivers, steamfitters and iron workers are highly experienced and excel at turnkey heavy lifting and moving solutions.</p>
        <p>
        Anderson Tooling's Rigging services provide you with complete solutions; From planning to coordination with construction management and general contractors, logistics to implementation, our extensive experience means your next job will be a complete success.
        </p>
      </div>
      <img src={r1}/>
      <img src={r2}/>
      <iframe width="960" height="720" src="https://www.youtube.com/embed/o_4GYKxqFgM?si=78VWY8XHzM0T7uDn" title="Component Transport Demo" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
  );
}

export default RiggingServices;