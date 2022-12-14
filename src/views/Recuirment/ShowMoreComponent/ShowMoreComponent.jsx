import React, { useState } from 'react'

import ShowMoreIcon from '../../../assets/icon/showMore.png'

const ShowRequirment = ({ title, content }) => {

  const [isShowContent, setIsShowContent] = useState(false)

  return (
    <div className='mt-2'>
      <div className='inline-flex font-medium hover:cursor-pointer hover:underline hover:text-[#17580d]' onClick={() => { setIsShowContent(!isShowContent) }}>
        <span className=''>{title}</span>
        <img src={ShowMoreIcon} alt='' style={{ width: '1rem', height: '1rem', marginTop: '5px', marginLeft: '0.5rem' }} />
      </div>
      {isShowContent && <div className='px-4'>{content.split("\n").map((item) => (<div>{item}</div>))}</div>}
    </div>
  )
}

export default ShowRequirment