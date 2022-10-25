import React, { useState } from 'react'

import ShowMoreIcon from '../../../../../assets/icon/showMore.png'

const ShowDescription = ({ description }) => {

  const [isShowContent, setIsShowContent] = useState(false)

  return (
    <div className='description'>
      <label className='inline-flex font-medium hover:cursor-pointer hover:underline hover:text-[#17580d]' onClick={() => {setIsShowContent(!isShowContent)}}>Description<img src={ShowMoreIcon} alt='' style={{ width: '1rem', height: '1rem', marginTop: '5px', marginLeft: '0.6rem' }} /></label>
      {isShowContent && <div className='px-4'>{description}</div>}
    </div>
  )
}

export default ShowDescription