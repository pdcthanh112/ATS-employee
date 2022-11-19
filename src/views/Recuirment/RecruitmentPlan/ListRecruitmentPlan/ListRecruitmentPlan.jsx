import React, { useState } from 'react'
import './ListRecruitmentPlan.scss'
import { useSelector } from "react-redux";

import { Box, Modal, Pagination, Stack } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { approveRecruitmentPlan } from '../../../../apis/recruitmentPlanApi'
import ApproveIcon from '../../../../assets/icon/check.png'
import RejectIcon from '../../../../assets/icon/close.png'
import EditIcon from '../../../../assets/icon/edit-icon.png'
import DeleteIcon from '../../../../assets/icon/delete-icon.png'
import CalendarIcon from './../../../../assets/icon/calendar.png'
import { positionName, responseStatus, statusName } from '../../../../utils/constants'
import { confirm } from "mui-confirm-modal";

const ListRecruitmentPlan = ({ listRecruitmentPlan }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);

  const [openModalCreate, setOpenModalCreate] = useState(false)

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

  const formik = useFormik({
    initialValues: {
      amount: 0,
      creatorId: currentUser?.employee.id,
      description: '',
      name: '',
      note: '',
      periodFrom: '',
      periodTo: '',
      positionName: '',
      reason: '',
      requirement: '',
      salary: ''
    },
    validationSchema: Yup.object({
      amount: Yup.number().positive('Invalid value').integer(),
      name: Yup.string().required('Please input name'),
      periodFrom: Yup.string().required('Please input begin date'),
      periodTo: Yup.string().required('Please input end date'),
      positionName: Yup.string().required('Please choose position'),
      recruitmentPlanId: Yup.string().required('Please choose recruitment plan'),
      salary: Yup.string().required('Please input salary'),
    }),
    onSubmit: async (values) => {
      console.log('value', values);
      // await createPlanDetail(values, currentUser.token).then(response => {       
      //   response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Something error')
      // })
    }
  })

  const handleApproveRecruitmentPlan = async (planId) => {
    confirm({ message: "Are you sure to approve this plan?" }).then((response) => {
      if (response) {
        approveRecruitmentPlan(currentUser.token, currentUser?.employee.id, planId).then((response) => {
          response.status === responseStatus.SUCCESS ? toast.success('Approve successfully') : toast.error('Something error')
        })
      }
    })
  }

  const handleEditPlan = (data) => {
    //setOpenModalEdit(true)
    //console.log('data', data);
    formik.values.amount = data.amount
    formik.values.name = data.name
    formik.values.note = data.note
    formik.values.periodFrom = data.periodFrom
    formik.values.periodTo = data.periodTo
    formik.values.positionId = data.positionName
    formik.values.reason = data.reason
    formik.values.salary = data.salary
    formik.values.description = data.description
    formik.values.requirement = data.requirement
  }

  const handleDeletePlan = async (planId) => {
    confirm({ message: "Are you sure to delete this plan?" }).then((response) => {
      if (response) {
        approveRecruitmentPlan(currentUser.token, currentUser?.employee.id, planId).then((response) => {
          response.status === responseStatus.SUCCESS ? toast.success('Approve successfully') : toast.error('Something error')
        })
      }
    })
  };

  return (
    <React.Fragment>
      <div className='listRecruitmentPlan-container'>
        {listRecruitmentPlan.map((item) => (

          <div key={item.id} className='recruitmentPlan-item'>
            {/* {item.status === statusName.PENDING &&
              <div className='flex justify-between'>
                <span className='label-status bg-[#FFF4DE] text-[#FFA800]'>PENDING</span>
                {currentUser.employee.position.name.toUpperCase().includes(positionName.MANAGER) || currentUser.employee.position.name.toUpperCase().includes(positionName.DIRECTOR) ?
                  <span>
                    <span className='process-buton hover:cursor-pointer' onClick={() => { handleApproveRecruitmentPlan(item.id); console.log(item.id) }}>APPROVE</span>
                    <span className='process-buton hover:cursor-pointer ml-5'>Reject</span>
                  </span> : <span></span>}
              </div>
            }
            {item.status === statusName.APPROVED &&
              <div className='flex justify-between'>
                <span className='label-status bg-[#C9F7F5] text-[#1BC5BD]'>APPROVED</span>
              </div>
            }
            {item.status === statusName.REJECTED &&
              <div className='flex justify-end'>
                <span className='label-status bg-[#FFE2E5] text-[#F64E60]'>Rejected</span>
              </div>
            } */}
            {item.status === statusName.PENDING ? <div className='flex'>
              <span className='process-buton text-[#FFA800] bg-[#FFF4DE]'>Pending</span>
              {currentUser?.employee.position.name.toUpperCase().includes(positionName.DIRECTOR) || currentUser?.employee.position.name.toUpperCase().includes(positionName.MANAGER) ? <React.Fragment>
                <div className='flex w-full justify-between'>
                  <div className='flex'>
                    <span className='hover:cursor-pointer' onClick={() => { handleApproveRecruitmentPlan(item.id)}}><img src={ApproveIcon} alt="" title='Approve this plan' width={'40rem'} style={{ margin: '0 0 0 1rem' }} /></span>
                    <span className='hover:cursor-pointer'><img src={RejectIcon} alt="" title='Reject this plan' width={'24rem'} style={{ margin: '0.5rem 0 0 1rem' }} /></span>
                  </div>
                  <div className='flex'>
                    <span className='hover:cursor-pointer' onClick={() => handleEditPlan(item)}><img src={EditIcon} alt="" title='Edit this plan' width={'30rem'} className='mr-2' /></span>
                    <span className='hover:cursor-pointer' onClick={() => handleDeletePlan(item.id)}><img src={DeleteIcon} alt="" title='Delete this plan' width={'30rem'} /></span>
                  </div>
                </div>
              </React.Fragment> : <React.Fragment></React.Fragment>}
            </div> : <div>
              {item.status === statusName.APPROVED && <span className='process-buton text-[#1BC5BD] bg-[#C9F7F5] hover:cursor-pointer'>APPROVE</span>}
              {item.status === statusName.REJECTED && <span className='process-buton text-[#F64E60] bg-[#FFE2E5] hover:cursor-pointer'>Reject</span>}
            </div>}
            <div>
              <div className='font-semibold text-lg mt-3'>Name</div>
              <div className='item-value w-[80%] justify-between mx-auto'>{item.name}</div>
            </div>
            <div>
              <div className='font-semibold text-xl mt-3'>Period</div>
              <div className='grid grid-cols-2 px-1'>
                <div>
                  <div className='font-medium text-base'>from</div>
                  <div className='item-value w-[80%] justify-between'>{item.periodFrom}<img src={CalendarIcon} alt='' width={'18rem'} /></div>
                </div>
                <div>
                  <div className='font-medium text-base'>to</div>
                  <div className='item-value w-[80%] justify-between'>{item.periodTo}<img src={CalendarIcon} alt='' width={'18rem'} /></div>
                </div>
              </div>
              <div className='grid grid-cols-2 mt-3'>
                <div>
                  <div className='font-semibold text-xl mb-1'>amount</div>
                  <div className='item-value w-[60%] justify-center ml-6'>{item.amount}</div>
                </div>
                <div>
                  <div className='font-semibold text-xl mb-1'>Total salary</div>
                  <div className='item-value w-[80%]'>{item.totalSalary}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <span className='font-medium text-3xl mr-3'>Create plan</span>
            {/* <form onSubmit={formik.handleSubmit}> */}
            <div>
              <div className='font-semibold text-xl mt-4'>Thời gian</div>
              <div className='grid grid-cols-2 px-1'>
                <div>
                  <div className='font-medium text-base'>Từ</div>
                  {/* <input type={'date'} name='periodFrom' className='focus:outline-none' value={formik.values.periodFrom} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} /> */}

                </div>
                <div>
                  <div className='font-medium text-base'>Đến</div>
                  {/* <input type={'date'} name='periodTo' className='focus:outline-none' value={formik.values.periodTo} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} /> */}

                </div>
              </div>
              <div className='grid grid-cols-2 mt-4'>
                <div>
                  <div className='font-semibold text-xl mb-2'>Số lượng</div>
                  <span className='amount-control'>
                    {/* <span className='mt-1' onClick={() => { formik.setValue(formik.values.amount, parseInt(formik.values.amount) - 1) }}><img src={MinusIcon} alt='' width={'20rem'} /></span>
                          <input type={'text'} style={{ width: '5rem', paddingLeft: 10 }} className='focus:outline-none' name='amount' value={formik.values.amount} onChange={formik.handleChange} />
                          <span className='mt-1' onClick={() => { formik.setFieldValue(formik.values.amount, parseInt(formik.values.amount) + 1) }}><img src={AddIcon} alt='' width={'20rem'} /></span> */}
                  </span>

                </div>
                <div>
                  <div className='font-semibold text-xl mb-2'>Tổng lương</div>
                  {/* <input type={'text'} name='totalSalary' className='focus:outline-none' placeholder='1.000.000 VNĐ' value={formik.values.totalSalary} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.3rem 2rem', borderRadius: '0.5rem', width: '13rem' }} />
                        */}
                </div>
              </div>
              <div className='mt-3 flex justify-around'>
                <button onClick={() => { setOpenModalCreate(false) }} className='btn-create'>Hủy</button>
                <button type='submit' className='btn-create'>Lưu</button>
              </div>
            </div>
            {/* </form> */}
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

export default ListRecruitmentPlan