import React, { useState, useEffect } from 'react'
import './PlanDetailPage.scss'

import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PlanDetailIcon from '../../../../assets/icon/plan-detail.png'
import CreateIcon from '../../../../assets/icon/plus.png'

import { Box, Modal, Pagination, Stack, TextField, Autocomplete, TextareaAutosize } from '@mui/material';
import { getAllPlanDetail } from '../../../../apis/planDetail'
import ListPlanDetail from '../ListPlanDetail/ListPlanDetail'
import { getRecruimentPlanByDepartment } from '../../../../apis/recruitmentPlan'

const PlanDetailPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);

  const [listPlanDetail, setListPlanDetail] = useState([])
  const [createPlanDetailObject, setCreatePlanDetailObject] = useState({
    amount: 0,
    creatorId: currentUser?.employee.id,
    description: '',
    name: '',
    note: '',
    periodFrom: '',
    periodTo: '',
    positionName: '',
    reason: '',
    recruitmentPlanId: 0,
    requirement: '',
    salary: ''
  })
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [listRecruitmentPlan, setListRecruitmentPlan] = useState([])

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
      const response = await getAllPlanDetail(currentUser.token, pagination.currentPage - 1, 2);
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
      setIsLoading(true)
      const response = await getRecruimentPlanByDepartment(currentUser.token, currentUser.employee.department.id, pagination.currentPage - 1, 4);
      if (response) {
        setListRecruitmentPlan(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

  const onChangePlanDetailObject = (id, value) => {
    setCreatePlanDetailObject(() => ({
      ...createPlanDetailObject,
      [id]: value
    }))
  }

  // const formik = useFormik({
  //   initialValues: {
  //     creatorId: currentUser.employee.id,
  //     periodFrom: "",
  //     periodTo: "",
  //     amount: 0,
  //     totalSalary: 0,
  //   },
  //   validationSchema: Yup.object({
  //     periodFrom: Yup.string().required('Vui lòng nhập ngày bắt đầu'),
  //     periodTo: Yup.string().required('Vui lòng nhập ngày kết thúc'),
  //     amount: Yup.number().positive('Giá trị không hợp lệ').integer(),
  //     totalSalary: Yup.string().required('Vui lòng nhập tổng quỹ lương').min(1, 'Tổng quỹ lương không hợp lệ')
  //   }),
  //   onSubmit: (values) => {
  //     console.log('TTTTTTT', values);
  //     // setIsLoading(true)
  //     // createRecruitmentPlan(currentUser.token, values).then((response) => {
  //     //   response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
  //     // }).then(setIsLoading(false))
  //   }
  // })

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
            <span className='font-medium text-3xl mr-3'>Create plan</span>
            <div>
              <div>
                <TextField label="Name" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} onChange={(value) => onChangePlanDetailObject('name', value)} />
                <div className='font-semibold text-lg mt-2'>Period</div>
                <div className='grid grid-cols-2 px-1'>
                  <div className=''>
                    <div className='font-medium text-base'>from</div>
                    <input type={'date'} name='periodFrom' className='focus:outline-none' onChange={(value) => onChangePlanDetailObject('periodFrom', value)} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                  </div>
                  <div>
                    <div className='font-medium text-base'>to</div>
                    <input type={'date'} name='periodTo' className='focus:outline-none' onChange={(value) => onChangePlanDetailObject('periodTo', value)} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                  </div>
                </div>
                <Autocomplete
                    options={categoryData.jobTitle}
                    size={'small'}
                    sx={{ width: '100%', marginTop: '1rem' }}
                    renderInput={(params) => <TextField {...params} label="Position" />}
                    onInputChange={(event, value) => { onChangePlanDetailObject('industry', value) }} />
                <div className='flex'>
                  <TextField label="Amount" variant="outlined" size='small' sx={{ width: '20%', marginTop: '1rem', marginRight: '1rem' }} />
                  <TextField label="Salary" variant="outlined" size='small' sx={{ width: '40%', marginTop: '1rem', marginRight: '1rem' }} />
                  <Autocomplete
                    options={categoryData.jobTitle}
                    size={'small'}
                    sx={{ width: '35%', marginTop: '1rem' }}
                    renderInput={(params) => <TextField {...params} label="Position" />}
                    onInputChange={(event, value) => { onChangePlanDetailObject('industry', value) }} />
                </div>
                <div className='mt-4'>Reason</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                />
                <div className='mt-4'>Description</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                />
                <div className='mt-4'>Requirment</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                />
                <div className='mt-4'>Note</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                />
              </div>
              <div className='mt-3 flex justify-around'>
                <button onClick={() => { setOpenModalCreate(false) }} className='btn-create'>Cancel</button>
                <button type='submit' className='btn-create'>Save</button>
              </div>
            </div>

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