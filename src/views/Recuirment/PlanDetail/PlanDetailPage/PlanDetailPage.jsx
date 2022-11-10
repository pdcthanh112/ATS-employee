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

import { Box, Modal, Pagination, Stack } from '@mui/material';
import { getAllPlanDetail } from '../../../../apis/planDetail'
import ListPlanDetail from '../ListPlanDetail/ListPlanDetail'

const PlanDetailPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listPlanDetail, setListPlanDetail] = useState([])
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
      const response = await getAllPlanDetail(currentUser.token, pagination.currentPage - 1, 2);
      if (response) {
        console.log('RR', response.data.responseList);
        setListPlanDetail(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  const formik = useFormik({
    initialValues: {
      creatorId: currentUser.employee.id,
      periodFrom: "",
      periodTo: "",
      amount: 0,
      totalSalary: 0,
    },
    validationSchema: Yup.object({
      periodFrom: Yup.string().required('Vui lòng nhập ngày bắt đầu'),
      periodTo: Yup.string().required('Vui lòng nhập ngày kết thúc'),
      amount: Yup.number().positive('Giá trị không hợp lệ').integer(),
      totalSalary: Yup.string().required('Vui lòng nhập tổng quỹ lương').min(1, 'Tổng quỹ lương không hợp lệ')
    }),
    onSubmit: (values) => {
      console.log('TTTTTTT', values);
      // setIsLoading(true)
      // createRecruitmentPlan(currentUser.token, values).then((response) => {
      //   response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
      // }).then(setIsLoading(false))
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
            <span className='font-medium text-3xl mr-3'>Create plan</span>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <div className='mt-3 flex justify-around'>
                  <button onClick={() => { setOpenModalCreate(false) }} className='btn-create'>Hủy</button>
                  <button type='submit' className='btn-create'>Lưu</button>
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