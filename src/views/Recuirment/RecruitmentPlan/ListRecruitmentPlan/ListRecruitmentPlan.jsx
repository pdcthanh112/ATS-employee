import React from 'react'
import './ListRecruitmentPlan.scss'

const ListRecruitmentPlan = ({listRecruitmentPlan}) => {
  console.log('adfasfsd',listRecruitmentPlan);
  return (
    <React.Fragment>
      {listRecruitmentPlan.map((item, id) => (
        <div key={id} className='listRecruitmentPlan-container'>
          <div>
            <span className='font-bold text-xl'>{item.industry}</span>
            <span className='font-light text-3xl mx-8'>|</span>
            <span className='process-buton text-[#1BC5BD] bg-[#C9F7F5] ml-32 mr-10'>APPROVE</span>
            <span className='process-buton text-[#F64E60] bg-[#FFE2E5]'>Reject</span>
          </div>
          <div className='request-infor grid grid-cols-4 gap-4 text-[0.8rem] mt-3'>
            <span><strong className='font-semibold ml-1'>Job level:</strong> {item.jobLevel}</span>
            <span><strong className='font-semibold ml-1'>Experience:</strong> {item.experience}</span>
            <span><strong className='font-semibold ml-1'>Industry:</strong> {item.industry}</span>
            <span><strong className='font-semibold ml-1'>Type of work:</strong> {item.typeOfWork}</span>
            <span><strong className='font-semibold ml-1'>Create date:</strong> {item.date}</span>
            <span><strong className='font-semibold ml-1'>Expired date:</strong> {item.expiryDate}</span>
            <span><strong className='font-semibold ml-1'>Salary:</strong> {item.salary}</span>
            <span><strong className='font-semibold ml-1'>Status:</strong> {item.status}</span>
          </div>                 
        </div>
      ))}
    </React.Fragment>
  )
}

export default ListRecruitmentPlan