import React, { useState } from 'react'

import ShowMoreIcon from '../../../../../assets/icon/showMore.png'

const ShowRequirment = ({ requirment }) => {

  const [isShowContent, setIsShowContent] = useState(false)

  return (
    <div className='requirment'>
      <label className='inline-flex font-medium hover:cursor-pointer hover:underline hover:text-[#17580d]' onClick={() => {setIsShowContent(!isShowContent)}}>Requirment<img src={ShowMoreIcon} alt='' style={{ width: '1rem', height: '1rem', marginTop: '5px', marginLeft: '0.5rem' }} /></label>
      {isShowContent && <div className='px-4'>{requirment}</div>}
    </div>
  )
}

export default ShowRequirment