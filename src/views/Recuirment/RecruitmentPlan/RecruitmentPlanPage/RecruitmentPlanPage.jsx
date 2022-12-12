import React, { useState } from 'react'
import './RecruitmentPlanPage.scss'

import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { NumericFormat } from 'react-number-format';
import PlanIcon from '../../../../assets/icon/recruitment-planImage.png'
import CreateIcon from '../../../../assets/icon/plus.png'
import AddIcon from '../../../../assets/icon/addIcon.png'
import MinusIcon from '../../../../assets/icon/minusIcon.png'
import { useQuery } from 'react-query';
import { Box, Modal, Pagination, Stack } from '@mui/material';
import { getAllRecruimentPlan, getRecruimentPlanByDepartment } from '../../../../apis/recruitmentPlanApi'
import ListRecruitmentPlan from '../ListRecruitmentPlan/ListRecruitmentPlan'

import { departmentName, jobLevelName } from '../../../../utils/constants'
import { useCreateRecruitmentPlan } from '../hooks/recruitmentPlanHook'

const RecruitmentPlanPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [pagination, setPagination] = useState({ totalPage: 0, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const { mutate: createRecruitmentPlan } = useCreateRecruitmentPlan();

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


  const { data: listRecruitmentPlan, isLoading } = useQuery(['listRecruitmentPlan', pagination], async () => currentUser.employee.department.id === departmentName.HR_DEPARTMENT ?
    await getAllRecruimentPlan(pagination.currentPage - 1, 4).then((response) => {
      setPagination({ ...pagination, totalPage: response.data.totalPage })
      return response.data.responseList
    })
    : await getRecruimentPlanByDepartment(currentUser.employee.department.id, pagination.currentPage - 1, 4).then((response) => {
      setPagination({ ...pagination, totalPage: response.data.totalPage })
      return response.data.responseList
    }))

  const formikCreate = useFormik({
    initialValues: {
      creatorId: currentUser.employee.id,
      name: "",
      periodFrom: "",
      periodTo: "",
      amount: 0,
      totalSalary: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please input name of recruitment plan'),
      periodFrom: Yup.string().required('Please input begin date'),
      periodTo: Yup.string().required('Please input end date'),
      amount: Yup.number().positive('Invalid value').integer(),
      totalSalary: Yup.string().required('Please input total salary').min(1, 'Invalid value')
    }),
    onSubmit: (values) => {
      setIsCreating(true)
      try {
        createRecruitmentPlan(values, {
          onSuccess: () => {
            toast.success('Create successfully')
            formikCreate.handleReset();
            setOpenModalCreate(false)
          },
          onError: () => toast.error('Create fail'),
          onSettled: () => {
            setIsCreating(false)
          }
        })
      } catch (error) {
        toast.error('Something error')
      }
    }
  })

  return (
    <React.Fragment>
      <div className='recruitmentPlan-container'>

        <div className='flex px-12 py-2'>
          <span className='font-medium text-3xl mr-3'>Recruitment Plan</span>
          <img src={PlanIcon} alt='' width={'30rem'} />
        </div>

        {currentUser?.employee.jobLevel === jobLevelName.MANAGER || currentUser?.employee.jobLevel === jobLevelName.DIRECTOR ? <div className='create-request' onClick={() => setOpenModalCreate(true)} title='Create a new recruitment request'>
          <span className='mr-1'>Create recruitment plan</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={CreateIcon} alt='' /></span>
        </div> : <></>}

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListRecruitmentPlan listRecruitmentPlan={listRecruitmentPlan} />}

        <div className='flex justify-center'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>

      <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <span className='font-medium text-3xl mr-3'>Create plan</span>
            <form onSubmit={formikCreate.handleSubmit}>
              <div>
                <div>
                  <div className='font-semibold text-lg mt-3'>Name</div>
                  <input type={'text'} name='name' className='focus:outline-none' placeholder='Name of recruitment plan' value={formikCreate.values.name} onChange={formikCreate.handleChange} style={{ border: '1px solid #116835', padding: '0.3rem 2rem', borderRadius: '0.5rem', width: '100%' }} />
                  {formikCreate.errors.name && formikCreate.touched.name && (
                    <div className='text-[#ec5555]'>{formikCreate.errors.name}</div>
                  )}
                </div>
                <div className='font-semibold text-xl mt-4'>Period</div>
                <div className='grid grid-cols-2 px-1'>
                  <div>
                    <div className='font-medium text-base'>from</div>
                    <input type={'date'} name='periodFrom' className='focus:outline-none' value={formikCreate.values.periodFrom} onChange={formikCreate.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                    {formikCreate.errors.periodFrom && formikCreate.touched.periodFrom && (
                      <div className='text-[#ec5555]'>{formikCreate.errors.periodFrom}</div>
                    )}
                  </div>
                  <div>
                    <div className='font-medium text-base'>to</div>
                    <input type={'date'} name='periodTo' className='focus:outline-none' value={formikCreate.values.periodTo} onChange={formikCreate.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                    {formikCreate.errors.periodTo && formikCreate.touched.periodTo && (
                      <div className='text-[#ec5555]'>{formikCreate.errors.periodTo}</div>
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-2 mt-4'>
                  <div>
                    <div className='font-semibold text-xl mb-2'>Amount</div>
                    <span className='amount-control'>
                      <span className='mt-1' onClick={() => { formikCreate.setFieldValue(formikCreate.values.amount, parseInt(formikCreate.values.amount) - 1) }}><img src={MinusIcon} alt='' width={'20rem'} /></span>
                      <input type={'text'} style={{ width: '5rem', paddingLeft: 10 }} className='focus:outline-none' name='amount' value={formikCreate.values.amount} onChange={formikCreate.handleChange} />
                      <span className='mt-1' onClick={() => { formikCreate.setFieldValue(formikCreate.values.amount, parseInt(formikCreate.values.amount) + 1) }}><img src={AddIcon} alt='' width={'20rem'} /></span>
                    </span>
                    {formikCreate.errors.amount && formikCreate.touched.amount && (
                      <div className='text-[#ec5555]'>{formikCreate.errors.amount}</div>
                    )}
                  </div>
                  <div>
                    <div className='font-semibold text-xl mb-2'>Total budget</div>
                    <NumericFormat thousandSeparator=',' suffix={' VNĐ'} name='totalSalary' placeholder='1,000,000 VNĐ' value={formikCreate.values.totalSalary} onChange={formikCreate.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '100%' }} />
                    {formikCreate.errors.totalSalary && formikCreate.touched.totalSalary && (
                      <div className='text-[#ec5555]'>{formikCreate.errors.totalSalary}</div>
                    )}

                  </div>
                </div>
                <div className='mt-3 flex justify-around'>
                  <button onClick={() => { setOpenModalCreate(false) }} className='btn-create bg-[#F64E60]'>Cancel</button>
                  <button type='submit' className='btn-create bg-[#20D489]'>Create</button>
                  {isCreating && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} />}
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

export default RecruitmentPlanPage