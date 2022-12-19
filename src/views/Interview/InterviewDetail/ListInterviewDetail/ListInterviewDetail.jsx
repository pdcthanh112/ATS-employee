import React, { useEffect, useState } from 'react'
import './ListInterviewDetail.scss'
import { useSelector } from 'react-redux';
import ShowMoreIcon from '../../../../assets/icon/viewMore.png'
import ShowLessIcon from '../../../../assets/icon/viewLess.png'
import EditIcon from '../../../../assets/icon/edit-icon.png'
import InterviewIcon from '../../../../assets/icon/calendar.png'
import { departmentName, interviewType } from '../../../../utils/constants'
import { durationData, interviewResultData, interviewRoundData } from '../../../../utils/dropdownData'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, Autocomplete, TextField, TextareaAutosize, FormControlLabel, Switch } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading'
import moment from 'moment'
import { useEditInterviewDetail } from '../hooks/interviewDetailHook';
import { useCreateInterviewSchedule } from '../../InterviewSchedule/hooks/interviewScheduleHook'
import { getEmployeeByRecruitmentRequest } from '../../../../apis/employeeApi';

const ListInterviewDetail = ({ listInterviewDetail }) => {
  return (
    <React.Fragment>
      <div className='w-[95%] mx-auto'>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '5%' }} />
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '5%' }}>#</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '20%' }}>Candidate</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }} align='center'>Email</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '5%' }} align='center'>Round</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }} align='center'>Result</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }} align='center'>Date</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }} align='center'>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listInterviewDetail?.map((item, id) => (
                <Row key={id} ordinalNumbers={id + 1} item={item} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

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

export default ListInterviewDetail

