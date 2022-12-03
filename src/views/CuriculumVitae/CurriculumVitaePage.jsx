import React, { useState, useEffect } from 'react'
import './CurriculumVitaePage.scss'
import { useSelector } from 'react-redux'
import { Box, Modal, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack, Pagination, TextField, TextareaAutosize } from '@mui/material';
import { getCVStorage } from '../../apis/CVApi'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ShowMoreIcon from '../../assets/icon/viewMore.png'
import ShowLessIcon from '../../assets/icon/viewLess.png'
import SendMailIcon from '../../assets/icon/send-mail.png'
import ReactLoading from 'react-loading'
import FileIcon from '../../assets/icon/file-icon.png'

const CurriculumVitaePage = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const [ListCV, setListCV] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getCVStorage(currentUser.token, pagination.currentPage - 1, 10);
      if (response && response.data) {
        setListCV(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <div className='cv-container'>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '3%' }} />
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '500', width: '3%' }}>#</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '5%' }}>CV</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Candidate</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '8%' }} align='center'>Position</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '10%' }} align='center'>Recommend</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '8%' }} align='center'>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ListCV.map((item, id) => (
                <Row key={id} ordinalNumbers={(pagination.currentPage - 1) * 10 + id} item={item} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className='flex justify-center bg-[#FFF]'>
          <Stack spacing={2}>
            <Pagination variant="outlined" shape="rounded" count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>}
    </React.Fragment>
  )
}

export default CurriculumVitaePage

const Row = (props) => {

  const { ordinalNumbers, item } = props;

  const [open, setOpen] = useState(false);
  const [openModalInvite, setOpenModalInvite] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const style = {
    position: 'absolute',
    top: '20rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    maxHeight: 600,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  const formikInvite = useFormik({
    initialValues: {
      email: '',
      title: 'Thư mời ứng viên',
      content: 'Chào bạn \n Chúng tôi đang tuyển vị trí ..... \n Qua quá trình xem xét hồ sơ chúng tôi nhận thấy bạn phù hợp với công việc này, vì vậy chúng tôi mời bạn ứng tuyển vào vị trí này'
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Please input title'),
      content: Yup.string().required('Please input content'),
    }),
    onSubmit: async (values) => {
      // setIsSubmitting(true)
      // await createInterview(currentUser.token, values).then((response) => {
      //   response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
      // })
      // setIsSubmitting(false)
    }
  })

  const handleInviteCandidate = (item) => {
    formikInvite.values.email = item.candidate.email
    setOpenModalInvite(true)
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell>{ordinalNumbers + 1}</TableCell>
        <TableCell><a href={item.linkCV} target='_blank' rel="noreferrer"><img src={FileIcon} alt="" title='View CV' width={'30rem'} /></a></TableCell>
        <TableCell>{item.candidate.name}</TableCell>
        <TableCell align="center">{item.positionApplied}</TableCell>
        <TableCell align='center'>{item.recommendPositions}</TableCell>
        <TableCell style={{ display: 'flex', justifyContent: 'center' }}>{item.candidate.status === 'ACTIVATE' ? <div className='label-status bg-[#BDF5CA] text-[#1BC55F]'>active</div> : <div className='label-status bg-[#FFE2E5] text-[#F64E60]'>inactive</div>}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detail</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Phone</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }} align='center'>Email</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '35%' }} align='center'>Address</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }} align='center'>Note</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }} align='center'>Invite</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={item.id}>
                    <TableCell sx={{ width: '15%' }} align='center'>{item.candidate.phone}</TableCell>
                    <TableCell>{item.candidate.email}</TableCell>
                    <TableCell align='center'>{item.candidate.address}</TableCell>
                    <TableCell align='center'>{item.note}</TableCell>
                    <TableCell align='center'><img src={SendMailIcon} alt="" title='invite candidate for job' width={'30rem'} className='hover:cursor-pointer' onClick={() => handleInviteCandidate(item)} /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {/* <Table size="small">
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
              </Table> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal open={openModalInvite} onClose={() => { setOpenModalInvite(false) }}>
        <Box sx={style}>
          <div className='px-5 py-3'>
            <div className='flex justify-end font-medium text-lg hover:cursor-pointer' title='Close' onClick={() => openModalInvite(false)}>x</div>
            <form onSubmit={formikInvite.handleSubmit}>
              <div className='mt-4'>
                <TextField
                  label='Email'
                  name='email'
                  variant="outlined"
                  size='small'
                  style={{ width: '100%' }}
                  value={formikInvite.values.email}
                  disabled
                />
              </div>

              <div className='mt-4'>
                <TextField
                  label='Title'
                  name='title'
                  variant="outlined"
                  size='small'
                  style={{ width: '100%' }}
                  value={formikInvite.values.title}
                  onChange={formikInvite.handleChange} />
                {formikInvite.errors.title && formikInvite.touched.title && (
                  <div className='text-[#ec5555]'>{formikInvite.errors.title}</div>
                )}
              </div>

              <div className='mt-4'>Content</div>
              <TextareaAutosize
                name='content'
                value={formikInvite.values.content}
                minRows={5}
                maxRows={8}
                style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                onChange={formikInvite.handleChange}
              />
              {formikInvite.errors.content && formikInvite.touched.content && (
                <div className='text-[#ec5555]'>{formikInvite.errors.content}</div>
              )}

              <div className='my-3 flex justify-center'>
                <button className='w-28 h-10 rounded-lg flex justify-center items-center bg-[#1DAF5A] text-[#FFE2E5]'>
                {isInviting ? <ReactLoading className='ml-2' type='spin' color='#FFF' width={25} height={25}/> : <span>Send</span>}
                  </button>               
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}