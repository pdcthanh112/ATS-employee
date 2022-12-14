import React, { useState } from 'react'
import './ListCandidate.scss'

import { useSelector } from 'react-redux';
import { Box, Modal, Pagination, Stack } from '@mui/material';
import { disableCandidate, getCVByCandidate } from '../../../apis/candidateApi';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading'

import DeleteIcon from '../../../assets/icon/delete-icon.png'
import folderIcon from '../../../assets/icon/folder-icon.png'
import PDFImage from '../../../assets/image/pdf.png'
import { departmentName, responseStatus } from '../../../utils/constants';
import { useConfirm } from "material-ui-confirm";

const ListCandidate = ({ listCandidate }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const confirm = useConfirm();
  const [openCVModal, setOpenCVModal] = useState(false);
  const [listCV, setListCV] = useState();
  const [pagination, setPagination] = useState({ totalPage: 0, currentPage: 1 })
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

  const getCandidateCV = (cvs) => {
    cvs.length > 0 ? setListCV(cvs) : setListCV(null)
    setOpenCVModal(true)
  }

  const handleDisableCandidate = async (candidateId) => {
    await confirm({ description: "Are you sure to disable this candidate?" }).then(() => {
      disableCandidate(candidateId).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Confirm successfully') : toast.error('Something error')
      })
    })
  }

  return (
    <React.Fragment>
      <div className='table-candidate'>
        <table className="table-auto" >
          <thead>
            <tr className='text-center'>
              <th style={{ width: '28%' }}>Candidate</th>
              <th style={{ width: '18%' }}>Phone</th>
              <th style={{ width: '30%' }}>Email</th>
              <th style={{ width: '10%' }}>CV</th>
              <th style={{ width: '12%' }}>Status</th>
              {currentUser.employee.department.id === departmentName.HR_DEPARTMENT && <th style={{ width: '7%' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {listCandidate?.map((item, id) => (
              <tr key={id} style={{ height: '4rem', paddingBottom: '5rem' }}>
                <td className=''>{item.name}</td>
                <td className='text-center'>{item.phone}</td>
                <td className=''>{item.email}</td>
                <td><img src={folderIcon} alt='' title='CV' width={'30rem'} className='m-auto hover:cursor-pointer' onClick={() => getCandidateCV(item.cvs)} /></td>
                <td className='text-center'>
                  <div className='flex justify-center'>
                    {item.status === 'ACTIVATE' ? <div className='status-label bg-[#CCFFCC] text-[#00CA0E]'>Active</div> : <div className='status-label bg-[#FFB1B1] text-[#FF0000]'>Disable</div>}
                  </div>
                </td>
                <td><img src={DeleteIcon} alt='' title='Disable' width={'25rem'} className='m-auto hover:cursor-pointer' onClick={() => handleDisableCandidate(item.id)} /></td>
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
                      <img src={PDFImage} alt='' style={{ width: '1.6rem', height: '1.6rem' }} className='mr-2'/>
                      {item.title}
                    </div>
                  </a>
                ))}
                <div className='flex justify-center'>
                  <Stack spacing={2}>
                    <Pagination page={pagination.currentPage} count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
                  </Stack>
                </div>
              </React.Fragment>}
            </React.Fragment>}
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