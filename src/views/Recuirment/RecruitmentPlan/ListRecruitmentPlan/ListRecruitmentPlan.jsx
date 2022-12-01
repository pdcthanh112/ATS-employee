import React, { useState } from 'react'
import './ListRecruitmentPlan.scss'
import { useSelector } from "react-redux";

import { Box, Modal, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { NumericFormat } from 'react-number-format';
import { approveRecruitmentPlan, editRecruitmentPlan, rejectRecruitmentPlan } from '../../../../apis/recruitmentPlanApi'
import ApproveIcon from '../../../../assets/icon/check.png'
import RejectIcon from '../../../../assets/icon/close.png'
import EditIcon from '../../../../assets/icon/edit-icon.png'
import CalendarIcon from './../../../../assets/icon/calendar.png'
import AddIcon from '../../../../assets/icon/addIcon.png'
import MinusIcon from '../../../../assets/icon/minusIcon.png'
import { positionName, responseStatus, statusName } from '../../../../utils/constants'
import { useConfirm } from "material-ui-confirm";
import ReactLoading from 'react-loading'

const ListRecruitmentPlan = ({ listRecruitmentPlan }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const confirm = useConfirm();
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

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

  const formikEdit = useFormik({
    initialValues: {
      planId: '',
      amount: '',
      name: '',
      periodFrom: '',
      periodTo: '',
      totalSalary: ''
    },
    validationSchema: Yup.object({
      amount: Yup.number().positive('Invalid value').integer(),
      name: Yup.string().required('Please input name'),
      periodFrom: Yup.string().required('Please input begin date'),
      periodTo: Yup.string().required('Please input end date'),
      totalSalary: Yup.string().required('Please input total salary'),
    }),
    onSubmit: async (values) => {
      setIsUpdating(true)
      await editRecruitmentPlan(currentUser.token, formikEdit.values.planId, values).then(response => {       
        response.status === responseStatus.SUCCESS ? toast.success('Update successfully') : toast.error('Something error')
      })
      setIsUpdating(false)
    }
  })

  const handleApproveRecruitmentPlan = async (planId) => {
    confirm({ description: "Are you sure to approve this plan?" }).then(() => {
      approveRecruitmentPlan(currentUser.token, currentUser?.employee.id, planId).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Confirm successfully') : toast.error('Something error')
      })
    })
  }

  const handleRejectRecruitmentPlan = async (planId) => {
    confirm({ description: "Are you sure to reject this plan?" }).then(() => {
      rejectRecruitmentPlan(currentUser.token, currentUser?.employee.id, planId).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Confirm successfully') : toast.error('Something error')
      })
    })
  }

  const handleEditPlan = (data) => {
    setOpenModalEdit(true)
    formikEdit.values.planId = data.id
    formikEdit.values.amount = data.amount
    formikEdit.values.name = data.name
    formikEdit.values.periodFrom = data.periodFrom
    formikEdit.values.periodTo = data.periodTo
    formikEdit.values.totalSalary = data.totalSalary
  }

  return (
    <React.Fragment>
      <div className='listRecruitmentPlan-container'>
        {listRecruitmentPlan.map((item) => (
          <div key={item.id} className='recruitmentPlan-item'>
            {item.status === statusName.PENDING ? <div className='flex'>
              <span className='process-buton text-[#FFA800] bg-[#FFF4DE]'>Pending</span>
              {currentUser?.employee.position.name.toUpperCase().includes(positionName.DIRECTOR) || currentUser?.employee.position.name.toUpperCase().includes(positionName.MANAGER) ? <React.Fragment>
                <div className='flex w-full justify-between'>
                  <div className='flex'>
                    <span className='hover:cursor-pointer' onClick={() => { handleApproveRecruitmentPlan(item.id) }}><img src={ApproveIcon} alt="" title='Approve this plan' width={'40rem'} style={{ margin: '0 0 0 1rem' }} /></span>
                    <span className='hover:cursor-pointer' onClick={() => { handleRejectRecruitmentPlan(item.id) }}><img src={RejectIcon} alt="" title='Reject this plan' width={'24rem'} style={{ margin: '0.5rem 0 0 1rem' }} /></span>
                  </div>
                  <div className='hover:cursor-pointer' onClick={() => handleEditPlan(item)}><img src={EditIcon} alt="" title='Edit this plan' width={'30rem'} className='mr-1' /></div>
                </div>
              </React.Fragment> : <></>}
            </div> : <div>
              {item.status === statusName.APPROVED && <span className='process-buton text-[#1BC5BD] bg-[#C9F7F5] hover:cursor-pointer'>APPROVE</span>}
              {item.status === statusName.CANCELED && <span className='process-buton text-[#F64E60] bg-[#FFE2E5] hover:cursor-pointer'>Reject</span>}
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

      <Modal open={openModalEdit} onClose={() => setOpenModalEdit(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <div className='font-medium text-3xl mb-3'>Edit plan</div>
            <form onSubmit={formikEdit.handleSubmit}>
              <div>
                <TextField label="Name" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='name' value={formikEdit.values.name} onChange={(event) => formikEdit.setFieldValue('name', event.target.value)} />
                {formikEdit.errors.name && formikEdit.touched.name && (
                  <div className='text-[#ec5555]'>{formikEdit.errors.name}</div>
                )}

                <div className='font-semibold text-xl mt-4'>Period</div>
                <div className='grid grid-cols-2 px-1'>
                  <div>
                    <div className='font-medium text-base'>from</div>
                    <input type={'date'} name='periodFrom' className='focus:outline-none' value={formikEdit.values.periodFrom} onChange={formikEdit.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />

                  </div>
                  <div>
                    <div className='font-medium text-base'>to</div>
                    <input type={'date'} name='periodTo' className='focus:outline-none' value={formikEdit.values.periodTo} onChange={formikEdit.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />

                  </div>
                </div>
                <div className='grid grid-cols-2 mt-4'>
                  <div>
                    <div className='font-semibold text-xl mb-1'>Amount</div>
                    <span className='amount-control'>
                      <span className='mt-1' onClick={() => { formikEdit.setFieldValue(formikEdit.values.amount, parseInt(formikEdit.values.amount) - 1) }}><img src={MinusIcon} alt='' width={'20rem'} /></span>
                      <input type={'text'} style={{ width: '5rem', paddingLeft: 10 }} className='focus:outline-none' name='amount' value={formikEdit.values.amount} onChange={formikEdit.handleChange} />
                      <span className='mt-1' onClick={() => { formikEdit.setFieldValue(formikEdit.values.amount, parseInt(formikEdit.values.amount) + 1) }}><img src={AddIcon} alt='' width={'20rem'} /></span>
                    </span>

                  </div>
                  <div>
                    <div className='font-semibold text-xl mb-1'>Total salary</div>
                    <NumericFormat thousandSeparator=',' suffix={' VNĐ'} name='totalSalary' value={formikEdit.values.totalSalary} onChange={formikEdit.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '92%', height: '2.3rem' }} />
                    {formikEdit.errors.totalSalary && formikEdit.touched.totalSalary && (
                      <div className='text-[#ec5555]'>{formikEdit.errors.totalSalary}</div>
                    )}

                  </div>
                </div>
                <div className='mt-4 mb-3 flex justify-around'>
                  <button onClick={() => { setOpenModalEdit(false) }} className='btn-create bg-[#F64E60]'>Cancel</button>
                  <button type='submit' className='btn-create bg-[#20D489]'>Save</button>
                  {isUpdating && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={35} height={35} />}
                </div>
              </div>
            </form>
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