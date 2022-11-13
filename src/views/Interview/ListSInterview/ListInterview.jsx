import React from 'react'
import './ListInterview.scss'

import InterviewIcon from '../../../assets/icon/date-time-icon.png'
import ApproveIcon from '../../../assets/icon/check.png'
import RejectIcon from '../../../assets/icon/close.png'
import { interviewStatus, interviewType } from '../../../utils/constants'

const ListInterviewSchedule = ({ listInterviewSchedule }) => {

  return (
    <div className='listInterview-container'>
      {listInterviewSchedule.map((item) => (
        <div className='listInterview-item'>

          <div className='inline-flex w-[100%]'>
            <div className='flex'>
              <div>
                <div className='font-semibold text-lg'>{item.date}</div>
                <div className='flex justify-end font-bold text-xl'>{item.time}</div>
              </div>
              <div className='ml-4'><img src={InterviewIcon} alt="" width={'50rem'} /></div>
            </div>
            {item.status === interviewStatus.PENDING &&
              <div className='flex justify-between w-[60%] ml-4'>
                <div className='bg-[#FFF4DE] text-[#FFA800] text-sm font-semibold px-3 py-2 rounded-lg h-9'>PENDING</div>
                <div className='flex'>
                  <span><img src={ApproveIcon} alt="" width={'40rem'} className='mr-2 hover:cursor-pointer' title='Approve'/></span>
                  <span><img src={RejectIcon} alt="" width={'20rem'} className='mt-2 hover:cursor-pointer' title='Reject'/></span>                  
                </div>
              </div>}
            {item.status === interviewStatus.DONE && <div className='bg-[#E9FCE9] text-[#00FF00] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>DONE</div>}
            {item.status === interviewStatus.APPROVED && <div className='bg-[#C9F7F5] text-[#1BC5BD] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>APPROVED</div>}
            {item.status === interviewStatus.CANCELED && <div className='bg-[#FFE2E5] text-[#F64E60] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>CANCELED</div>}
          </div>

          <div className='font-semibold text-lg grid justify-end mb-3'>
            <div>Round: {item.round}</div>
            <div>
              {item.type === interviewType.ONLINE ? <span className='bg-[#20D489] text-sm px-2 py-2 rounded-xl'>ONLINE</span> : <span>Room: {item?.room}</span>}
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