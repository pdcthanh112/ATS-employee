import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack, Pagination } from '@mui/material';
import { getCVStorage } from '../../apis/CVApi'
import ShowMoreIcon from '../../assets/icon/viewMore.png'
import ShowLessIcon from '../../assets/icon/viewLess.png'
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
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <div className='listInterviewDetail-container'>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%' }} />
              <TableCell sx={{ fontSize: '1.2rem', fontWeight: '500', width: '5%' }}>#</TableCell>
              <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '5%' }}>CV</TableCell>
              <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Candidate</TableCell>
              <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '8%' }} align='center'>Position</TableCell>
              <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '10%' }} align='center'>Recommend</TableCell>
              <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ListCV.map((item, id) => (
              <Row key={id} ordinalNumbers={(pagination.currentPage-1)*10 + id} item={item} />
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

  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell>{ordinalNumbers + 1}</TableCell>
        <TableCell><a href={item.linkCV} target='_blank' rel="noreferrer"><img src={FileIcon} alt="" title='View CV' width={'30rem'}/></a></TableCell>
        <TableCell>{item.candidate.name}</TableCell>
        <TableCell align="center">{item.position}</TableCell>
        <TableCell align='center'>{item.recommendPositions}</TableCell>
        <TableCell align='center'>{item.candidate.status}</TableCell>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={item.id}>
                    <TableCell sx={{ width: '15%' }} align='center'>{item.candidate.phone}</TableCell>
                    <TableCell>{item.candidate.email}</TableCell>
                    <TableCell align='center'>{item.candidate.address}</TableCell>
                    <TableCell align='center'>{item.note}</TableCell>
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

    </React.Fragment>
  );
}