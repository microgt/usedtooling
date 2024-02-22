import { useEffect, useState } from 'react';
import Header from './Header.js';
import Nav from './Nav.js';
import Footer from './Footer.js';
import { useLocation } from 'react-router-dom';
import './App.css'

const Product = () => {
  const location = useLocation();
  const product = location.state?.data || {};
  const [info, setInfo] = useState({});

  useEffect(()=>{
    fetch("http://69.18.26.126:8080/product?purl="+product.url, {
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

        setInfo(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
      }, []);

  return (
    <div className='Home'>
          <Header />
          <Nav />
            <div className='productContent'>
                <div className='topInfo'>
                    <div className='leftInfo'>
                        <h2>{product.title}</h2>
                        <h2>{product.price}</h2>
                        <div className='ebayButtons'>
                            <a id='boeb' href={info.buyButtonUrl}>Buy On Ebay</a>
                            <a id='voeb' href={info.makeOfferButtonUrl}>Make An Offer On Ebay</a>
                            <a id='boeb' href={product.url}>View On Ebay</a>
                        </div>
                    </div>
                    <img src={product.image}/>
                </div>
                <div>
                  
                </div>
                <iframe id='pdesc' src={info.description}></iframe>
            </div>
          <Footer />
    </div>
  );
}

export default Product;