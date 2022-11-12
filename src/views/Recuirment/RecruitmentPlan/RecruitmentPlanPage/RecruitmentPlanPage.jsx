import React, { useState, useEffect } from 'react'
import './RecruitmentPlanPage.scss'

import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CurrencyFormat from 'react-currency-format';
import PlanIcon from '../../../../assets/icon/recruitment-plan.png'
import CreateIcon from '../../../../assets/icon/plus.png'
import AddIcon from '../../../../assets/icon/addIcon.png'
import MinusIcon from '../../../../assets/icon/minusIcon.png'

import { Box, Modal, Pagination, Stack } from '@mui/material';
import { createRecruitmentPlan, getRecruimentPlanByDepartment } from '../../../../apis/recruitmentPlan'
import ListRecruitmentPlan from '../ListRecruitmentPlan/ListRecruitmentPlan'

import { responseStatus } from '../../../../utils/constants'

const RecruitmentPlanPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listRecruitmentPlan, setListRecruitmentPlan] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


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
  }, [pagination.currentPage])

  const formik = useFormik({
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
      setIsLoading(true)
      createRecruitmentPlan(currentUser.token, values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
      }).then(setIsLoading(false))
    }
  })

  return (
    <React.Fragment>
      <div className='recruitmentPlan-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Recruitment Plan</span>
          <img src={PlanIcon} alt='' width={'30rem'} />
        </div>

        <div className='create-request' onClick={() => setOpenModalCreate(true)} title='Create a new recruitment request'>
          <span className='mr-1'>Create recruitment plan</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={CreateIcon} alt='' /></span>
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListRecruitmentPlan listRecruitmentPlan={listRecruitmentPlan} />}

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
            <form onSubmit={formik.handleSubmit}>
              <div>
                <div>
                  <div className='font-semibold text-lg mt-3'>Name</div>
                  <input type={'text'} name='name' className='focus:outline-none' placeholder='Name of recruitment plan' value={formik.values.name} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.3rem 2rem', borderRadius: '0.5rem', width: '100%' }} />
                  {formik.errors.name && formik.touched.name && (
                    <div className='text-[#ec5555]'>{formik.errors.name}</div>
                  )}
                </div>
                <div className='font-semibold text-xl mt-4'>Period</div>
                <div className='grid grid-cols-2 px-1'>
                  <div>
                    <div className='font-medium text-base'>from</div>
                    <input type={'date'} name='periodFrom' className='focus:outline-none' value={formik.values.periodFrom} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                    {formik.errors.periodFrom && formik.touched.periodFrom && (
                      <div className='text-[#ec5555]'>{formik.errors.periodFrom}</div>
                    )}
                  </div>
                  <div>
                    <div className='font-medium text-base'>to</div>
                    <input type={'date'} name='periodTo' className='focus:outline-none' value={formik.values.periodTo} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                    {formik.errors.periodTo && formik.touched.periodTo && (
                      <div className='text-[#ec5555]'>{formik.errors.periodTo}</div>
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-2 mt-4'>
                  <div>
                    <div className='font-semibold text-xl mb-2'>Amount</div>
                    <span className='amount-control'>
                      <span className='mt-1' onClick={() => { formik.setValue(formik.values.amount, parseInt(formik.values.amount) - 1) }}><img src={MinusIcon} alt='' width={'20rem'} /></span>
                      <input type={'text'} style={{ width: '5rem', paddingLeft: 10 }} className='focus:outline-none' name='amount' value={formik.values.amount} onChange={formik.handleChange} />
                      <span className='mt-1' onClick={() => { formik.setFieldValue(formik.values.amount, parseInt(formik.values.amount) + 1) }}><img src={AddIcon} alt='' width={'20rem'} /></span>
                    </span>
                    {formik.errors.amount && formik.touched.amount && (
                      <div className='text-[#ec5555]'>{formik.errors.amount}</div>
                    )}
                  </div>
                  <div>
                    <div className='font-semibold text-xl mb-2'>Total salary</div>
                    <CurrencyFormat thousandSeparator={true} suffix={' VNĐ'} name='totalSalary' placeholder='1,000,000 VNĐ' value={formik.values.totalSalary} onChange={formik.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '100%' }} />
                    {formik.errors.totalSalary && formik.touched.totalSalary && (
                      <div className='text-[#ec5555]'>{formik.errors.totalSalary}</div>
                    )}

                  </div>
                </div>
                <div className='mt-3 flex justify-around'>
                  <button onClick={() => { setOpenModalCreate(false) }} className='btn-create'>Cancel</button>
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

export default RecruitmentPlanPage