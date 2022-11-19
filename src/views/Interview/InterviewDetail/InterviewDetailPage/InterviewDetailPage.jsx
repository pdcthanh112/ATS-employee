import React, { useState, useEffect } from 'react'
import './InterviewDetailPage.scss'
import { useSelector } from 'react-redux';
import { getAllInterviewDetail } from '../../../../apis/interviewDetailApi';

const InterviewDetailPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listInterviewDetail, setListInterviewDetail] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getAllInterviewDetail(currentUser.token, pagination.currentPage - 1, 4);
      if (response) {
        setListInterviewDetail(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  },[pagination.currentPage] )
  
  return (
    <div>InterviewDetailPage</div>
  )
}

export default InterviewDetailPage