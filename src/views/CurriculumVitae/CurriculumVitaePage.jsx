import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Checkbox, Collapse, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextareaAutosize, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { useFormik } from 'formik';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { getCVStorage } from '../../apis/CVApi';
import FileIcon from '../../assets/icon/file-icon.png';
import SearchIcon from '../../assets/icon/filter.png';
import SendMailIcon from '../../assets/icon/send-mail.png';
import ShowLessIcon from '../../assets/icon/viewLess.png';
import ShowMoreIcon from '../../assets/icon/viewMore.png';
import './CurriculumVitaePage.scss';

import FilterListIcon from '@mui/icons-material/FilterList';
import MarkunreadIcon from '@mui/icons-material/Markunread';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inviteReapply } from '../../apis/jobApplyApi';
import { departmentName, responseStatus } from '../../utils/constants';

const CurriculumVitaePage = () => {

  const categoryData = useSelector((state) => state.categoryData.data);

  const [listCV, setListCV] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getCVStorage();
      if (response && response.data) {
        setListCV(response.data)
      }
      setIsLoading(false)
    }
    fetchData();
  }, [])


  const formikSearch = useFormik({
    initialValues: {
      positionApplied: '',
      recommendPositions: []
    },
    onSubmit: async (values) => {
      console.log('search', values);
      // setIsLoading(true)
      // await searchInterviewSchedule(currentUser.token, values).then((response) => {
      //   if (response && response.data) {
      //     setListInterviewSchedule(response.data)
      //   }
      // })
      // setIsLoading(false)
    }
  })

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = listCV.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listCV.length) : 0;

  return (
    <React.Fragment>

      <div className='filter-container'>
        <Autocomplete
          options={categoryData.jobTitle}
          size={'small'}
          sx={{ width: 220, marginRight: 2 }}
          renderInput={(params) => <TextField {...params} label="Position applied" />}
          onInputChange={(event, value) => { formikSearch.setFieldValue('round', value) }}
        />

        <Autocomplete
          options={categoryData.jobTitle}
          size={'small'}
          sx={{ width: 270, marginRight: 2 }}
          renderInput={(params) => <TextField {...params} label="Recommend position" />}
          onInputChange={(event, value) => { formikSearch.setFieldValue('type', value) }}
        />

        <img src={SearchIcon} alt="" width={'45rem'} title='Search' className='hover:cursor-pointer' onClick={formikSearch.handleSubmit} />
      </div>

      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <div className='cv-container'>
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} listSelected={selected} />
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <EnhancedTableHead
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={listCV.length}
                />

                <TableBody>
                  {listCV.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <Row key={index} item={row} handleClick={handleClick} selected={selected} />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20, 25, 50]}
              component="div"
              count={listCV.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </div>}
    </React.Fragment>
  )
}

export default CurriculumVitaePage

