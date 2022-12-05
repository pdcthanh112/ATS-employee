import React, { useState } from 'react'
import './ListInterviewDetail.scss'
import { useSelector } from 'react-redux';
import ShowMoreIcon from '../../../../assets/icon/viewMore.png'
import ShowLessIcon from '../../../../assets/icon/viewLess.png'
import EditIcon from '../../../../assets/icon/edit-icon.png'
import { departmentName, responseStatus } from '../../../../utils/constants'
import { editInterviewDetail } from '../../../../apis/interviewDetailApi'
import { interviewResultData } from '../../../../utils/dropdownData'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, Autocomplete, TextField, TextareaAutosize } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading'
import moment from 'moment'

const ListInterviewDetail = ({ listInterviewDetail }) => {

  return (
    <React.Fragment>
      <div className='listInterviewDetail-container'>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '5%' }} />
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '500', width: '5%' }}>#</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '20%' }}>Candidate</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '25%' }} align='center'>Email</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '8%' }} align='center'>Round</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '10%' }} align='center'>Result</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Date</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '10%' }} align='center'>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listInterviewDetail.map((item, id) => (
                <Row key={id} ordinalNumbers={id} item={item} />
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
  const [isEditting, setIsEditting] = useState(false)

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

  const formikEditDetail = useFormik({
    initialValues: {
      detailId: '',
      description: '',
      end: new Date().toJSON().slice(0, 10),
      interviewID: '',
      note: '',
      recommendPositions: '',
      recordMeeting: '',
      result: ''
    },
    validationSchema: Yup.object({
      result: Yup.string().required('Please choose result'),
    }),
    onSubmit: async (values) => {
      setIsEditting(true)
      formikEditDetail.values.recommendPositions = formikEditDetail.values.recommendPositions.toString();
      await editInterviewDetail(currentUser.token, values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Edit successfully') : toast.error('Something error')
      })
      setIsEditting(false)
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

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell>{ordinalNumbers + 1}</TableCell>
        <TableCell>{item.interview.candidate.name}</TableCell>
        <TableCell>{item.interview.candidate.email}</TableCell>
        <TableCell align="center">{item.interview.round}</TableCell>
        <TableCell align='center'>{item.result}</TableCell>
        <TableCell align='center'>{moment(item.end).format('DD/MM/YYYY')}</TableCell>
        {currentUser.employee.department.id === departmentName.HR_DEPARTMENT && <TableCell align='center'><img src={EditIcon} alt="" width={'30rem'} className='mx-auto hover:cursor-pointer' onClick={() => { handleEditPlanDetail(item) }} /></TableCell>}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detail</Typography>
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
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '40%' }} align='center'>Address</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '30%' }} align='center'>Record meeting</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600' }} align='center'>Detail description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align='center'>{item.interview.type}</TableCell>
                    <TableCell>{item.interview.type === 'ONLINE' ? item.interview.linkMeeting : item.interview.address}</TableCell>
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
                {isEditting && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}