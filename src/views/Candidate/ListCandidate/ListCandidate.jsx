import React, { useState } from 'react'
import './ListCandidate.scss'

import ScheduleIcon from '../../../assets/icon/calendar.png'
import folderIcon from '../../../assets/icon/folder-icon.png'

import { Box, Modal } from '@mui/material';

const ListCandidate = ({ listCandidate }) => {

  const [openModalSchedule, setOpenModalSchedule] = useState({ status: false, candidateId: -1 });

  const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

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
                <td><img src={folderIcon} alt='' title='Schedule' width={'30rem'} className='m-auto' /></td>
                <td className='text-center'>
                  {item.status === 'ACTIVATE' ? <span className='status-active'>Active</span> : <span className='status-disable'>Disable</span>}
                </td>
                <td className='block text-center mt-3'>
                  <a href='/#/' className=''><i title='Edit' className="fa-solid fa-pen-to-square text-2xl mr-2 text-[#53ADFF]"></i></a>
                  <a href='/#/' className=''><i title='Delete' className="fa-solid fa-trash-can text-2xl text-[#FF5353]"></i></a>
                </td>
                <td>
                  <img src={ScheduleIcon} alt='' title='Schedule' width={'30rem'} className='m-auto' onClick={() => setOpenModalSchedule({ status: true, candidateId: item.id })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={openModalSchedule.status} onClose={() => setOpenModalSchedule({ status: false, candidateId: -1 })}>
        <Box sx={style}>
          <div className='modal-container'>
            <div className='modal-title'>
              <span className='font-medium text-3xl mr-3'>Candidate</span>
              <img src={ScheduleIcon} alt='' width={'28rem'} />
            </div>
            <div className='candidate-content'>
              <div>
                <span className='font-medium text-lg'>Candidate name</span>
                <div className='candidate-content__name'>Pham Dao Cong Thanh</div>
              </div>
              <div>
                <span className='font-medium text-lg'>Mail</span>
                <div className='candidate-content__name'>pdcthanh112.dev@gmail.com</div>
              </div>
              <div>
                <span className='font-medium text-lg'>Position</span>
                <div className='candidate-content__name'>IT/BA</div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </React.Fragment >
  )
}

export default ListCandidate