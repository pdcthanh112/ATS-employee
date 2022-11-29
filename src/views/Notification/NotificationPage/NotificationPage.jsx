import React, { useState, useEffect } from 'react'
import './NotificationPage.scss'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { getNotificationByEmployee } from '../../../apis/notificationApi'
import ReactLoading from 'react-loading'
import { Stack, Pagination } from '@mui/material'

const NotificationPage = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const [listNotification, setListNotification] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getNotificationByEmployee(currentUser.token, currentUser.employee.id, pagination.currentPage - 1, 10);
      if (response) {
        setListNotification(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : 
        <div className='notification-container'>
          {listNotification && listNotification.map((item) => (
            <div className='notification-item'>
              <div>{item.content}</div>
              <div className='text-[#00000090]'>{moment(item.createTime).fromNow()}</div>
            </div>
          ))}
          <div className='flex justify-center'>
            <Stack spacing={2}>
              <Pagination variant="outlined" page={pagination.currentPage} count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
            </Stack>
          </div>
        </div>
      }
    </React.Fragment>
  )
}

export default NotificationPage