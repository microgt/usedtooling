import { useEffect, useState } from 'react';
import './App.css'

const ContactForm = () => {
const [formData, setData] = useState({
  name: "",
  contact: "",
  subject: "",
  message: ""
});

const[responseMessage, setResonseMessage] = useState("");

const handleSubmit = async (e) =>{
  e.preventDefault();

  setData({
    name: e.target.elements.name.value,
    contact: e.target.elements.contact.value,
    subject: e.target.elements.subject.value,
    message: e.target.elements.message.value
  });

  try{
    const response = await fetch('https://www.usedtooling.com/api/sendMessage',
    {
      method: 'POST',
      headers: {
        'content-Type' : 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(data => data.text()).then(resMessage => {
      setResonseMessage(resMessage);
      const timer = setTimeout(() => {
        setResonseMessage("");
        clearTimeout(timer);
      }, 4000);
      setData({
        name: "",
        contact: "",
        subject: "",
        message: ""
      });
    });
  }catch(error){
    setResonseMessage("Error submitting form", error);
  }
}

  return (
    <div className='ContactForm'>
            <a>Contact Us</a>

        <div className='contactFormContents'>
          <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setData({ ...formData, name: e.target.value })} required size="44"/>
                  </div>
                  <div>
                    <label htmlFor="subject">Subject:</label>
                    <input type="text" id="subject" name="contact" value={formData.subject} onChange={(e) => setData({ ...formData, subject: e.target.value })} required size="44"/>
                  </div>
                  <div>
                    <label htmlFor="email">Email Address:</label>
                    <input type="email" id="contact" name="contact" value={formData.contact} onChange={(e) => setData({ ...formData, contact: e.target.value })} required size="44"/>
                  </div>
                  <div>
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" value={formData.message} onChange={(e) => setData({ ...formData, message: e.target.value })} required rows="15" cols="50"></textarea>
                  </div>
                  <div className='sendButton'>
                    <button type="submit">Send</button>
                  </div>

                  {<p style={{ color: 'green' }}>{responseMessage}</p>}
          </form>
        </div>
      
    </div>
  );
}

export default ContactForm;