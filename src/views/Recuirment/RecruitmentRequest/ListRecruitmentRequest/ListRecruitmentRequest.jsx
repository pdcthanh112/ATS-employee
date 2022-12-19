import React from 'react'
import './ListRecruitmentRequest.scss'
import {Card} from '@mui/material'
import ShowMoreComponent from '../../ShowMoreComponent/ShowMoreComponent'
import moment from 'moment'

const ListRecruitmentRequest = ({ listRecruitmentRequest }) => {

  return (
    <React.Fragment>
      {listRecruitmentRequest?.map((item) => (
        <Card key={item.id} className='recruitmentRequest-container'>
          <div className='flex justify-between'>
            <div>
              <span className='font-bold text-xl'>{item.industry}</span>
              <span className='font-light text-3xl mx-8'>|</span>
            </div>
            <div className='ml-20 mt-3 mr-5 font-medium text-lg'>{item.name}</div>
          </div>

          <div className='request-infor flex justify-evenly text-[0.8rem] mt-3'>
            <span><strong className='font-semibold ml-1'>Job level:</strong> {item.jobLevel}</span>
            <span><strong className='font-semibold ml-1'>Experience:</strong> {item.experience}</span>
            <span><strong className='font-semibold ml-1'>Industry:</strong> {item.industry}</span>
            <span><strong className='font-semibold ml-1'>Type of work:</strong> {item.typeOfWork}</span>
          </div>
          <div className='request-infor flex justify-evenly text-[0.8rem] mt-3'>
            <span><strong className='font-semibold ml-1'>Create date:</strong> {moment(item.date).format('DD/MM/YYYY')}</span>
            <span><strong className='font-semibold ml-1'>Expired date:</strong> {moment(item.expiryDate).format('DD/MM/YYYY')}</span>
            <span><strong className='font-semibold ml-1'>Salary:</strong> {item.salaryDetail}</span>
            {/* <span><strong className='font-semibold ml-1'>Status:</strong> {item.status}</span> */}
          </div>
          <div><ShowMoreComponent title='Description' content={item.description} /></div>
          <div><ShowMoreComponent title='Requirement' content={item.requirement} /></div>
          <div><ShowMoreComponent title='Benefit' content={item.benefit} /></div>
        </Card>
      ))}
    </React.Fragment>
  )
}

export default ListRecruitmentRequest