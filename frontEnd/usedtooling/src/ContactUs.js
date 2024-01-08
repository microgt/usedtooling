import React from 'react';
import './App.css'

const ContactUs = () => {
  return (
    <div id='contact' className="ContactUs">
      <a>Contact Us</a>
      <div className='contactContent'>
        <div className='contactLeft'>
          <h4>Call us on:</h4>
            <span className='phoneIcon'>&#9990;</span><a href="tel:+16414696667">
              Phone: (641)469-6667</a>
              <div className='contactButton'>
                <h4>Or send us a message through our contact form:</h4>
                <a href='/contact' className='emailIcon'>&#128231;</a>
              </div>
            </div>
            <div className='contactRight'>
            <iframe className='map' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.743621900435!2d-91.97332502333369!3d41.008984371350394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87e6661372f6acbb%3A0x19b04f9e3670f9b5!2sAnderson%20Tooling!5e0!3m2!1sen!2sus!4v1702563824081!5m2!1sen!2sus" width="512" height="512" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
      </div>
    </div>
  );
}

export default ContactUs;