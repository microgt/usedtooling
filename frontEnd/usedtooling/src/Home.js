import Header from './Header.js';
import Nav from './Nav.js';
import NewTools from './NewTools.js';
import RiggingServices from './RiggingServices.js';
import Carousell from './Carousell.js';
import AboutUs from './AboutUs.js';
import ContactUs from './ContactUs.js';
import Footer from './Footer.js';
import './App.css';

export default function Home() {

  return (
    <div className='Home'>
      <Header />
      <Nav />
      <Carousell/>
      <NewTools />
      <RiggingServices />
      <AboutUs />
      <ContactUs />
      <Footer />
    </div>
  );
}

