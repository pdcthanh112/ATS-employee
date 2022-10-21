import React from 'react'
import './CandidatePage.scss'

import CandidateIcon from '../../../assets/icon/candidate.png'

const CandidatePage = () => {
  return (
    <div>
      <div className='font-medium text-3xl inline-flex px-3 py-2'>
        Candidate
        <img src={CandidateIcon} alt='' width={'30rem'}/>
        </div>
    </div>
  )
}

export default CandidatePage