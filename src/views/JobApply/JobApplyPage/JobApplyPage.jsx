import React, { useEffect, useState } from 'react'
import './JobApplyPage.scss'

import JobApplyImage from '../../../assets/icon/job-applyImage.png'
import { getOpeningRecruimentRequest } from '../../../apis/recruimentRequestApi'
import ReactLoading from 'react-loading'

import BriefCase from '../../../assets/icon/briefcase.png'
import Calendar from '../../../assets/icon/calendar-icon.png'
import { Pagination, Stack } from '@mui/material'

const JobApplyPage = () => {

  const [listRecruitmentRequest, setListRecruitmentRequest] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getOpeningRecruimentRequest(pagination.currentPage - 1, 16);
      if (response && response.data) {
        setListRecruitmentRequest(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
        console.log(response.data.responseList);
      }
    }
    fetchData();
  }, [pagination.currentPage])

  return (
    <React.Fragment>

      <div className='jobApply-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Recruitment Request</span>
          <img src={JobApplyImage} alt='' width={'30rem'} />
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
          <div className='jobApply-content grid grid-cols-4'>
            {listRecruitmentRequest && listRecruitmentRequest.map((item) => (
              <div key={item.id} className='request-item'>
                <div className='text-[#20D489] font-medium text-lg'>{item.position.name}</div>
                <div className='flex m-2'><img src={BriefCase} alt="" width={'18rem'} className='mr-2'/><span className='text-sm'>{item.industry}</span></div>
                <div className='flex m-2'><img src={Calendar} alt="" width={'18rem'} className='mr-2'/><span className='text-sm'>{item.date}</span></div>
              </div>
            ))}
          </div>}

          <div className='flex justify-center'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>

    </React.Fragment>
  )
}

export default JobApplyPage