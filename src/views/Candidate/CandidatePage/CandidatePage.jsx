import React, { useState, useEffect } from 'react'
import './CandidatePage.scss'
import { useSelector } from "react-redux";
import ReactLoading from 'react-loading'

import { Box, Modal, Pagination, Stack, TextField, Autocomplete } from '@mui/material';

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CandidateIcon from '../../../assets/icon/candidateImage.png'
import SearchIcon from '../../../assets/icon/filter.png'
import { createCandidate, getAllActivateCandidate, getAllCandidate, getIdAndNameAcitveCandidate } from '../../../apis/candidateApi'
import ListCandidate from '../ListCandidate/ListCandidate';
import { DEFAULT_PASSWORD, departmentName, positionName, responseStatus } from '../../../utils/constants'
import { getIdAndNameActiveRequest } from '../../../apis/recruimentRequestApi';
import { applyJob } from '../../../apis/jobApplyApi';

const CandidatePage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const categoryData = useSelector((state) => state.categoryData.data);

  const [isLoading, setIsLoading] = useState(true)
  const [listCandidate, setListCandidate] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreateCandidate, setOpenModalCreateCandidate] = useState(false)
  const [openModalCreateJobApply, setOpenModalCreateJobApply] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isRegisting, setIsRegisting] = useState(false)
  const [listCandidateData, setListCandidateData] = useState([])
  const [listRecruitmentRequestData, setListRecruitmentRequestData] = useState([])

  const styleModalCreateCandidate = {
    position: 'absolute',
    top: '22rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: 600,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };
  const styleModalCreateJobApply = {
    position: 'absolute',
    top: '22rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    minHeight: 380,
    maxHeight: 600,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = currentUser.employee.position.name === positionName.POSITION_HR ? await getAllCandidate(currentUser.token, pagination.currentPage - 1, 10) : await getAllActivateCandidate(currentUser.token, pagination.currentPage - 1, 10);
      if (response) {
        setListCandidate(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  const formikCreateCandidate = useFormik({
    initialValues: {
      address: '',
      dob: new Date().toJSON().slice(0, 10),
      email: '',
      gender: '',
      image: '',
      name: '',
      password: DEFAULT_PASSWORD,
      phone: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please input candidate email').matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'This email is invalid'),
      name: Yup.string().required('Please input candidate name'),
      //address: Yup.string().required('Please input candidate address'),
      //phone: Yup.string().required('Please input candidate phone number').matches(/^[0-9\-\\+]{10}$/, 'This phone number is invalid'),
    }),
    onSubmit: async (values) => {
      setIsRegisting(true)
      await createCandidate(values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
        setIsRegisting(false)
      })
    }
  })

  const formikCreateJobApply = useFormik({
    initialValues: {
      employeeId: currentUser.employee.id,
      listJobApplyByEmployee: [
        {
          email: '',
          linkCV: '',
          name: '',
          source: ''
        }
      ],
      requestId: ''
    },
    validationSchema: Yup.object({
      recruitmentRequestId: Yup.string().required('Please choose job request'),
    }),
    onSubmit: async (values) => {
      setIsApplying(true)
      console.log('RRRRRRRR', values);
      // if (fileCV == null) {
      //   formikCreateJobApply.errors.linkCV = "Please submit CV";
      // } else {
      //   const cvRef = ref(storage, `candidate-CV/${fileCV.name}`)
      //   await uploadBytes(cvRef, fileCV).then((snapshot) => {
      //     getDownloadURL(snapshot.ref).then(url => {
      //       formikCreateJobApply.values.linkCV = url
      //     })
      //   })
      //   await applyJob(currentUser.token, values).then((response) => {
      //     response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
      //     setIsRegisting(false)
      //   })
      // }
      setIsApplying(false)
    }
  })

  const formikSearch = useFormik({
    initialValues: {
      name: '',
      position: '',
      typeOfWork: ''
    },
    onSubmit: async (values) => {
      // updateProfileCandidate(currentUser.candidate.id, currentUser.token, values).then((response) => {
      //   response.status === responseStatus.SUCCESS ? toast.success('Edit profile successfully') : toast.error('Edit profile fail')
      // })
    }
  })

  const handleCreateJobApply = async () => {
    await getIdAndNameActiveRequest(currentUser.token).then(response => setListRecruitmentRequestData(response.data))
    setOpenModalCreateJobApply(true)
  }

  return (
    <React.Fragment>
      <div className='candidatepage-container'>
        <div className='flex px-5 py-3 bg-[#FFF]'>
          <span className='font-semibold text-3xl mr-3'>Candidate</span>
          <img src={CandidateIcon} alt='' width={'30rem'} />
        </div>

        <div className='bg-[#E9FCE9] flex justify-between px-10 py-4'>
          <form onSubmit={formikSearch.handleSubmit}>
            <div className='flex'>
              <img src={SearchIcon} alt="" width={'40rem'} title='Search' className='hover:cursor-pointer' onClick={() => { formikSearch.handleSubmit() }} />

              <div className='inputName'>
                <input type={'text'}
                  name='name'
                  value={formikSearch.values.position}
                  className='focus:outline-none'
                  placeholder='Candidate name...' style={{ margin: '5px 7px' }}
                  onChange={() => { formikSearch.handleChange() }}
                />
              </div>

              <Autocomplete
                options={categoryData.position}
                size={'small'}
                sx={{ width: 190, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="Position" />}
                onChange={(event, value) => { formikSearch.setFieldValue('position', value.value) }}
              />

              <Autocomplete
                options={categoryData.jobTitle}
                size={'small'}
                sx={{ width: 190, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="Job name" />}
                onChange={(event, value) => { formikSearch.setFieldValue('typeOfWork', value.value) }}
              />
            </div>
          </form>

          {currentUser.employee.department.id === departmentName.HR_DEPARTMENT && <>
            <div className='flex bg-[#1DAF5A] px-3 hover:cursor-pointer rounded-lg' onClick={() => handleCreateJobApply()} title='Create a new candidate'>
              <i className="fa-solid fa-plus text-white" style={{ marginTop: '0.8rem' }}></i>
              <span className='ml-1 mt-2 font-semibold text-white'>Apply for candidate</span>
            </div>

            <div className='flex bg-[#1DAF5A] px-3 hover:cursor-pointer rounded-lg' onClick={() => setOpenModalCreateCandidate(true)} title='Create a new candidate'>
              <i className="fa-solid fa-plus text-white" style={{ marginTop: '0.8rem' }}></i>
              <span className='ml-1 mt-2 font-semibold text-white'>Create candidate</span>
            </div>
          </>}
        </div>

        <div className='w-[90%] mx-auto my-3 py-3 rounded-lg bg-[#FFF]'>
          {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListCandidate listCandidate={listCandidate} />}

          <div className='flex justify-center'>
            <Stack>
              <Pagination page={pagination.currentPage} count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} variant="outlined" shape="rounded" />
            </Stack>
          </div>
        </div>
      </div>

      <Modal open={openModalCreateCandidate} onClose={() => setOpenModalCreateCandidate(false)}>
        <Box sx={styleModalCreateCandidate}>
          <div className='modal-container'>
            <span className='font-medium text-3xl'>Create candidate</span>
            <form onSubmit={formikCreateCandidate.handleSubmit}>
              <div className='my-3'>
                <label className='text-lg'>Fullname</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formikCreateCandidate.errors.fullname && formikCreateCandidate.touched.fullname && 'input-error'}`} name='name' placeholder='Input candidate name' value={formikCreateCandidate.values.name} onChange={formikCreateCandidate.handleChange} /><br />
                </div>
                {formikCreateCandidate.errors.name && formikCreateCandidate.touched.name && (
                  <div className='text-[#ec5555]'>{formikCreateCandidate.errors.name}</div>
                )}
              </div>
              <div className='my-3'>
                <label className='text-lg'>Email</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formikCreateCandidate.errors.email && formikCreateCandidate.touched.email && 'input-error'}`} name='email' placeholder='Input candidate email' value={formikCreateCandidate.values.email} onChange={formikCreateCandidate.handleChange} /><br />
                </div>
                {formikCreateCandidate.errors.email && formikCreateCandidate.touched.email && (
                  <div className='text-[#ec5555]'>{formikCreateCandidate.errors.email}</div>
                )}
              </div>

              <div className='my-3'>
                <label className='text-lg'>Address</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formikCreateCandidate.errors.address && formikCreateCandidate.touched.address && 'input-error'}`} name='address' placeholder='Input candidate address' value={formikCreateCandidate.values.address} onChange={formikCreateCandidate.handleChange} /><br />
                </div>
                {formikCreateCandidate.errors.address && formikCreateCandidate.touched.address && (
                  <div className='text-[#ec5555]'>{formikCreateCandidate.errors.address}</div>
                )}
              </div>
              <div className='my-3'>
                <label className='text-lg'>Phone</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formikCreateCandidate.errors.phone && formikCreateCandidate.touched.phone && 'input-error'}`} name='phone' placeholder='Input phone number' value={formikCreateCandidate.values.phone} onChange={formikCreateCandidate.handleChange} onBlur={formikCreateCandidate.handleBlur} /><br />
                </div>
                {formikCreateCandidate.errors.phone && formikCreateCandidate.touched.phone && (
                  <div className='text-[#ec5555]'>{formikCreateCandidate.errors.phone}</div>
                )}
              </div>
              <div className='flex justify-evenly'>
                <button onClick={() => setOpenModalCreateCandidate(false)} className='bg-[#F64E60] text-[#FFF] px-5 py-2 rounded-lg'>Cancel</button>
                <button type='submit' className='bg-[#20D489] text-[#FFF] px-5 py-2 rounded-lg'>Create</button>
                {isRegisting && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} height={37} />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      <Modal open={openModalCreateJobApply} onClose={() => setOpenModalCreateJobApply(false)}>
        <Box sx={styleModalCreateJobApply}>
          <div className='modal-container'>
            <div className='font-medium text-3xl mb-4'>Create job apply</div>
            <form onSubmit={formikCreateJobApply.handleSubmit}>
              {/* <div className='mb-3'>
                <Autocomplete
                  options={listCandidateData}
                  size={'small'}
                  sx={{ marginRight: 2, width: '100%' }}
                  getOptionLabel={option => option.name}
                  renderInput={(params) => <TextField {...params} label="Choose candidate" />}
                  onChange={(event, value) => { formikCreateJobApply.setFieldValue('candidateId', value.id) }} />
                {formikCreateJobApply.errors.candidateId && formikCreateJobApply.touched.candidateId && (
                  <div className='text-[#ec5555]'>{formikCreateJobApply.errors.candidateId}</div>
                )}
              </div>
              <div className='mb-3' >
                <Autocomplete
                  options={listRecruitmentRequestData}
                  size={'small'}
                  sx={{ marginRight: 2, width: '100%' }}
                  getOptionLabel={option => option.name}
                  renderInput={(params) => <TextField {...params} label="Choose job request" />}
                  onChange={(event, value) => { formikCreateJobApply.setFieldValue('recruitmentRequestId', value.id) }} />
                {formikCreateJobApply.errors.recruitmentRequestId && formikCreateJobApply.touched.recruitmentRequestId && (
                  <div className='text-[#ec5555]'>{formikCreateJobApply.errors.recruitmentRequestId}</div>
                )}
              </div>

              <div className='flex w-full mb-3'>
                <div className='w-[35%] mr-2'>
                  <Autocomplete
                    options={educationLevelData()}
                    size={'small'}
                    sx={{ marginRight: 2, width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Education level" />}
                    onChange={(event, value) => { formikCreateJobApply.setFieldValue('educationLevel', value) }} />
                  {formikCreateJobApply.errors.educationLevel && formikCreateJobApply.touched.educationLevel && (
                    <div className='text-[#ec5555]'>{formikCreateJobApply.errors.educationLevel}</div>
                  )}
                </div>
                <div className='w-[63%]'>
                  <Autocomplete
                    multiple
                    options={foreignLanguageData()}
                    size={'small'}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Foreign language" />}
                    onChange={(event, value) => { formikCreateJobApply.setFieldValue('foreignLanguage', value) }} />
                  {formikCreateJobApply.errors.foreignLanguage && formikCreateJobApply.touched.foreignLanguage && (
                    <div className='text-[#ec5555]'>{formikCreateJobApply.errors.foreignLanguage}</div>
                  )}
                </div>
              </div>

              <div className='my-3 grid grid-cols-2 w-full'>
                <div className=''>
                  <Autocomplete
                    options={categoryData.province}
                    size={'small'}
                    sx={{ width: '95%', marginRight: 2 }}
                    renderInput={(params) => <TextField {...params} label="City" />}
                    onChange={(event, value) => { formikCreateJobApply.setFieldValue('cityName', value) }} />
                  {formikCreateJobApply.errors.cityName && formikCreateJobApply.touched.cityName && (
                    <div className='text-[#ec5555]'>{formikCreateJobApply.errors.cityName}</div>
                  )}
                </div>

                <div className=''>
                  <Autocomplete
                    options={experienceData()}
                    size={'small'}
                    sx={{ width: '100%', marginRight: 2 }}
                    renderInput={(params) => <TextField {...params} label="Experience" />}
                    onChange={(event, value) => { formikCreateJobApply.setFieldValue('experience', value) }} />
                  {formikCreateJobApply.errors.experience && formikCreateJobApply.touched.experience && (
                    <div className='text-[#ec5555]'>{formikCreateJobApply.errors.experience}</div>
                  )}
                </div>
              </div>

              <div className='my-3'>
                <div>Curriculum vitae</div>
                <div className='flex justify-center mt-1'>
                  <TextField
                    variant="outlined"
                    name='fileCV'
                    type={'file'}
                    onChange={(e) => { setFileCV(e.target.files[0]) }}
                  />
                  {formikCreateJobApply.errors.linkCV && formikCreateJobApply.touched.linkCV && (
                    <div className='text-[#ec5555]'>{formikCreateJobApply.errors.linkCV}</div>
                  )}
                </div>
              </div>
              <div className='flex justify-evenly'>
                <button onClick={() => setOpenModalCreateCandidate(false)} className='bg-[#F64E60] text-[#FFF] px-5 py-2 rounded-lg'>Cancel</button>
                <button type='submit' className='bg-[#20D489] text-[#FFF] px-5 py-2 rounded-lg'>Create</button>
                {isApplying && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={35} height={35} />}
              </div> */}
              <div className='mb-3' >
                <Autocomplete
                  options={listRecruitmentRequestData}
                  size={'small'}
                  sx={{ marginRight: 2, width: '100%' }}
                  getOptionLabel={option => option.name}
                  renderInput={(params) => <TextField {...params} label="Choose job request" />}
                  onChange={(event, value) => { formikCreateJobApply.setFieldValue('requestId', value.id) }} />
                {formikCreateJobApply.errors.requestId && formikCreateJobApply.touched.requestId && (
                  <div className='text-[#ec5555]'>{formikCreateJobApply.errors.requestId}</div>
                )}
              </div>
              <TableCreateJobApply formikCreateJobApply={formikCreateJobApply} isApplying={isApplying} />
              <div className='flex justify-end'>
                <button className='bg-[#1DAF5A] text-[#FFF] w-28 h-10 rounded-md flex justify-center items-center'>
                  {isApplying ? <ReactLoading type='spin' color='#FFF' width={25} height={25} /> : <span>Create</span>}
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

