import React from 'react';
import fbIcon from './facebook.png';
import ytIcon from './youtube.png';
import './App.css'

const Footer = () => {
  return (
    <div className="Footer">
      <div className='footerLinks'>
        <a href="/">Home</a>
        <a href='/store'>Store</a>
        <a href='/#rigging'>Rigging Services</a>
        <a href='/#about'>About Us</a>
        <a href='/#contact'>Contact Us</a>
      </div>
      <div className='flavor'><p>Welcome to Anderson Tooling, your premier destination for professional services and top-tier parts tailored for trade and industry professionals. Renowned as a regional leader in rigging, logistics, tools, and parts, Anderson Tooling thrives on its commitment to innovative strength and a relentless pace of innovation.

As a seasoned professional, the expectations placed upon you demand qualities such as speed, reliability, competence, and endurance – qualities that mirror the excellence you strive to achieve in your work. In this regard, we believe it is only equitable to expect the same level of performance from your tools.

Enter Anderson Tooling's professional services and parts, meticulously designed to ensure tasks are executed flawlessly, adhering to the highest standards of speed, precision, and robustness. Our commitment is to empower you with the tools and services that embody the ethos of Revitalize, Reuse, and Revamp, enabling you to consistently achieve outstanding professional results.</p></div>
      <div className='copyrights'>&#169; Anderson Tooling 2023, all rights reserved</div>
      <div className='socialMedia'>
          <a href='https://www.facebook.com/Andersontoolinginc/'>
            <img src={fbIcon}/>
          </a>
          <a href='https://www.youtube.com/@usedtooling'>
            <img src={ytIcon}/> 
          </a>
      </div>
    </div>
  );
}

export default Footer;