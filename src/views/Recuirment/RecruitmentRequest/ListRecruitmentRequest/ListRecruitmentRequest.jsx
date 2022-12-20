import React from 'react'
import './ListRecruitmentRequest.scss'
import { Card } from '@mui/material'
import ShowMoreComponent from '../../ShowMoreComponent/ShowMoreComponent'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { departmentName } from '../../../../utils/constants'
import DeleteIcon from '.././../../../assets/icon/trash.png'
import { useConfirm } from "material-ui-confirm";
import { useHandleCloseRecruitmentRequest } from '../hooks/recruitmentRequestHook'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListRecruitmentRequest = ({ listRecruitmentRequest }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const confirm = useConfirm();

  const { mutate: handleCloseRecruitmentRequest } = useHandleCloseRecruitmentRequest();

  const closeRecruitmentRequest = async (id) => {
    await confirm({ description: "Are you sure to close this job request?" }).then(() => {
      handleCloseRecruitmentRequest(id, {
        onSuccess: () => toast.success('Close job request successfully'),
        onError: () => toast.error('Somethings error')
      })
    })
  }

  return (
    <React.Fragment>
      {listRecruitmentRequest?.map((item) => (
        <Card key={item.id} className='recruitmentRequest-container'>
          <div className='flex justify-between'>
            <div>
              <span className='font-bold text-lg'>{item?.position?.name}</span>
              {/* <span className='font-bold text-xl'>{item.industry}</span> */}
              <span className='font-light text-3xl mx-8'>|</span>
            </div>
            <div className='ml-20 mt-3 mr-5 font-medium text-lg'>{item.name}</div>
          </div>

          <div className='request-infor flex justify-evenly text-[0.8rem] mt-3'>
            <span><strong className='font-semibold ml-1'>Job level:</strong> {item.jobLevel}</span>
            <span><strong className='font-semibold ml-1'>Experience:</strong> {item.experience}</span>
            <span><strong className='font-semibold ml-1'>Industry:</strong> {item.industry}</span>
            <span><strong className='font-semibold ml-1'>Type of work:</strong> {item.typeOfWork}</span>
          </div>
          <div className='request-infor flex justify-evenly text-[0.8rem] mt-3'>
            <span><strong className='font-semibold ml-1'>Create date:</strong> {moment(item.date).format('DD/MM/YYYY')}</span>
            <span><strong className='font-semibold ml-1'>Expired date:</strong> {moment(item.expiryDate).format('DD/MM/YYYY')}</span>
            <span><strong className='font-semibold ml-1'>Salary:</strong> {item.salaryDetail}</span>
            {/* <span><strong className='font-semibold ml-1'>Status:</strong> {item.status}</span> */}
          </div>
          <div><ShowMoreComponent title='Description' content={item.description} /></div>
          <div><ShowMoreComponent title='Requirement' content={item.requirement} /></div>
          <div><ShowMoreComponent title='Benefit' content={item.benefit} /></div>
          {currentUser.employee.department.id === departmentName.HR_DEPARTMENT &&
            <div className='flex justify-end' onClick={() => { closeRecruitmentRequest(item.id) }}><img src={DeleteIcon} alt="" width={'25rem'} className='hover:cursor-pointer' title='Close this job request' /></div>}
        </Card>
      ))}

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

export default ListRecruitmentRequest