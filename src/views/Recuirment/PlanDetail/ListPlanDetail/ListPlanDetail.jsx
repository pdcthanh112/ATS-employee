import React, { useEffect, useState } from 'react'
import './ListPlanDetail.scss'

import { useSelector } from 'react-redux'

import { Box, Modal, TextField, Autocomplete, TextareaAutosize } from '@mui/material';
import ShowMoreComponent from '../../ShowMoreComponent/ShowMoreComponent'
import CalendarIcon from './../../../../assets/icon/calendar.png'
import ApproveIcon from '../../../../assets/icon/check.png'
import RejectIcon from '../../../../assets/icon/close.png'
import EditIcon from '../../../../assets/icon/edit-icon.png'
import DeleteIcon from '../../../../assets/icon/delete-icon.png'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CurrencyFormat from 'react-currency-format';
import { positionName, responseStatus, statusName } from '../../../../utils/constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPlanApprovedByDepartment } from '../../../../apis/recruitmentPlanApi';
import { confirm } from "mui-confirm-modal";


const ListPlanDetail = ({ listPlanDetail }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);

  const [listApprovedRecruitmentPlan, setListApprovedRecruitmentPlan] = useState([])
  const [openModalEdit, setOpenModalEdit] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPlanApprovedByDepartment(currentUser.token, currentUser.employee.department.id);
      if (response) {
        setListApprovedRecruitmentPlan(response.data)
      }
    }
    fetchData();
  }, [currentUser.employee.department.id, currentUser.token])

  const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: 600,
    overflow: 'scroll',
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

  const handleEditPlan = (data) => {
    setOpenModalEdit(true)
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

  const handleDeletePlan = async (planDetailId) => {
     confirm({ message: "Are you sure to delete this plan?" }).then((response) => { 
      if(response) {
         
      }
    })
  };


  return (
    <React.Fragment>
      <div className='listPlanDetail-container'>
        {listPlanDetail.map((item) => (
          <div key={item.id} className='planDetail-item'>
            {item.status === statusName.PENDING ? <div className='flex'>
              <span className='process-buton text-[#FFA800] bg-[#FFF4DE]'>Pending</span>
              <div className='flex w-full justify-between'>
                <div className='flex'>
                  <span className='hover:cursor-pointer'><img src={ApproveIcon} alt="" title='Approve this plan' width={'40rem'} style={{ margin: '0 0 0 1rem' }} /></span>
                  <span className='hover:cursor-pointer'><img src={RejectIcon} alt="" title='Reject this plan' width={'24rem'} style={{ margin: '0.5rem 0 0 1rem' }} /></span>
                </div>
                <div className='flex'>
                  {currentUser?.employee.position.name.toUpperCase().includes(positionName.DIRECTOR) || currentUser?.employee.position.name.toUpperCase().includes(positionName.MANAGER) ? <React.Fragment>
                    <span className='hover:cursor-pointer' onClick={() => handleEditPlan(item)}><img src={EditIcon} alt="" title='Edit this plan' width={'30rem'} className='mr-2' /></span>
                    <span className='hover:cursor-pointer' onClick={() => handleDeletePlan(item.id)}><img src={DeleteIcon} alt="" title='Delete this plan' width={'30rem'} /></span>
                  </React.Fragment> : <React.Fragment></React.Fragment>}
                </div>
              </div>
            </div> : <div>
              {item.status === statusName.APPROVED && <span className='process-buton text-[#1BC5BD] bg-[#C9F7F5] hover:cursor-pointer'>APPROVE</span>}
              {item.status === statusName.REJECTED && <span className='process-buton text-[#F64E60] bg-[#FFE2E5] hover:cursor-pointer'>Reject</span>}
            </div>}
            {/* {item.status === statusName.PENDING ? <div className='flex'>
                <span className='process-buton text-[#FFA800] bg-[#FFF4DE]'>APPROVE</span>
                <div className='flex'>
                  <div className='flex'>
                    <span className='hover:cursor-pointer'><img src={ApproveIcon} alt="" title='Approve this plan' width={'40rem'} style={{ margin: '0 0 0 1rem' }} /></span>
                    <span className='hover:cursor-pointer'><img src={RejectIcon} alt="" title='Reject this plan' width={'24rem'} style={{ margin: '0.5rem 0 0 1rem' }} /></span>
                  </div>
                  <div className='flex'>
                    {currentUser?.employee.position.name.toUpperCase().includes(positionName.DIRECTOR) || currentUser?.employee.position.name.toUpperCase().includes(positionName.MANAGER) ? <React.Fragment>
                      <span className='hover:cursor-pointer' onClick={() => handleEditPlan(item)}><img src={EditIcon} alt="" title='Edit this plan' width={'30rem'} className='mr-2' /></span>
                      <span className='hover:cursor-pointer' onClick={() => handleDeletePlan(item.id)}><img src={DeleteIcon} alt="" title='Delete this plan' width={'30rem'} /></span>
                    </React.Fragment> : <React.Fragment></React.Fragment>}
                  </div>
                </div>
              </div> : <div>
                {item.status === statusName.APPROVED && <span className='process-buton text-[#1BC5BD] bg-[#C9F7F5] hover:cursor-pointer'>APPROVE</span>}
                {item.status === statusName.REJECTED && <span className='process-buton text-[#F64E60] bg-[#FFE2E5] hover:cursor-pointer'>Reject</span>}
              </div>}            */}
            <div className='flex justify-center mt-3 font-medium text-2xl'>{item.name}</div>
            <div>
              <div className='font-semibold text-xl mt-1'>Period</div>
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
          </div>
        ))}
      </div>
      <Modal open={openModalEdit} onClose={() => setOpenModalEdit(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <span className='font-medium text-3xl mr-3'>Create plan detail</span>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <div>
                  <TextField label="Name" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='name' value={formik.values.name} onChange={(event) => formik.setFieldValue('name', event.target.value)} />
                  {formik.errors.name && formik.touched.name && (
                    <div className='text-[#ec5555]'>{formik.errors.name}</div>
                  )}
                  <div className='font-semibold text-lg mt-2'>Period</div>
                  <div className='grid grid-cols-2 px-1'>
                    <div>
                      <div className='font-medium text-base'>from</div>
                      <input type={'date'} className='focus:outline-none' name='periodFrom' value={formik.values.periodFrom} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                      {formik.errors.periodFrom && formik.touched.periodFrom && (
                        <div className='text-[#ec5555]'>{formik.errors.periodFrom}</div>
                      )}
                    </div>
                    <div>
                      <div className='font-medium text-base'>to</div>
                      <input type={'date'} className='focus:outline-none' name='periodTo' value={formik.values.periodTo} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                      {formik.errors.periodTo && formik.touched.periodTo && (
                        <div className='text-[#ec5555]'>{formik.errors.periodTo}</div>
                      )}
                    </div>
                  </div>
                  <Autocomplete
                    options={listApprovedRecruitmentPlan}
                    size={'small'}
                    sx={{ width: '100%', marginTop: '1rem' }}
                    getOptionLabel={option => option.name}
                    renderInput={(params) => <TextField {...params} label="Recruitment plan" />}
                    onChange={(event, value) => { formik.setFieldValue('recruitmentPlanId', value.id) }} />
                  {formik.errors.recruitmentPlanId && formik.touched.recruitmentPlanId && (
                    <div className='text-[#ec5555]'>{formik.errors.recruitmentPlanId}</div>
                  )}
                  <div className='flex'>
                    <div className='w-[24%]'>
                      <TextField label="Amount" variant="outlined" size='small' sx={{ margin: '1rem 1rem 0 0' }} name='amount' value={formik.values.amount} onChange={formik.handleChange} />
                      {formik.errors.amount && formik.touched.amount && (
                        <div className='text-[#ec5555]'>{formik.errors.amount}</div>
                      )}
                    </div>
                    <div className='w-[42%]'>
                      <CurrencyFormat thousandSeparator={true} suffix={' VNĐ'} name='salary' placeholder='1,000,000 VNĐ' value={formik.values.salary} onChange={formik.handleChange} className='focus:outline-none' style={{ border: '1px solid #00000050', padding: '0.3rem 1rem', borderRadius: '0.2rem', marginTop: '1.1rem', width: '92%', height: '2.4rem' }} />
                      {formik.errors.salary && formik.touched.salary && (
                        <div className='text-[#ec5555]'>{formik.errors.salary}</div>
                      )}
                    </div>
                    <div className='w-[34%]' >
                      <Autocomplete
                        options={categoryData.jobTitle}
                        size={'small'}
                        sx={{ marginTop: '1rem' }}
                        renderInput={(params) => <TextField {...params} label="Position" />}
                        onChange={(event, value) => { formik.setFieldValue('positionName', value) }} />
                      {formik.errors.positionName && formik.touched.positionName && (
                        <div className='text-[#ec5555]'>{formik.errors.positionName}</div>
                      )}
                    </div>
                  </div>
                  <div className='mt-4'>Reason</div>
                  <TextareaAutosize
                    name='reason'
                    value={formik.values.reason}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                    onChange={formik.handleChange}
                  />
                  <div className='mt-4'>Description</div>
                  <TextareaAutosize
                    name='description'
                    value={formik.values.description}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                    onChange={formik.handleChange}
                  />
                  <div className='mt-4'>Requirement</div>
                  <TextareaAutosize
                    name='requirement'
                    value={formik.values.requirement}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                    onChange={formik.handleChange}
                  />
                  <div className='mt-4'>Note</div>
                  <TextareaAutosize
                    name='note'
                    value={formik.values.note}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className='mt-3 flex justify-around'>
                  <button onClick={() => { setOpenModalEdit(false) }} className='btn-create'>Cancel</button>
                  <button type='submit' className='btn-create'>Save</button>
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