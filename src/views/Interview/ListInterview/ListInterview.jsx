import React, { useState } from 'react'
import './ListInterview.scss'

import { useSelector } from 'react-redux'
import InterviewIcon from '../../../assets/icon/date-time-icon.png'
import ApproveIcon from '../../../assets/icon/check.png'
import RejectIcon from '../../../assets/icon/close.png'
import EditIcon from '../../../assets/icon/trash.png'
import DeleteIcon from '../../../assets/icon/edit.png'
import { interviewStatus, interviewType, positionName, responseStatus } from '../../../utils/constants'
import { confirmInterview } from '../../../apis/interviewApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Modal } from '@mui/material';

const ListInterviewSchedule = ({ listInterviewSchedule }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [openModalReason, setOpenModalReason] = useState(false)

  const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  const confirmInterviewByEmp = async (interviewId) => {
    console.log(currentUser);
    await confirmInterview(currentUser.token, currentUser.employee.id, interviewId).then((response) => {
      response.status === responseStatus.SUCCESS ? toast.success('Confirm successfully') : toast.error('Something error')
    })
  }

  return (
    <React.Fragment>
      <div className='listInterview-container'>
        {listInterviewSchedule.map((item) => (
          <div key={item.id} className='listInterview-item'>
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
                    {currentUser.employee.position.name === positionName.POSITION_HR ? <React.Fragment>
                      <span onClick={() => { }}><img src={EditIcon} alt="" width={'30rem'} className='mr-2 hover:cursor-pointer' title='Edit' /></span>
                      <span onClick={() => { setOpenModalReason(true) }}><img src={DeleteIcon} alt="" width={'30rem'} className='hover:cursor-pointer' title='Delete' /></span> </React.Fragment> : <React.Fragment>
                      <span onClick={() => { confirmInterviewByEmp(item.id) }}><img src={ApproveIcon} alt="" width={'40rem'} className='mr-2 hover:cursor-pointer' title='Approve' /></span>
                      <span onClick={() => { }}><img src={RejectIcon} alt="" width={'20rem'} className='mt-2 hover:cursor-pointer' title='Reject' /></span> </React.Fragment>}
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
              {/* <div className='field-item w-[30%]'>{item.jobApply.recruitmentRequest.position.name}</div> */}
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

      <Modal open={openModalReason} onClose={() => setOpenModalReason(false)}>
        <Box sx={style}>

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

export default ListInterviewSchedule