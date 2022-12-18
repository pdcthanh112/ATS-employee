import React, { useEffect, useState } from 'react'
import './PlanDetailPage.scss'

import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useQuery } from 'react-query'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PlanDetailIcon from '../../../../assets/icon/plan-detailImage.png'
import CreateIcon from '../../../../assets/icon/plus.png'

import { Autocomplete, Box, Modal, Pagination, Stack, TextareaAutosize, TextField } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import { getAllPlanDetail, getPlanDetailByDepartment } from '../../../../apis/planDetailApi'
import { getPlanApprovedByDepartment, getRemainingSalary } from '../../../../apis/recruitmentPlanApi'
import { departmentName } from '../../../../utils/constants'
import { useCreatePlanDetail } from '../hooks/planDetailHook'
import ListPlanDetail from '../ListPlanDetail/ListPlanDetail'

const PlanDetailPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);

  const [pagination, setPagination] = useState({ totalPage: 0, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [listApprovedRecruitmentPlan, setListApprovedRecruitmentPlan] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [currentRemainingSalary, setCurrentRemainingSalary] = useState()

  const { mutate: createPlanDetail } = useCreatePlanDetail();

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

  const { data: listPlanDetail, isLoading } = useQuery(['listPlanDetail', pagination], async () => currentUser.employee.department.id === departmentName.HR_DEPARTMENT ?
    await getAllPlanDetail(pagination.currentPage - 1, 2).then((response) => {
      setPagination({ ...pagination, totalPage: response.data.totalPage })
      return response.data.responseList
    })
    : await getPlanDetailByDepartment(currentUser.employee.department.id, pagination.currentPage - 1, 2).then((response) => {
      setPagination({ ...pagination, totalPage: response.data.totalPage })
      return response.data.responseList
    }))

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPlanApprovedByDepartment(currentUser.employee.department.id);
      if (response) {
        setListApprovedRecruitmentPlan(response.data)
      }
    }
    fetchData();
  }, [])

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
      setIsCreating(true)
      try {
        createPlanDetail(values, {
          onSuccess: () => {
            toast.success('Create successfully')
            formik.handleReset()
            setOpenModalCreate(false)
          },
          onError: (error) => {
            if (error) {
              if (error.message.includes('amount')) formik.errors.amount = error.message
              if (error.message.includes('salary')) formik.errors.salary = error.message
            }
            toast.error('Create fail')
          },
          onSettled: () => {
            setIsCreating(false)
          }
        })
      } catch (error) {
        toast.error('Something error')
      }
    }
  })

  useEffect(() => {
    if (formik.values.recruitmentPlanId) {
      const fetchData = async () => {
        const response = await getRemainingSalary(formik.values.recruitmentPlanId);
        if (response) {
          setCurrentRemainingSalary(response.data)
        }
      }
      fetchData();
    }
  }, [formik.values.recruitmentPlanId])

  return (
    <React.Fragment>
      <div className='planDetail-container'>

        <div className='flex px-12 py-2'>
          <span className='font-medium text-3xl mr-3'>Plan details</span>
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
                  <TextField
                    label="Name"
                    name='name'
                    variant="outlined"
                    size='small'
                    style={{ width: '100%', marginTop: '1rem' }}
                    value={formik.values.name} onChange={(event) => formik.setFieldValue('name', event.target.value)}
                  />
                  {formik.errors.name && formik.touched.name && (
                    <div className='text-[#ec5555]'>{formik.errors.name}</div>
                  )}

                  <div className='font-semibold text-lg mt-2'>Period</div>
                  <div className='grid grid-cols-2 px-1'>
                    <div>
                      <div className='font-medium text-base'>from</div>
                      <input
                        type={'date'}
                        className='focus:outline-none'
                        name='periodFrom'
                        value={formik.values.periodFrom}
                        onChange={formik.handleChange}
                        style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }}
                      />
                      {formik.errors.periodFrom && formik.touched.periodFrom && (
                        <div className='text-[#ec5555]'>{formik.errors.periodFrom}</div>
                      )}
                    </div>

                    <div>
                      <div className='font-medium text-base'>to</div>
                      <input
                        type={'date'}
                        className='focus:outline-none'
                        name='periodTo'
                        value={formik.values.periodTo}
                        onChange={formik.handleChange}
                        style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }}
                      />
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
                    onChange={(event, value) => { formik.setFieldValue('recruitmentPlanId', value.id) }}
                  />
                  {formik.errors.recruitmentPlanId && formik.touched.recruitmentPlanId && (
                    <div className='text-[#ec5555]'>{formik.errors.recruitmentPlanId}</div>
                  )}

                  {formik.values.recruitmentPlanId && currentRemainingSalary &&
                    <div className='flex justify-end mt-3'>
                      <div className='flex bg-[#FFE2E5] text-[#F64E60] w-[60%] justify-center py-2 rounded'>
                        <span>Remaining salary:&nbsp;</span>
                        <NumericFormat
                          thousandSeparator=','
                          suffix={' VNĐ'}
                          value={currentRemainingSalary}
                          style={{ borderRadius: '0.2rem', width: '50%', backgroundColor: '#FFE2E5' }}
                        />
                      </div>
                    </div>
                  }

                  <div className='flex'>
                    <div className='w-[24%]'>
                      <TextField
                        label="Amount"
                        name='amount'
                        variant="outlined"
                        size='small'
                        sx={{ margin: '1rem 1rem 0 0' }}
                        value={formik.values.amount} onChange={formik.handleChange}
                      />
                      {formik.errors.amount && formik.touched.amount && (
                        <div className='text-[#ec5555]'>{formik.errors.amount}</div>
                      )}
                    </div>

                    <div className='w-[42%]'>
                      <NumericFormat
                        thousandSeparator=','
                        suffix={' VNĐ'}
                        name='salary'
                        placeholder='1,000,000 VNĐ'
                        value={formik.values.salary}
                        onChange={formik.handleChange}
                        className='focus:outline-none'
                        style={{ border: '1px solid #00000050', padding: '0.3rem 1rem', borderRadius: '0.2rem', marginTop: '1.1rem', width: '92%', height: '2.4rem' }}
                      />
                      {formik.errors.salary && formik.touched.salary && (
                        <div className='text-[#ec5555]'>{formik.errors.salary}</div>
                      )}
                    </div>

                    <div className='w-[34%]' >
                      <Autocomplete
                        options={categoryData.position}
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
                  <button onClick={() => { setOpenModalCreate(false); formik.handleReset() }} className='btn-create bg-[#F64E60]'>Cancel</button>
                  <button type='submit' className='btn-create bg-[#20D489]'>Save</button>
                  {isCreating && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={34} height={34} />}
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