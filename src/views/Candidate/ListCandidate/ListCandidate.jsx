import React, { useState, useEffect } from 'react'
import './ListCandidate.scss'

import { useSelector } from 'react-redux';
import { Box, Modal, Pagination, Stack, Avatar } from '@mui/material';
import { getInterviewByCandidateId } from '../../../apis/interviewScheduleApi';
import { getCVByCandidate } from '../../../apis/candidateApi';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading'

import ScheduleIcon from '../../../assets/icon/calendar.png'
import folderIcon from '../../../assets/icon/folder-icon.png'
import PDFImage from '../../../assets/image/pdf.png'
import { responseStatus } from '../../../utils/constants';

const ListCandidate = ({ listCandidate }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);

  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [openCVModal, setOpenCVModal] = useState(false);
  const [interviewSchedule, setInterviewSchedule] = useState();
  const [listCV, setListCV] = useState();
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [isLoading, setIsLoading] = useState(false)

  const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
  };

  const getCandidateCV = async (candidateId) => {
    setIsLoading(true)
    const response = await getCVByCandidate(currentUser.token, candidateId, pagination.currentPage - 1, 5);
    if (response.status === responseStatus.SUCCESS) {
      if (response.data === null || response.data.length < 1) {
        setListCV(null)
      } else {
        setListCV(response.data.responseList);
        setPagination({ ...pagination, totalPage: response.data.totalPage })
      }
      setIsLoading(false)
      setOpenCVModal(true)
    } else {
      toast.error('Somethings error')
    }
  }

  const getCandidateInterview = async (candidateId) => {
    setIsLoading(true)
    const response = await getInterviewByCandidateId(candidateId, currentUser.token);
    if (response.status === responseStatus.SUCCESS) {
      if (response.data === null || response.data.length < 1) {
        setInterviewSchedule(null)
      } else {
        setInterviewSchedule(response.data);
      }
      setIsLoading(false)
      setOpenScheduleModal(true)
    } else {
      toast.error('Somethings error')
    }
  }

  // const getCandidateInterview = async (candidateId) => {
  //   setIsLoading(true)
  //   const response = await getInterviewByCandidateId(6, currentUser.token);
  //   console.log('CVtttttttttttttt', response);
  //   if (response.status === responseStatus.SUCCESS) {
  //     if (response.data === null || response.data.length < 1) {
  //       setInterviewSchedule(null)
  //     } else {
  //       setInterviewSchedule(response.data.responseList);
  //       setPagination({ ...pagination, totalPage: response.data.totalPage })
  //     }
  //     setIsLoading(false)
  //     setOpenScheduleModal(true)
  //   } else {
  //     toast.error('Somethings error')
  //   }
  // }

  return (
    <React.Fragment>
      <div className='table-candidate'>
        <table className="table-auto" >
          <thead>
            <tr className='text-center'>
              <th style={{ width: '28%' }}>Candidate</th>
              <th style={{ width: '18%' }}>Phone</th>
              <th style={{ width: '20%' }}>Email</th>
              <th style={{ width: '8%' }}>CV</th>
              <th style={{ width: '12%' }}>Status</th>
              <th style={{ width: '7%' }}>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {listCandidate.map((item, id) => (
              <tr key={id} style={{ height: '4rem', paddingBottom: '5rem' }}>
                <td className='inline-flex'>
                  {/* <div className='w-16 h-20'><Avatar src={item.image ? item.image : DefaultCandidateAvatar} alt='' sx={{ width: '3rem', height: '3rem'}}  className='mt-3'/></div> */}
                  <span className='pl-2 my-auto'>{item.name}</span>
                </td>
                <td className='text-center'>{item.phone}</td>
                <td className=''>{item.email}</td>
                <td><img src={folderIcon} alt='' title='CV' width={'30rem'} className='m-auto hover:cursor-pointer' onClick={() => getCandidateCV(item.id)} /></td>
                <td className='text-center'>
                  {item.status === 'ACTIVATE' ? <span className='status-active'>Active</span> : <span className='status-disable'>Disable</span>}
                </td>
                <td>
                  <img src={ScheduleIcon} alt='' title='Schedule' width={'30rem'} className='m-auto hover:cursor-pointer' onClick={() => getCandidateInterview(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={openCVModal} onClose={() => setOpenCVModal(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <div className='modal-title'>
              <span className='font-medium text-3xl mr-3'>List CV</span>
              <img src={PDFImage} alt='' width={'30rem'} />
            </div>
            {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <React.Fragment>
              {listCV === null ? <div>This candidate does not have a CV yet</div> : <React.Fragment>
                {listCV?.map((item) => (
                  <a href={`${item.linkCV}`} rel='noreferrer' target={'_blank'} key={item.id}>
                    <div className='flex py-3'>
                      <img src={PDFImage} alt='' width={'30rem'} />
                      {item.title}
                    </div>
                  </a>
                ))}
                <div className='flex justify-center'>
                  <Stack spacing={2}>
                    <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
                  </Stack>
                </div>
              </React.Fragment>}
            </React.Fragment>}
          </div>
        </Box>
      </Modal>

      <Modal open={openScheduleModal} onClose={() => setOpenScheduleModal(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <div className='modal-title'>
              <span className='font-medium text-3xl mr-3'>Schedule</span>
              <img src={ScheduleIcon} alt='' width={'28rem'} />
            </div>
            {interviewSchedule === null ? <div>This candidate does not have a interview yet</div> : <React.Fragment>
              {interviewSchedule?.map((item) => (
                <div key={item.id} className='candidate-content'>
                  <div>
                    <span className='font-medium text-base'>Candidate name</span>
                    <div className='candidate-content__field'>{item.candidateName}</div>
                  </div>
                  <div className='mt-2'>
                    <span className='font-medium text-base'>Position</span>
                    <div className='candidate-content__field'>{item.jobApply.recruitmentRequest.industry}</div>
                  </div>
                  <div className='grid grid-cols-2 my-2'>
                    <div>
                      <span className='font-medium text-base'>Date</span>
                      <div className='candidate-content__field'>{item.date}</div>
                    </div>
                    <div>
                      <span className='font-medium text-base'>Time</span>
                      <div className='candidate-content__field'>{item.time}</div>
                    </div>
                  </div>
                  {item.type === 'OFFLINE' && <div>
                    <span className='font-medium text-2xl'>Offline</span>
                    <div>
                      <span className='font-medium text-base'>Room</span>
                      <div className='candidate-content__field'>{item.room}</div>
                    </div>
                    <div>
                      <span className='font-medium text-base'>Location</span>
                      <div className='candidate-content__field'>{item.address}</div>
                    </div>
                  </div>}
                  {item.type === 'ONLINE' && <div>
                    <span className='font-medium text-2xl'>Online</span>
                    <div>
                      <span className='font-medium text-base'>Google meet link</span>
                      <div className='candidate-content__field'>{item.linkMeeting}</div>
                    </div>
                  </div>}
                </div>
              ))
              }
            </React.Fragment>
            }
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
    </React.Fragment >
  )
}

export default ListCandidate