export default CandidatePage

class TableCreateJobApply extends React.Component {

  state = {
    rows: [{}]
  };

  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = {
      ...rows[idx],
      [name]: value
    };
    this.setState({ ...this.state.rows, rows });
  };

  handleAddRow = () => {
    const item = {
      name: '',
      email: '',
      linkCV: '',
      source: '',
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows]
    rows.splice(idx, 1)
    this.setState({ rows })
  }

  handleCreateNewJobApplyByEmployee = () => {
    this.props.formikCreateJobApply.listJobApplyByEmployee = { ...this.state.rows }
    // this.props.formikCreateJobApply.listJobApplyByEmployee.onSubmit()
    console.log('aa');
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Link CV</th>
                    <th className="text-center">Source</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <TextField
                          type="text"
                          name="name"
                          size='small'
                          value={this.state.rows[idx].name}
                          onChange={this.handleChange(idx)}
                          className=""
                        />
                      </td>
                      <td>
                        <TextField
                          type="text"
                          name="email"
                          size='small'
                          value={this.state.rows[idx].email}
                          onChange={this.handleChange(idx)}
                          className=""
                        />
                      </td>
                      <td>
                        <TextField
                          type="text"
                          name="linkCV"
                          size='small'
                          value={this.state.rows[idx].linkCV}
                          onChange={this.handleChange(idx)}
                          className=""
                        />
                      </td>
                      <td>
                        <TextField
                          type="text"
                          name="source"
                          size='small'
                          value={this.state.rows[idx].source}
                          onChange={this.handleChange(idx)}
                          className=""
                        />
                      </td>
                      <td>
                        <button type='button' className="px-2 py-1 rounded text-[#F64E60]" style={{ border: '1px solid red' }} onClick={this.handleRemoveSpecificRow(idx)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type='button' onClick={this.handleAddRow} className="px-2 py-1 rounded bg-[#C9F7F5] text-[#1BC5BD]">Add Row</button>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
