import React, { useEffect, useState } from 'react'
import './JobApplyPage.scss'

import { Link } from 'react-router-dom'
import JobApplyImage from '../../../assets/icon/job-applyImage.png'
import ChangeParameterIcon from '../../../assets/icon/change-screen-parameter.png'
import { getOpeningRecruimentRequest } from '../../../apis/recruimentRequestApi'
import ReactLoading from 'react-loading'
import { Modal, Box } from '@mui/material'
import { NumericFormat } from 'react-number-format';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import BriefCase from '../../../assets/icon/briefcase.png'
import Calendar from '../../../assets/icon/calendar-icon.png'
import { Pagination, Stack } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { screeningSetting } from '../../../apis/jobApplyApi'
import { responseStatus } from '../../../utils/constants'

const JobApplyPage = () => {

  const [listRecruitmentRequest, setListRecruitmentRequest] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 0, currentPage: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [openModalChangeParam, setOpenModalChangeParam] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getOpeningRecruimentRequest(pagination.currentPage - 1, 9);
      if (response && response.data) {
        setListRecruitmentRequest(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  const style = {
    position: 'absolute',
    top: '22rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    minHeight: 300,
    maxHeight: 600,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  const formikChangeParam = useFormik({
    initialValues: {
      city: 40,
      educationLevel: 20,
      experience: 20,
      foreignLanguage: 20,
      percentRequired: 60
    },
    validationSchema: Yup.object({
      city: Yup.number().positive('Invalid value').integer().min(0, 'This parameter must be greater than 0').max(100, 'This parameter must be less than 100'),
      educationLevel: Yup.number().positive('Invalid value').integer().min(0, 'This parameter must be greater than 0').max(100, 'This parameter must be less than 100'),
      experience: Yup.number().positive('Invalid value').integer().min(0, 'This parameter must be greater than 0').max(100, 'This parameter must be less than 100'),
      foreignLanguage: Yup.number().positive('Invalid value').integer().min(0, 'This parameter must be greater than 0').max(100, 'This parameter must be less than 100'),
      percentRequired: Yup.number().positive('Invalid value').integer().min(0, 'This parameter must be greater than 0').max(100, 'This parameter must be less than 100'),
    }),
    onSubmit: async (values) => {
      console.log(values);
      setIsSubmitting(true)
      await screeningSetting(values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')

      })
      setIsSubmitting(false)
    }
  })


  return (
    <React.Fragment>

      <div className='jobApply-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Choose recruitment request</span>
          <img src={JobApplyImage} alt='' width={'30rem'} />
        </div>

        <div className='flex justify-end mr-10 mb-3'>
          <button className='flex w-20% bg-[#20D489] px-3 py-2 rounded' onClick={() => setOpenModalChangeParam(true)}>
            <img src={ChangeParameterIcon} alt="" style={{ width: '1rem', height: '1rem', marginTop: '0.3rem' }} />
            <span className='text-[#FFF] ml-2'>Change screening parameter</span>
          </button>
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
          <div className='jobApply-content grid grid-cols-3'>
            {listRecruitmentRequest && listRecruitmentRequest.map((item) => (
              <Link to={`/view-job-apply/${item.id}`} target='_blank' key={item.id}>
                <div className='request-item' title={item.name}>
                  <div className='font-medium aa' style={{ maxLines: 1 }}>{item.name}</div>
                  <div className='text-[#20D489] font-medium text-lg'>{item.position.name}</div>
                  <div className='flex m-2'><img src={BriefCase} alt="" width={'18rem'} className='mr-2' /><span className='text-sm'>{item.industry}</span></div>
                  <div className='flex m-2'><img src={Calendar} alt="" width={'18rem'} className='mr-2' /><span className='text-sm'>{item.date}</span></div>
                </div>
              </Link>
            ))}
          </div>}

        <div className='flex justify-center'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>

      <Modal open={openModalChangeParam} onClose={() => setOpenModalChangeParam(false)}>
        <Box sx={style}>
          <div className='mx-3 py-2'>
            <div className='font-medium text-3xl mb-4'>Change screening parameter</div>
            <form onSubmit={formikChangeParam.handleSubmit}>

              <div className='flex justify-evenly mb-3'>
                <div>
                  <div className='flex'>
                    <span>City: </span>
                    <NumericFormat
                      //suffix={'%'}
                      name='city'
                      value={formikChangeParam.values.city}
                      onChange={formikChangeParam.handleChange}
                      className='change-param-field mx-2'
                      style={{ padding: '0.1rem 1rem', borderRadius: '0.2rem', width: '5rem' }}
                    />
                    <span>%</span>
                  </div>
                  {formikChangeParam.errors.city && formikChangeParam.touched.city && (
                    <div className='text-[#ec5555]'>{formikChangeParam.errors.city}</div>
                  )}
                </div>
                <div>
                  <div className='flex'>
                    <span>Education level: </span>
                    <NumericFormat
                      //suffix={'%'}
                      name='educationLevel'
                      value={formikChangeParam.values.educationLevel}
                      onChange={formikChangeParam.handleChange}
                      className='change-param-field mx-2'
                      style={{ padding: '0.1rem 1rem', borderRadius: '0.2rem', width: '5rem' }}
                    />
                    <span>%</span>
                  </div>
                  {formikChangeParam.errors.educationLevel && formikChangeParam.touched.educationLevel && (
                    <div className='text-[#ec5555]'>{formikChangeParam.errors.educationLevel}</div>
                  )}
                </div>
              </div>

              <div className='flex justify-evenly mb-3'>
                <div>
                  <div className='flex'>
                    <span>Experience: </span>
                    <NumericFormat
                      //suffix={'%'}
                      name='experience'
                      value={formikChangeParam.values.experience}
                      onChange={formikChangeParam.handleChange}
                      className='change-param-field mx-2'
                      style={{ padding: '0.1rem 1rem', borderRadius: '0.2rem', width: '5rem' }}
                    />
                    <span>%</span>
                  </div>
                  {formikChangeParam.errors.experience && formikChangeParam.touched.experience && (
                    <div className='text-[#ec5555]'>{formikChangeParam.errors.experience}</div>
                  )}
                </div>

                <div>
                  <div className='flex justify-center'>
                    <span>Foreign language: </span>
                    <NumericFormat
                      //suffix={'%'}
                      name='foreignLanguage'
                      value={formikChangeParam.values.foreignLanguage}
                      onChange={formikChangeParam.handleChange}
                      className='change-param-field mx-2'
                      style={{ padding: '0.1rem 1rem', borderRadius: '0.2rem', width: '5rem' }}
                    />
                    <span>%</span>
                  </div>
                  {formikChangeParam.errors.foreignLanguage && formikChangeParam.touched.foreignLanguage && (
                    <div className='text-[#ec5555]'>{formikChangeParam.errors.foreignLanguage}</div>
                  )}
                </div>
              </div>
              <div className='w-[60%] mx-auto mb-5'>
                <div className=''>
                  <span>Matching percent: </span>
                  <NumericFormat
                    //suffix={'%'}
                    name='percentRequired'
                    value={formikChangeParam.values.percentRequired}
                    onChange={formikChangeParam.handleChange}
                    className='change-param-field mx-2'
                    style={{ padding: '0.1rem 1rem', borderRadius: '0.2rem', width: '7rem' }}
                  />
                  <span>%</span>
                </div>
                {formikChangeParam.errors.percentRequired && formikChangeParam.touched.percentRequired && (
                  <div className='text-[#ec5555]'>{formikChangeParam.errors.percentRequired}</div>
                )}
              </div>

              <div className='flex justify-evenly'>
                <button type='button' onClick={() => { setOpenModalChangeParam(false); formikChangeParam.handleReset() }} className='btn-create bg-[#F64E60]'>Cancel</button>
                <button className='bg-[#1DAF5A] text-[#FFF] w-28 h-10 rounded-md flex justify-center items-center'>
                  {isSubmitting ? <ReactLoading type='spin' color='#FFF' width={25} height={25} /> : <span>Save</span>}
                </button>
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

export default JobApplyPage