const Row = (props) => {

  const { item, handleClick, selected } = props;
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isItemSelected = isSelected(item.id);
  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [open, setOpen] = useState(false);
  const [openModalInvite, setOpenModalInvite] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const style = {
    position: 'absolute',
    top: '20rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    maxHeight: 800,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  const formikInvite = useFormik({
    initialValues: {
      email: '',
      cvIds: '',
      title: 'Invitation letter for candidates',
      content: 'Dear ...... \n\nWe are recruiting for a new position ....... \n\nThrough our review of the resumes you have previously applied for, we have found that you are a good fit for this job. We therefore cordially invite you to reapply for this position. \n\nWe hope to see you again. \nCKHR team,'
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Please input title'),
      content: Yup.string().required('Please input content'),
    }),
    onSubmit: async (values) => {
      setIsInviting(true)
      await inviteReapply(values).then((response) => {
        if (response.status === responseStatus.SUCCESS) {
          toast.success('Invite successfully')
          setOpenModalInvite(false)
        } else {
          toast.error('Somethings error')
        }
      })
      setIsInviting(false)
    }
  })

  const handleInviteCandidate = (item) => {
    formikInvite.values.email = item.candidate.email
    formikInvite.values.cvIds = [item.id]
    setOpenModalInvite(true)
  }

  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={item.id}
        selected={isItemSelected}
      >
        {currentUser.employee.department.id === departmentName.HR_DEPARTMENT &&
          <TableCell padding="checkbox">
            <Checkbox color="primary" checked={isItemSelected} onClick={(event) => handleClick(event, item.id)} />
          </TableCell>
        }
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell><a href={item.linkCV} target='_blank' rel="noreferrer" className='flex justify-center'><img src={FileIcon} alt="" style={{ width: '2rem' }} /></a></TableCell>
        <TableCell align="left">{item.candidate.name}</TableCell>
        <TableCell align="center">{item.positionApplied}</TableCell>
        <TableCell align="center">{item.recommendPositions}</TableCell>
        <TableCell style={{ display: 'flex', justifyContent: 'center' }}>{item.candidate.status === 'ACTIVATE' ? <div className='label-status bg-[#BDF5CA] text-[#1BC55F]'>active</div> : <div className='label-status bg-[#FFE2E5] text-[#F64E60]'>inactive</div>}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detail</Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
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
                      <TableCell align='center'>
                        <div className='flex justify-center'>
                          <img src={SendMailIcon} alt="" title='invite candidate for job' width={'30rem'} className='hover:cursor-pointer' onClick={() => handleInviteCandidate(item)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal open={openModalInvite} onClose={() => { setOpenModalInvite(false) }}>
        <Box sx={style}>
          <div className='px-5 py-3'>
            <div className='flex justify-end font-medium text-lg'>
              <span className='hover:cursor-pointer' title='Close' onClick={() => setOpenModalInvite(false)}>x</span>
            </div>
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
                  {isInviting ? <ReactLoading className='ml-2' type='spin' color='#FFF' width={25} height={25} /> : <span>Send</span>}
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function EnhancedTableHead(props) {

  const { onSelectAllClick, numSelected, rowCount } = props;
  const currentUser = useSelector((state) => state.auth.login.currentUser)

  return (
    <TableHead>
      <TableRow>
        {currentUser.employee.department.id === departmentName.HR_DEPARTMENT &&
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts', }}
            />
          </TableCell>
        }
        <TableCell align={'center'} sx={{ fontSize: '1rem', fontWeight: '600', width: '5%' }}>Show</TableCell>
        <TableCell align={'center'} sx={{ fontSize: '1.1rem', fontWeight: '600', width: '5%' }}>CV</TableCell>
        <TableCell align={'center'} sx={{ fontSize: '1.1rem', fontWeight: '600', width: '35%' }}>Candidate</TableCell>
        <TableCell align={'center'} sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }}>Position</TableCell>
        <TableCell align={'center'} sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }}>Recommend</TableCell>
        <TableCell align={'center'} sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }}>status</TableCell>
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {

  const { numSelected, listSelected } = props;
  const [openModalInvite, setOpenModalInvite] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const style = {
    position: 'absolute',
    top: '20rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    maxHeight: 800,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  const formikInvite = useFormik({
    initialValues: {
      cvIds: '',
      title: 'Invitation letter for candidates',
      content: 'Dear ...... \n\nWe are recruiting for a new position ....... \n\nThrough our review of the resumes you have previously applied for, we have found that you are a good fit for this job. We therefore cordially invite you to reapply for this position. \n\nWe hope to see you again. \nCKHR team,'
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Please input title'),
      content: Yup.string().required('Please input content'),
    }),
    onSubmit: async (values) => {
      setIsInviting(true)
      await inviteReapply(values).then((response) => {
        if (response.status === responseStatus.SUCCESS) {
          toast.success('Invite successfully')
          setOpenModalInvite(false)
        } else {
          toast.error('Somethings error')
        }
      })
      setIsInviting(false)
    }
  })

  const handleInviteCandidate = (listCVId) => {
    formikInvite.values.cvIds = listCVId
    setOpenModalInvite(true)
  }

  return (
    <React.Fragment>
      <Toolbar>
        {numSelected > 0 ?
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">{numSelected} selected</Typography>
          :
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">Choose</Typography>}

        {numSelected > 0 ?
          <Tooltip title="Invite all">
            <IconButton>
              <MarkunreadIcon onClick={() => { handleInviteCandidate(listSelected) }} />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        }
      </Toolbar>

      <Modal open={openModalInvite} onClose={() => { setOpenModalInvite(false) }}>
        <Box sx={style}>
          <div className='px-5 py-3'>
            <div className='flex justify-end font-medium text-lg'>
              <span className='hover:cursor-pointer' title='Close' onClick={() => setOpenModalInvite(false)}>x</span>
            </div>
            <form onSubmit={formikInvite.handleSubmit}>
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
                  {isInviting ? <ReactLoading className='ml-2' type='spin' color='#FFF' width={25} height={25} /> : <span>Send</span>}
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


