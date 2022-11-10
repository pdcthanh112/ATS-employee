import React, { useState } from 'react'

import ShowMoreIcon from '../../../assets/icon/showMore.png'

const ShowRequirment = ({ title, content }) => {

  const [isShowContent, setIsShowContent] = useState(false)

  return (
    <React.Fragment>
      <div className='inline-flex font-medium hover:cursor-pointer hover:underline hover:text-[#17580d]' onClick={() => { setIsShowContent(!isShowContent) }}>
        <span>{title}</span>
        <img src={ShowMoreIcon} alt='' style={{ width: '1rem', height: '1rem', marginTop: '5px', marginLeft: '0.5rem' }} />
      </div>
      {isShowContent && <div className='px-4'>{content}</div>}
    </React.Fragment>
  )
}

export default ShowRequirment