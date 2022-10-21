import React from 'react'
import './AppFooter.scss'

import companyLogo from "../../assets/image/big-logo.png"
import facebookLogo from "../../assets/image/facebook-logo.png"
import linkinLogo from "../../assets/image/linkin-logo.png"
import twitterLogo from "../../assets/image/twitter-logo.png"
import instagramLogo from "../../assets/image/instagram-logo.png"
import youtubeLogo from "../../assets/image/youtube-logo.png"

const AppFooter = () => {
  return (
    <div className='footer-container'>
      <div className='footer-left text-center'>
        <div className='inline-flex'>
          <img src={companyLogo} alt='linkin' className='m-4' width='200rem' />
        </div><br />
        <div className='inline-flex'>
          <a href='https://www.facebook.com/CKHRConsulting4.0/'><img src={facebookLogo} alt='linkin' className='m-2 rounded-lg' width='30rem' /></a>
          <a href='https://www.linkedin.com/company/ckhrconsulting/?viewAsMember=true'><img src={linkinLogo} alt='facebook' className='m-2 rounded-lg' width='30rem' /></a>
          <a href='https://twitter.com/ckhrconsulting?s=20'><img src={twitterLogo} alt='twitter' className='m-2 rounded-lg' width='30rem' /></a>
          <a href='https://www.instagram.com/ckhrconsultingmkt/'><img src={instagramLogo} alt='instagram' className='m-2 rounded-lg' width='30rem' /></a>
          <a href='https://www.youtube.com/channel/UCSOOfAOfpondCDHD3kJFWsg'><img src={youtubeLogo} alt='youtube' className='m-2 rounded-lg' width='40rem' /></a>         
        </div>
        <div>
          <span><i className="fa-regular fa-copyright"></i></span>&nbsp;
          <span>2012-2022 CK HR Consulting</span>
        </div>
      </div>
      <div className='footer-right'>
        <div className='footer-right__element'>
          <span><i className="fa-solid fa-location-dot text-2xl"></i></span>
          <span className='ml-2'>Ground Floor, Rosana Building, 60 Nguyen Dinh Chieu, Da Kao Ward, District 1, HCMC, Vietnam</span>
        </div>
        <div className='footer-right__element'>
          <span><i className="fa-solid fa-phone text-2xl"></i></span>
          <span className='ml-2'>Phone: (+8428)7106 8279</span>
        </div>
        <div className='footer-right__element'>
          <span><i className="fa-solid fa-earth-americas text-2xl"></i></span>
          <span className='ml-2'>Website: <a href='https://ckhrconsulting.vn/vi/'>ckhrconsulting.vn</a></span>
        </div>
        <div className='footer-right__element'>
          <span><i className="fa-solid fa-envelope text-2xl"></i></span>
          <span className='ml-2'>Email: info@ckhrconsulting.vn</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AppFooter)
