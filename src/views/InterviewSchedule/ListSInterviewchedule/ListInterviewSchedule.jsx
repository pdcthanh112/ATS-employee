import React from 'react'
import './ListInterviewSchedule.scss'

import InterviewIcon from '../../../assets/icon/date-time-icon.png'
import { interviewType } from '../../../utils/constants'

const ListInterviewSchedule = ({ listInterviewSchedule }) => {

  return (
    <div className='listInterview-container'>
      {listInterviewSchedule.map((item) => (
        <div className='listInterview-item'>
          <div className='flex justify-between'>
            <div className='flex'>
              <div>
                <div className='font-semibold text-lg'>{item.date}</div>
                <div className='flex justify-end font-bold text-xl'>{item.time}</div>
              </div>
              <div className='ml-4'><img src={InterviewIcon} alt="" width={'50rem'} /></div>
            </div>
            <div className='font-semibold text-lg'>
              <div>Round: {item.round}</div>
              <div>
              {item.type === interviewType.ONLINE ? <span className='bg-[#20D489] text-sm px-2 py-2 rounded-xl'>ONLINE</span> : <span>Room: {item?.room}</span>}
            </div>
            </div>
          </div>
          <div className='flex justify-between mt-2'>
            <div className='field-item w-[60%]'>{item.candidateName}</div>
            <div className='field-item w-[30%]'>{item.jobApply.recruitmentRequest.position.name}</div>
          </div>
          {item.type === interviewType.ONLINE && <div className='mt-2'>
            <div className='font-semibold text-lg'>Google meet</div>
            <div className='field-item'>{item?.linkMeeting}</div>
          </div>}
          <div className='mt-2'>
            <div className='font-semibold text-lg'>Purpose</div>
            <div className='field-item'>{item.purpose}</div>
          </div>
          <div className='mt-2'>
            <div className='font-semibold text-lg'>Description</div>
            <div className='field-item'>{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ListInterviewSchedule