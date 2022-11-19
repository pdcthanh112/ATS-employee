import React from 'react'
import './ListInterviewDetail.scss'

import { useSelector } from 'react-redux';


import { Box, Modal } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListInterviewDetail = ({listInterviewDetail}) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  return (
    <React.Fragment>
      <div className='listInterview-container'>
        {listInterviewDetail.map((item) => (
          <div key={item.id} className='listInterview-item'>
     
          </div>
        ))}
      </div>

      {/* <Modal open={openModalReason} onClose={() => setOpenModalReason(false)}>
        <Box sx={style}>

        </Box>
      </Modal> */}

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

export default ListInterviewDetail