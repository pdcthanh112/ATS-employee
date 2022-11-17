import React, { useState, useEffect } from 'react'
import './PlanDetailPage.scss'

import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PlanDetailIcon from '../../../../assets/icon/plan-detailImage.png'
import CreateIcon from '../../../../assets/icon/plus.png'

import { Box, Modal, Pagination, Stack, TextField, Autocomplete, TextareaAutosize } from '@mui/material';
import CurrencyFormat from 'react-currency-format';
import { getAllPlanDetail, createPlanDetail, getPlanDetailByDepartment } from '../../../../apis/planDetailApi'
import ListPlanDetail from '../ListPlanDetail/ListPlanDetail'
import { responseStatus } from '../../../../utils/constants'
import { getPlanApprovedByDepartment } from '../../../../apis/recruitmentPlanApi'
import {positionName} from '../../../../utils/constants'

const PlanDetailPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);

  const [listPlanDetail, setListPlanDetail] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [listApprovedRecruitmentPlan, setListApprovedRecruitmentPlan] = useState([])

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = currentUser.employee.position.name === positionName.POSITION_HR ? await getAllPlanDetail(currentUser.token, pagination.currentPage - 1, 2) : await getPlanDetailByDepartment(currentUser.token, pagination.currentPage - 1, 2)
      if (response) {
        setListPlanDetail(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPlanApprovedByDepartment(currentUser.token, currentUser.employee.department.id);
      if (response) {
        setListApprovedRecruitmentPlan(response.data)
      }
    }
    fetchData();
  }, [currentUser.employee.department.id, currentUser.token])

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
      recruitmentPlanId: '',
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
      await createPlanDetail(values, currentUser.token).then(response => {       
        response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Something error')
      })
    }
  })

  return (
    <React.Fragment>
      <div className='planDetail-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Recruitment plan details</span>
          <img src={PlanDetailIcon} alt='' width={'30rem'} />
        </div>

        <div className='create-request' onClick={() => setOpenModalCreate(true)} title='Create a new recruitment request'>
          <span className='mr-1'>Create recruitment plan detail</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={CreateIcon} alt='' /></span>
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListPlanDetail listPlanDetail={listPlanDetail} />}

        <div className='pagination-container'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>

      <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
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
                  <button onClick={() => { setOpenModalCreate(false) }} className='btn-create bg-[#F64E60]'>Cancel</button>
                  <button type='submit' className='btn-create bg-[#20D489]'>Save</button>
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

export default PlanDetailPage