import React, { useEffect, useState } from 'react'
import './DepartmentInterview.scss'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { cancelInterview, confirmByManager, getInterviewByDepartment, getStatusAndName } from '../../../apis/interviewScheduleApi'
import InterviewIcon from '../../../assets/icon/date-time-icon.png'
import CheckedIcon from '../../../assets/icon/checked.png'

import { interviewStatus, interviewType, responseStatus } from '../../../utils/constants'
import ReactLoading from 'react-loading'
import { Box, Modal, Pagination, Stack } from '@mui/material'
import { useConfirm } from "material-ui-confirm";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentInterview = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const departmentId = useParams().id
  const confirm = useConfirm();

  const [listInterview, setListInterview] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModelMember, setOpenModalMember] = useState(false)
  const [confirmList, setConfirmList] = useState([])
  const [currentInterview, setCurrentInterview] = useState()
  const [handling, setHandling] = useState(false)

  const style = {
    position: 'absolute',
    top: '20rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: 600,
    overflowY: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getInterviewByDepartment(departmentId, pagination.currentPage - 1, 4);
      if (response) {
        setListInterview(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  const handleShowConfirmList = async (interviewId) => {
    setCurrentInterview(interviewId)
    await getStatusAndName(interviewId).then((response) => {
      if (response && response.data) setConfirmList(response.data)
      setOpenModalMember(true)
    })
  }

  const confirmContinueInterview = async () => {
    await confirm({ description: "Are you sure to aprrove this interview?" }).then(() => {
      setHandling(true)
      confirmByManager(currentInterview).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Confirm successfully') : toast.error('Something error')
      })
      setHandling(false)
    })
  }

  const confirmCancelInterview = async () => {
    await confirm({ description: "Are you sure to cancel this interview?" }).then(() => {
      setHandling(true)
      const data = {
        interviewId: currentInterview,
        reason: 'We canceled this interview due to the absence of an important member'
      }
      cancelInterview(data).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Cancel successfully') : toast.error('Something error')
      })
      setHandling(false)
    })
  }

  return (
    <React.Fragment>
      <div className='mx-5 mt-3 px-3 py-2 font-medium text-2xl'>List interview of department</div>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div className='listInterview-container'>
          {listInterview && listInterview.map((item) => (
            <div key={item.id} className='listInterview-item'>
              <div className='inline-flex w-[100%]'>
                <div className='flex'>
                  <div>
                    <div className='font-semibold text-lg w-24'>{item.date}</div>
                    <div className='flex justify-end font-bold text-xl'>{item.time}</div>
                  </div>
                  <div className='ml-4'><img src={InterviewIcon} alt="" width={'50rem'} /></div>
                </div>
                {item.status === interviewStatus.PENDING &&
                  <div className='flex justify-between w-[60%] ml-4'>
                    <div className='bg-[#FFF4DE] text-[#FFA800] text-sm font-semibold px-3 py-2 rounded-lg h-9'>PENDING</div>
                    <div className='flex hover:cursor-pointer hover:text-[#116835]' onClick={() => handleShowConfirmList(item.id)}>
                      <img src={CheckedIcon} alt="" style={{ width: '1.7rem', height: '1.7rem' }} />
                      <span>View list member</span>
                    </div>
                  </div>}
                {item.status === interviewStatus.DONE && <div className='bg-[#E9FCE9] text-[#00FF00] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>DONE</div>}
                {item.status === interviewStatus.APPROVED && <div className='flex justify-between '>
                  <div className='bg-[#C9F7F5] text-[#1BC5BD] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>APPROVED</div>
                </div>}
                {item.status === interviewStatus.CANCELED && <div className='bg-[#FFE2E5] text-[#F64E60] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>CANCELED</div>}
              </div>

              <div className='font-semibold text-lg grid justify-end mb-3'>
                <div>Round: {item.round}</div>
                <div>
                  {item.type === interviewType.ONLINE ? <span className='bg-[#20D489] text-sm px-4 py-2 rounded-xl'>ONLINE</span> : <span>Room: {item?.room}</span>}
                </div>
              </div>
              <div className='flex justify-between mt-2'>
                <div className='field-item w-[60%]'>{item.candidateName}</div>
                <div className='field-item w-[30%]'>{item.jobApply.recruitmentRequest.position.name}</div>
              </div>
              {item.type === interviewType.ONLINE ? <div className='mt-2'>
                <div className='font-semibold text-lg'>Google meet</div>
                <div className='field-item'>{item?.linkMeeting}</div>
              </div> : <div className='mt-2'>
                <div className='font-semibold text-lg'>Address</div>
                <div className='field-item'>{item?.address}</div>
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
      }
      <div className='flex justify-center'>
        <Stack spacing={2}>
          <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
        </Stack>
      </div>

      <Modal open={openModelMember} onClose={() => setOpenModalMember(false)}>
        <Box sx={style}>
          <div className='px-4 py-3'>
            <div className='flex justify-center font-medium text-xl mb-4'>Member of this interview</div>
            {confirmList && confirmList.map((item) => (
              <div className='flex justify-between px-5 my-4'>
                <div>{item.name}</div>
                <div>
                  {item.status === 'ACCEPTABLE' && <div className='bg-[#E9FCE9] text-[#00FF00] text-sm px-3 py-1 rounded-lg h-7 items-center'>Approved</div>}
                  {item.status === 'REJECTED' && <div className='bg-[#FFE2E5] text-[#F64E60] text-sm px-3 py-1 rounded-lg h-7 items-center'>Reject</div>}
                  {item.status === 'null' && <div className='bg-[#FFF4DE] text-[#FFA800] text-sm px-3 py-1 rounded-lg h-7 items-center'>Pending</div>}
                </div>
              </div>
            ))}
            <div>
              <div className='font-medium'>Confirm for this interview schedule</div>
              <div className='flex justify-evenly my-2'>
                <button className='bg-[#F64E60] text-[#FFF] px-3 py-1 rounded-lg' onClick={() => confirmCancelInterview()}>Reject</button>
                <button className='bg-[#20D489] text-[#FFF] px-3 py-1 rounded-lg' onClick={() => confirmContinueInterview()}>Approve</button>
                {handling && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={35} height={35} />}
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.Fragment>
  )
}

export default DepartmentInterview