import React from "react";
import './AppHeader.scss'
import logo from '../../assets/image/big-logo.png'

const AppHeader = () => {

  return (  
    <div className="header-container">
      <a href="/#/dashboard"><img src={logo} alt='' width={'180rem'} className='ml-10'/></a>
    </div>
  );
};

export default AppHeader;
