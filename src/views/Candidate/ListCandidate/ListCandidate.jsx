import React, { useState } from 'react'
import './ListCandidate.scss'

import ScheduleIcon from '../../../assets/icon/calendar.png'
import folderIcon from '../../../assets/icon/folder-icon.png'

import { Box, Modal } from '@mui/material';
import { getInterviewByCandidateId } from '../../../apis/interview';
import { useSelector } from 'react-redux';

const ListCandidate = ({ listCandidate }) => {
  const currentUser = useSelector((state) => state.auth.login.currentUser.data);
  const [openModalSchedule, setOpenModalSchedule] = useState(false);
  const [interviewSchedule, setInterviewSchedule] = useState();

  const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    //border: '1px solid #0F6B14',
    boxShadow: 24,
  };


  const getCandidateInterview = async (candidateId) => {
    setOpenModalSchedule(true)
    const schedule = await getInterviewByCandidateId(candidateId, currentUser.token);
    if (schedule.data === undefined) {
      setInterviewSchedule(null)
    } else {
      setInterviewSchedule(schedule.data);
    }
  }



  return (
    <React.Fragment>
      <div className='table-candidate'>
        <table className="table-auto" >
          <thead>
            <tr className='text-center'>
              <th style={{ width: '24%' }}>Candidate</th>
              <th style={{ width: '12%' }}>Position</th>
              <th style={{ width: '12%' }}>Phone</th>
              <th style={{ width: '22%' }}>Email</th>
              <th style={{ width: '6%' }}>Folder</th>
              <th style={{ width: '12%' }}>Status</th>
              <th style={{ width: '15%' }}>Action</th>
              <th style={{ width: '7%' }}>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {listCandidate.map((item, id) => (
              <tr key={id} style={{ height: '4rem' }}>
                <td className='inline-flex'>
                  <img src={item.image} alt='' width={'50rem'} className='rounded-full' />
                  <span className='pl-2 my-auto'>{item.name}</span>
                </td>
                <td className='text-center'>IT/BA</td>
                <td className='text-center'>{item.phone}</td>
                <td className=''>{item.email}</td>
                <td><img src={folderIcon} alt='' title='CV' width={'30rem'} className='m-auto hover:cursor-pointer' /></td>
                <td className='text-center'>
                  {item.status === 'ACTIVATE' ? <span className='status-active'>Active</span> : <span className='status-disable'>Disable</span>}
                </td>
                <td className='block text-center mt-3'>
                  <a href='/#/' className=''><i title='Edit' className="fa-solid fa-pen-to-square text-2xl mr-2 text-[#53ADFF]"></i></a>
                  <a href='/#/' className=''><i title='Delete' className="fa-solid fa-trash-can text-2xl text-[#FF5353]"></i></a>
                </td>
                <td>
                  <img src={ScheduleIcon} alt='' title='Schedule' width={'30rem'} className='m-auto hover:cursor-pointer' onClick={() => getCandidateInterview(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={openModalSchedule} onClose={() => setOpenModalSchedule(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <div className='modal-title'>
              <span className='font-medium text-3xl mr-3'>Candidate</span>
              <img src={ScheduleIcon} alt='' width={'28rem'} />
            </div>
            {/* {interviewSchedule === null ? <div> asfdasfsf</div> : <React.Fragment>
              {interviewSchedule.map((item, id) => (
                <div key={id} className='candidate-content'>
                  <div>
                    <span className='font-medium text-base'>Candidate name</span>
                    <div className='candidate-content__field'>{item.candidateName}</div>
                  </div>
                  <div>
                    <span className='font-medium text-base'>Position</span>
                    <div className='candidate-content__field'>{item.jobApply.recruitmentRequest.industry}</div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <div>
                      <span className='font-medium text-base'>Date</span>
                      <div className='candidate-content__field'>{item.date}</div>
                    </div>
                    <div>
                      <span className='font-medium text-base'>Time</span>
                      <div className='candidate-content__field'>{item.date}</div>
                    </div>
                  </div>
                  {item.type === 'OFFLINE' ? <div>
                    <span className='font-medium text-2xl'>Offline</span>
                    <div>
                      <span className='font-medium text-base'>Room</span>
                      <div className='candidate-content__field'>{item.room}</div>
                    </div>
                    <div>
                      <span className='font-medium text-base'>Location</span>
                      <div className='candidate-content__field'>{item.address}</div>
                    </div>
                  </div> : <div>
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
            } */}
          </div>
        </Box>
      </Modal>
    </React.Fragment >
  )
}

export default ListCandidate