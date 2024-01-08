import React from 'react';
import './App.css'
import about from './about.jpg';

const AboutUs = () => {
  return (
    <div id='about' className="AboutUs">
      <a>About Us</a>
      <div className='aboutContent'>
        <p>Anderson Tooling, Inc. is your one stop shop for all your equipment and tooling needs Big or small, we handle it all! </p>
        <p>Whether it is carbide inserts, end mills, tool holders, or entire machines-we can assist you with all your needs. </p>
        <h4>If we don't have it, we can find it. </h4>
        <p>After 30 years in business we've built an extensive network to enable us to supply your needs. </p>
        <p>Need a machine or piece of equipment moved-give us a call; we have a highly trained, professional team of riggers to safely move any piece of equipment you may need to move. </p>
        <h4>Need an entire plant moved? ATI can handle the job!</h4>
      </div>
      <img src={about}/>
    </div>
  );
}

export default AboutUs;