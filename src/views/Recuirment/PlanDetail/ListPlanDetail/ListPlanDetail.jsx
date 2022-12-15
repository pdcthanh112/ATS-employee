import React, { useEffect, useState } from 'react'
import './ListPlanDetail.scss'

import { useSelector } from 'react-redux'
import moment from 'moment';
import { Box, Modal, TextField, Autocomplete, TextareaAutosize, Card } from '@mui/material';
import ShowMoreComponent from '../../ShowMoreComponent/ShowMoreComponent'
import CalendarIcon from './../../../../assets/icon/calendar.png'
import ApproveIcon from '../../../../assets/icon/check.png'
import RejectIcon from '../../../../assets/icon/close.png'
import EditIcon from '../../../../assets/icon/edit-icon.png'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ReactLoading from 'react-loading'
import { NumericFormat } from 'react-number-format';
import { jobLevelName, statusName } from '../../../../utils/constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPlanApprovedByDepartment } from '../../../../apis/recruitmentPlanApi';
import { useConfirm } from "material-ui-confirm";
import { useEditPlanDetail, useHandleApprovePlanDetail, useHandleRejectPlanDetail } from '../hooks/planDetailHook';


const ListPlanDetail = ({ listPlanDetail }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);
  const confirm = useConfirm();
  const [listApprovedRecruitmentPlan, setListApprovedRecruitmentPlan] = useState([])
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const { mutate: editPlanDetail } = useEditPlanDetail();
  const { mutate: handleApprovePlanDetail } = useHandleApprovePlanDetail();
  const { mutate: handleRejectPlanDetail } = useHandleRejectPlanDetail();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPlanApprovedByDepartment(currentUser.employee.department.id);
      if (response) {
        setListApprovedRecruitmentPlan(response.data)
      }
    }
    fetchData();
  }, [currentUser.employee.department.id])

  const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: 600,
    overflowY: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  const formikEdit = useFormik({
    initialValues: {
      amount: 0,
      planDetailId: '',
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
      description: Yup.string().required('Please input description'),
      name: Yup.string().required('Please input name of plan detail'),
      note: Yup.string().required('Please input note'),
      periodFrom: Yup.string().required('Please input period'),
      periodTo: Yup.string().required('Please input period'),
      positionName: Yup.string().required('Please choose position'),
      reason: Yup.string().required('Please input reason'),
      requirement: Yup.string().required('Please choose recruitment plan'),
      salary: Yup.string().required('Please input salary').min(1, 'Invalid value')
    }),
    onSubmit: (values) => {
      setIsUpdating(true)
      try {
        editPlanDetail(values, {
          onSuccess: () => {
            toast.success('Edit successfully')
            formikEdit.handleReset();
            setOpenModalEdit(false)
          },
          onError: (error) => {
            if (error) {
              if (error.message.includes('amount')) formikEdit.errors.amount = error.message
              if (error.message.includes('salary')) formikEdit.errors.salary = error.message
            }
            toast.error('Edit fail')
          },
          onSettled: () => {
            setIsUpdating(false)
          }
        })
      } catch (error) {
        toast.error('Something error')
      }
    }
  })

  const approvePlanDetail = async (planId) => {
    await confirm({ description: "Are you sure to confirm this plan?" }).then(() => {
      handleApprovePlanDetail({ empId: currentUser.employee.id, planId: planId }, {
        onSuccess: () => toast.success('Confirm successfully'),
        onError: () => toast.error('Somethings error')
      })
    })
  }
  const rejectPlanDetail = async (planId) => {
    await confirm({ description: "Are you sure to reject this plan?" }).then(() => {
      handleRejectPlanDetail({ empId: currentUser.employee.id, planId: planId }, {
        onSuccess: () => toast.success('Confirm successfully'),
        onError: () => toast.error('Somethings error')
      })
    })
  }

  const handleEditPlan = (data) => {
    formikEdit.values.planDetailId = data.id
    formikEdit.values.amount = data.amount
    formikEdit.values.name = data.name
    formikEdit.values.note = data.note
    formikEdit.values.periodFrom = data.periodFrom
    formikEdit.values.periodTo = data.periodTo
    formikEdit.values.positionName = data.position.name
    formikEdit.values.reason = data.reason
    formikEdit.values.salary = data.salary
    formikEdit.values.description = data.description
    formikEdit.values.requirement = data.requirement
    setOpenModalEdit(true)
  }

  return (
    <React.Fragment>
      <div className='listPlanDetail-container'>
        {listPlanDetail?.map((item) => (
          <Card key={item.id} className='planDetail-item'>
            {item.status === statusName.PENDING ? <div className='flex justify-between'>
              <span className='process-buton text-[#FFA800] bg-[#FFF4DE]'>Pending</span>
              <div className='flex w-full justify-between'>
                <div className='flex'>
                  {currentUser.employee.jobLevel === jobLevelName.DIRECTOR || currentUser.employee.jobLevel === jobLevelName.MANAGER ? <>
                    <span className='hover:cursor-pointer' onClick={() => { rejectPlanDetail(item.id) }}><img src={RejectIcon} alt="" title='Reject this plan' width={'24rem'} style={{ margin: '0.5rem 0 0 1rem' }} /></span>
                    <span className='hover:cursor-pointer' onClick={() => { approvePlanDetail(item.id) }}><img src={ApproveIcon} alt="" title='Approve this plan' width={'40rem'} style={{ margin: '0 0 0 0.5rem' }} /></span>
                  </> : <></>}
                </div> : <></>
                <div className='hover:cursor-pointer' onClick={() => handleEditPlan(item)}><img src={EditIcon} alt="" title='Edit this plan' width={'30rem'} className='mr-2' /></div>
              </div>
            </div> : <div>
              {item.status === statusName.APPROVED && <span className='process-buton text-[#1BC5BD] bg-[#C9F7F5] w-20 h-8 flex justify-center items-center'>APPROVE</span>}
              {item.status === statusName.CANCELED && <span className='process-buton text-[#F64E60] bg-[#FFE2E5] w-20 h-8 flex justify-center items-center'>Canceled</span>}
              {item.status === statusName.REJECTED && <span className='process-buton text-[#F64E60] bg-[#FFE2E5] w-20 h-8 flex justify-center items-center'>Reject</span>}
            </div>}
            <div className='flex justify-center mt-3 font-medium text-2xl'>{item.name}</div>
            <div>
              <div className='font-semibold text-xl mt-1'>Period</div>
              <div className='grid grid-cols-2 px-1'>
                <div>
                  <div className='font-medium text-base'>from</div>
                  <div className='item-value w-[80%] justify-between'>{moment(item.periodFrom).format('DD/MM/YYYY')}<img src={CalendarIcon} alt='' width={'18rem'} /></div>
                </div>
                <div>
                  <div className='font-medium text-base'>to</div>
                  <div className='item-value w-[80%] justify-between'>{moment(item.periodTo).format('DD/MM/YYYY')}<img src={CalendarIcon} alt='' width={'18rem'} /></div>
                </div>
              </div>
              <div className='grid grid-cols-3 mt-3'>
                <div>
                  <div className='font-semibold text-xl mb-1'>Amount</div>
                  <div className='item-value w-[60%] justify-center ml-10'>{item.amount}</div>
                </div>
                <div>
                  <div className='font-semibold text-xl mb-1'>Salary</div>
                  <div className='item-value w-[70%]'>{item.salary}</div>
                </div>
                <div>
                  <div className='font-semibold text-xl mb-1'>Position</div>
                  <div className='item-value w-[80%]'>{item.position.name}</div>
                </div>
              </div>
            </div>
            <div className='mt-2 pl-5'>
              <div><ShowMoreComponent title='Reason' content={item.reason} /></div>
              <div><ShowMoreComponent title='Description' content={item.description} /></div>
              <div><ShowMoreComponent title='Requirment' content={item.requirement} /></div>
              <div><ShowMoreComponent title='Note' content={item.note} /></div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={openModalEdit} onClose={() => { setOpenModalEdit(false); formikEdit.handleReset() }}>
        <Box sx={style}>
          <div className='modal-container'>
            <span className='font-medium text-3xl mr-3'>Edit plan detail</span>
            <form onSubmit={formikEdit.handleSubmit}>
              <div>
                <div>
                  <TextField label="Name"
                    variant="outlined"
                    size='small'
                    style={{ width: '100%', marginTop: '1rem' }}
                    name='name'
                    value={formikEdit.values.name}
                    onChange={(event) => formikEdit.setFieldValue('name', event.target.value)}
                  />
                  {formikEdit.errors.name && formikEdit.touched.name && (
                    <div className='text-[#ec5555]'>{formikEdit.errors.name}</div>
                  )}
                  <div className='font-semibold text-lg mt-2'>Period</div>
                  <div className='grid grid-cols-2 px-1'>
                    <div>
                      <div className='font-medium text-base'>from</div>
                      <input type={'date'} className='focus:outline-none' name='periodFrom' value={formikEdit.values.periodFrom} onChange={formikEdit.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                      {formikEdit.errors.periodFrom && formikEdit.touched.periodFrom && (
                        <div className='text-[#ec5555]'>{formikEdit.errors.periodFrom}</div>
                      )}
                    </div>
                    <div>
                      <div className='font-medium text-base'>to</div>
                      <input type={'date'} className='focus:outline-none' name='periodTo' value={formikEdit.values.periodTo} onChange={formikEdit.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                      {formikEdit.errors.periodTo && formikEdit.touched.periodTo && (
                        <div className='text-[#ec5555]'>{formikEdit.errors.periodTo}</div>
                      )}
                    </div>
                  </div>
                  <Autocomplete
                    options={listApprovedRecruitmentPlan}
                    size={'small'}
                    sx={{ width: '100%', marginTop: '1rem' }}
                    getOptionLabel={option => option.name}
                    renderInput={(params) => <TextField {...params} label="Recruitment plan" />}
                    onChange={(event, value) => { formikEdit.setFieldValue('recruitmentPlanId', value.id) }} />
                  {formikEdit.errors.recruitmentPlanId && formikEdit.touched.recruitmentPlanId && (
                    <div className='text-[#ec5555]'>{formikEdit.errors.recruitmentPlanId}</div>
                  )}
                  <div className='flex'>
                    <div className='w-[24%]'>
                      <TextField label="Amount" variant="outlined" size='small' sx={{ margin: '1rem 1rem 0 0' }} name='amount' value={formikEdit.values.amount} onChange={formikEdit.handleChange} />
                      {formikEdit.errors.amount && formikEdit.touched.amount && (
                        <div className='text-[#ec5555]'>{formikEdit.errors.amount}</div>
                      )}
                    </div>
                    <div className='w-[42%]'>
                      <NumericFormat thousandSeparator=',' suffix={' VNĐ'} name='salary' placeholder='1,000,000 VNĐ' value={formikEdit.values.salary} onChange={formikEdit.handleChange} className='focus:outline-none' style={{ border: '1px solid #00000050', padding: '0.3rem 1rem', borderRadius: '0.2rem', marginTop: '1.1rem', width: '92%', height: '2.4rem' }} />
                      {formikEdit.errors.salary && formikEdit.touched.salary && (
                        <div className='text-[#ec5555]'>{formikEdit.errors.salary}</div>
                      )}
                    </div>
                    <div className='w-[34%]' >
                      <Autocomplete
                        value={formikEdit.values.positionName}
                        options={categoryData.jobTitle}
                        size={'small'}
                        sx={{ marginTop: '1rem' }}
                        renderInput={(params) => <TextField {...params} label="Position" />}
                        onChange={(event, value) => { formikEdit.setFieldValue('positionName', value) }} />
                      {formikEdit.errors.positionName && formikEdit.touched.positionName && (
                        <div className='text-[#ec5555]'>{formikEdit.errors.positionName}</div>
                      )}
                    </div>
                  </div>
                  <div className='mt-4'>Reason</div>
                  <TextareaAutosize
                    name='reason'
                    value={formikEdit.values.reason}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                    onChange={formikEdit.handleChange}
                  />
                  <div className='mt-4'>Description</div>
                  <TextareaAutosize
                    name='description'
                    value={formikEdit.values.description}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                    onChange={formikEdit.handleChange}
                  />
                  <div className='mt-4'>Requirement</div>
                  <TextareaAutosize
                    name='requirement'
                    value={formikEdit.values.requirement}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                    onChange={formikEdit.handleChange}
                  />
                  <div className='mt-4'>Note</div>
                  <TextareaAutosize
                    name='note'
                    value={formikEdit.values.note}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                    onChange={formikEdit.handleChange}
                  />
                </div>
                <div className='mt-3 flex justify-around'>
                  <button onClick={() => { setOpenModalEdit(false) }} className='btn-create bg-[#F64E60]'>Cancel</button>
                  <button type='submit' className='btn-create bg-[#20D489]'>Save</button>
                  {isUpdating && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={33} height={33} />}
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

export default ListPlanDetail