const Row = (props) => {

  const { ordinalNumbers, item } = props;
  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);

  const [open, setOpen] = useState(false);
  const [openModalEditDetail, setOpenModalEditDetail] = useState(false)
  const [openModalCreateInterview, setOpenModalCreateInterview] = useState(false)
  const [isEditting, setIsEditting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [listEmployee, setListEmployee] = useState([])

  const [isOnline, setIsOnline] = useState(false)
  const [listEmpInterview, setListEmpInterview] = useState([])

  const { mutate: createInterviewSchedule } = useCreateInterviewSchedule();
  const { mutate: editInterviewDetail } = useEditInterviewDetail();

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
    if (isOnline) {
      formikCreateInterview.values.type = interviewType.ONLINE
      formikCreateInterview.values.address = ''
      formikCreateInterview.values.room = ''
    } else {
      formikCreateInterview.values.type = interviewType.OFFLINE
      formikCreateInterview.values.linkMeeting = ''
    }
  }, [isOnline])


  useEffect(() => {
    const listTmp = []
    if (listEmpInterview) {
      listEmpInterview.map(item => listTmp.push(item.id))
    }
    if (listTmp && listTmp.length > 0) {
      formikCreateInterview.setFieldValue('employeeId', listTmp)
    }
  }, [listEmpInterview])

  const formikEditDetail = useFormik({
    initialValues: {
      detailId: '',
      description: '',
      end: '',
      interviewID: '',
      note: '',
      recommendPositions: '',
      recordMeeting: '',
      result: ''
    },
    validationSchema: Yup.object({
      result: Yup.string().required('Please choose result'),
    }),
    onSubmit: (values) => {
      setIsEditting(true)
      try {
        editInterviewDetail(values, {
          onSuccess: () => {
            toast.success('Edit successfully')
            formikEditDetail.handleReset();
            setOpenModalEditDetail(false)
          },
          onError: (error) => {
            toast.error('Edit fail')
          },
          onSettled: () => {
            setIsEditting(false)
          }
        })
      } catch (error) {
        toast.error('Something error')
      }
    }
  })

  const handleEditPlanDetail = (item) => {
    formikEditDetail.values.detailId = item.id
    formikEditDetail.values.description = item.description
    formikEditDetail.values.end = item.end
    formikEditDetail.values.interviewID = item.interview.id
    formikEditDetail.values.note = item.note
    formikEditDetail.values.recommendPositions = item.recommendPositions.split(',')
    formikEditDetail.values.recordMeeting = item.recordMeeting
    formikEditDetail.values.result = item.result
    setOpenModalEditDetail(true)
  }

  const formikCreateInterview = useFormik({
    initialValues: {
      address: '',
      candidateId: [],
      date: '',
      description: '',
      duration: '',
      employeeId: [],
      linkMeeting: '',
      purpose: '',
      recruitmentRequestId: '',
      room: '',
      round: '',
      subject: '',
      time: '',
      type: ''
    },
    validationSchema: Yup.object({
      //address: Yup.string().required('Please input address'),
      candidateId: Yup.array().min(1, 'Please choose at least 1 candidate'),
      date: Yup.string().required('Please input date'),
      description: Yup.string().required('Please input description'),
      duration: Yup.string().required('Please choose duration'),
      employeeId: Yup.array().min(1, 'Please choose at least 1 employee interview'),
      //linkMeeting: Yup.string().required('Please input link meeting'),
      purpose: Yup.string().required('Please input purpose'),
      recruitmentRequestId: Yup.string().required('Please input address'),
      //room: Yup.string().required('Please input room'),
      round: Yup.string().required('Please choose round'),
      subject: Yup.string().required('Please input subject'),
      time: Yup.string().required('Please input time'),
      //type: Yup.string().required('Please choose type of interview'),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true)
      try {
        createInterviewSchedule(values, {
          onSuccess: () => {
            toast.success('Create successfully')
            setOpenModalCreateInterview(false)
          },
          onError: () => toast.error('Create fail'),
          onSettled: () => {
            setIsSubmitting(false)
          }
        })
      } catch (error) {
        toast.error('Something error')
      }
    }
  })

  const getEmployeeByDepartment = async (item) => {
    formikCreateInterview.values.recruitmentRequestId = item.interview.jobApply.recruitmentRequest.id
    formikCreateInterview.values.candidateId = Array.of(item.interview.candidate.id)
    await getEmployeeByRecruitmentRequest(item.interview.jobApply.recruitmentRequest.id).then((response) => {
      if (response && response.data) {
        setListEmployee(response.data)
      }
    })
    setOpenModalCreateInterview(true)
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell>{ordinalNumbers}</TableCell>
        <TableCell>{item.interview.candidate.name}</TableCell>
        <TableCell>{item.interview.candidate.email}</TableCell>
        <TableCell align="center">{item.interview.round}</TableCell>
        <TableCell align='center'>{item.result}</TableCell>
        <TableCell align='center'>{moment(item.end).format('DD/MM/YYYY')}</TableCell>
        {currentUser.employee.department.id === departmentName.HR_DEPARTMENT && <TableCell align='center'><img src={EditIcon} alt="" width={'24rem'} className='mx-auto hover:cursor-pointer' onClick={() => { handleEditPlanDetail(item) }} /></TableCell>}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                <div className='flex justify-between'>
                  <div>Detail</div>
                  {item.result.toUpperCase().includes('PASS') && <div className='bg-[#20D489] text-[#FFF] text-sm flex justify-center items-center px-2 rounded hover:cursor-pointer' onClick={() => getEmployeeByDepartment(item)}>Create next round interview</div>}
                </div>
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }} align='center'>Purpose</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Industry</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Position</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600' }} align='center'>Interview description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{item.interview.purpose}</TableCell>
                    <TableCell align='center'>{item.interview.jobApply.recruitmentRequest.industry}</TableCell>
                    <TableCell align='center'>{item.interview.jobApply.recruitmentRequest.position.name}</TableCell>
                    <TableCell align='right'>{item.interview.description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }} align='center'>Type</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '40%' }} align='center'>Recommend position</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '30%' }} align='center'>Record meeting</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600' }} align='center'>Detail description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align='center'>{item.interview.type}</TableCell>
                    <TableCell>{item.recommendPositions}</TableCell>
                    <TableCell align='center'>{item.recordMeeting}</TableCell>
                    <TableCell align='right'>{item.interview.interviewDetail.description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal open={openModalEditDetail} onClose={() => setOpenModalEditDetail(false)}>
        <Box sx={style}>
          <div className='px-5 py-5'>
            <form onSubmit={formikEditDetail.handleSubmit}>
              <Autocomplete
                options={interviewResultData()}
                value={formikEditDetail.values.result}
                size={'small'}
                sx={{ width: '100%', marginRight: '2rem' }}
                renderInput={(params) => <TextField {...params} label="Result" />}
                onChange={(event, value) => { formikEditDetail.setFieldValue('result', value) }} />
              {formikEditDetail.errors.result && formikEditDetail.touched.result && (
                <div className='text-[#ec5555]'>{formikEditDetail.errors.result}</div>
              )}

              <div>
                <Autocomplete
                  multiple
                  options={categoryData.position}
                  value={formikEditDetail.values.recommendPositions}
                  size={'small'}
                  sx={{ width: '100%', marginRight: '2rem', marginTop: '2rem' }}
                  renderInput={(params) => <TextField {...params} label="Recommend position" />}
                  onChange={(event, value) => { formikEditDetail.setFieldValue('recommendPositions', value) }} />
                {formikEditDetail.errors.recommendPositions && formikEditDetail.touched.recommendPositions && (
                  <div className='text-[#ec5555]'>{formikEditDetail.errors.recommendPositions}</div>
                )}
              </div>

              <div className='mt-4'>
                <TextField label='Record meeting' variant="outlined" size='small' style={{ width: '100%' }} name='recordMeeting' value={formikEditDetail.values.recordMeeting} onChange={formikEditDetail.handleChange} />
                {formikEditDetail.errors.recordMeeting && formikEditDetail.touched.recordMeeting && (
                  <div className='text-[#ec5555]'>{formikEditDetail.errors.recordMeeting}</div>
                )}
              </div>

              <div className='mt-4'>Description</div>
              <TextareaAutosize
                name='description'
                value={formikEditDetail.values.description}
                minRows={3}
                maxRows={5}
                style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                onChange={formikEditDetail.handleChange}
              />
              {formikEditDetail.errors.description && formikEditDetail.touched.description && (
                <div className='text-[#ec5555]'>{formikEditDetail.errors.description}</div>
              )}

              <div className='mt-4'>Note</div>
              <TextareaAutosize
                name='note'
                value={formikEditDetail.values.note}
                minRows={3}
                maxRows={5}
                style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                onChange={formikEditDetail.handleChange}
              />
              {formikEditDetail.errors.note && formikEditDetail.touched.note && (
                <div className='text-[#ec5555]'>{formikEditDetail.errors.note}</div>
              )}

              <div className='flex justify-evenly mt-5'>
                <button type='button' onClick={() => setOpenModalEditDetail(false)} className='btn-create bg-[#F64E60]'>Cancel</button>
                <button className='btn-create bg-[#20D489]' onClick={formikEditDetail.handleSubmit}>Save</button>
                {isEditting && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={32} height={32} />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      <Modal open={openModalCreateInterview} onClose={() => { setOpenModalCreateInterview(false); formikCreateInterview.handleReset() }}>
        <Box sx={style}>
          <div className='px-5 py-3'>
            <div className='flex'>
              <span className='font-medium text-3xl mr-3'>Create interview</span>
              <img src={InterviewIcon} alt='' width={'30rem'} />
            </div>
            <form onSubmit={formikCreateInterview.handleSubmit}>
              <div>
                <div>
                  <Autocomplete
                    multiple
                    options={listEmployee}
                    size={'small'}
                    sx={{ width: '100%', marginTop: '1rem' }}
                    getOptionLabel={option => option.name}
                    renderInput={(params) => <TextField {...params} label="Employee" />}
                    onChange={(event, value) => { setListEmpInterview(value) }}
                  />
                  {formikCreateInterview.errors.employeeId && formikCreateInterview.touched.employeeId && (
                    <div className='text-[#ec5555]'>{formikCreateInterview.errors.employeeId}</div>
                  )}
                </div>
                <div className='w-full flex mt-3'>
                  <div className='w-[22%] mr-3'>
                    <Autocomplete
                      options={interviewRoundData()}
                      size={'small'}
                      sx={{ width: 100 }}
                      renderInput={(params) => <TextField {...params} label="Round" />}
                      onChange={(event, value) => { formikCreateInterview.setFieldValue('round', value) }}
                    />
                    {formikCreateInterview.errors.round && formikCreateInterview.touched.round && (
                      <div className='text-[#ec5555]'>{formikCreateInterview.errors.round}</div>
                    )}
                  </div>
                  <div className='w-[100%]'>
                    <TextField
                      label='Subject'
                      name='subject'
                      variant="outlined"
                      size='small'
                      style={{ width: '100%' }}
                      value={formikCreateInterview.values.subject}
                      onChange={formikCreateInterview.handleChange}
                    />
                    {formikCreateInterview.errors.subject && formikCreateInterview.touched.subject && (
                      <div className='text-[#ec5555]'>{formikCreateInterview.errors.subject}</div>
                    )}
                  </div>
                </div>
                <div className='flex justify-evenly mt-3'>
                  <div>
                    <TextField
                      type={'date'}
                      name='date'
                      variant="outlined"
                      size='small'
                      style={{ width: '100%' }}
                      value={formikCreateInterview.values.date}
                      onChange={formikCreateInterview.handleChange}
                    />
                    {formikCreateInterview.errors.date && formikCreateInterview.touched.date && (
                      <div className='text-[#ec5555]'>{formikCreateInterview.errors.date}</div>
                    )}
                  </div>
                  <div>
                    <TextField
                      type={'time'}
                      name='time'
                      variant="outlined"
                      size='small'
                      style={{ width: '100%' }}
                      value={formikCreateInterview.values.time}
                      onChange={formikCreateInterview.handleChange}
                    />
                    {formikCreateInterview.errors.time && formikCreateInterview.touched.time && (
                      <div className='text-[#ec5555]'>{formikCreateInterview.errors.time}</div>
                    )}
                  </div>
                </div>

                <Autocomplete
                  options={durationData()}
                  size={'small'}
                  sx={{ width: '100%', marginTop: '1rem' }}
                  getOptionLabel={option => option.title}
                  renderInput={(params) => <TextField {...params} label="Duration" />}
                  onChange={(event, value) => { formikCreateInterview.setFieldValue('duration', value.value) }}
                />
                {formikCreateInterview.errors.duration && formikCreateInterview.touched.duration && (
                  <div className='text-[#ec5555]'>{formikCreateInterview.errors.duration}</div>
                )}

                <div className='mt-4'>Purpose</div>
                <TextareaAutosize
                  name='purpose'
                  value={formikCreateInterview.values.purpose}
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                  onChange={formikCreateInterview.handleChange}
                />
                {formikCreateInterview.errors.purpose && formikCreateInterview.touched.purpose && (
                  <div className='text-[#ec5555]'>{formikCreateInterview.errors.purpose}</div>
                )}

                <FormControlLabel control={<Switch onChange={(event) => setIsOnline(event.target.checked)} />} label={isOnline ? 'Online' : 'Offline'} />

                {isOnline ? <div>
                  <TextField
                    label='Link meeting'
                    name='linkMeeting'
                    variant="outlined"
                    size='small'
                    style={{ width: '100%', marginTop: '1rem' }}
                    value={formikCreateInterview.values.linkMeeting}
                    onChange={formikCreateInterview.handleChange}
                  />
                </div> : <div>
                  <div>
                    <TextField
                      label='Room'
                      name='room'
                      variant="outlined"
                      size='small'
                      style={{ width: '100%', marginTop: '1rem' }}
                      value={formikCreateInterview.values.room}
                      onChange={formikCreateInterview.handleChange}
                    />
                    {formikCreateInterview.errors.room && formikCreateInterview.touched.room && (
                      <div className='text-[#ec5555]'>{formikCreateInterview.errors.room}</div>
                    )}
                  </div>
                  <div>
                    <TextField
                      label='Address'
                      name='address'
                      variant="outlined"
                      size='small'
                      style={{ width: '100%', marginTop: '1rem' }}
                      value={formikCreateInterview.values.address}
                      onChange={formikCreateInterview.handleChange} />
                    {formikCreateInterview.errors.address && formikCreateInterview.touched.address && (
                      <div className='text-[#ec5555]'>{formikCreateInterview.errors.address}</div>
                    )}
                  </div>
                </div>}

                <div className='mt-4'>Description</div>
                <TextareaAutosize
                  name='description'
                  value={formikCreateInterview.values.description}
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                  onChange={formikCreateInterview.handleChange}
                />
                {formikCreateInterview.errors.description && formikCreateInterview.touched.description && (
                  <div className='text-[#ec5555]'>{formikCreateInterview.errors.description}</div>
                )}
              </div>
              <div className='flex justify-evenly mt-5'>
                <button type='button' onClick={() => setOpenModalCreateInterview(false)} className='btn-create bg-[#F64E60]'>Cancel</button>
                <button className='btn-create bg-[#20D489]' onClick={formikCreateInterview.handleSubmit}>Save</button>
                {isSubmitting && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={32} height={32} />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
