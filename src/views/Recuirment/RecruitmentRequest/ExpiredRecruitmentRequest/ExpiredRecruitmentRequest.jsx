import React, { useState, useEffect } from 'react'
import { closeRecruimentRequest, getExpiryDateRecruitmentRequest } from '../../../../apis/recruimentRequestApi'
import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'
import { Box, Paper, Checkbox, TableHead, TableCell, TableRow, TableBody, Table, TableContainer, TablePagination, TableSortLabel, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import moment from 'moment'
import { useConfirm } from "material-ui-confirm";
import { responseStatus } from '../../../../utils/constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpiredRecruitmentRequest = () => {

  const [listExpiredRecruitmentRequest, setListExpiredRecruitmentRequest] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getExpiryDateRecruitmentRequest();
      if (response) {
        setListExpiredRecruitmentRequest(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = listExpiredRecruitmentRequest.map((n) => n.id);
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listExpiredRecruitmentRequest.length) : 0;

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} listSelected={selected} />
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <EnhancedTableHead
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={listExpiredRecruitmentRequest.length}
                />
                <TableBody>

                  {listExpiredRecruitmentRequest.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const isItemSelected = isSelected(row.id);

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox color="primary" checked={isItemSelected}/>
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="right">{row.creator.name}</TableCell>
                        <TableCell align="center">{row.planDetail.amount}</TableCell>
                        <TableCell align="left">{row.planDetail.reason}</TableCell>
                        <TableCell align="right">{moment(row.expiryDate).format('DD/MM/YYYY')}</TableCell>
                      </TableRow>
                    );
                  })}
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
              count={listExpiredRecruitmentRequest.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      }
    </React.Fragment>
  )
}

export default ExpiredRecruitmentRequest

function EnhancedTableHead(props) {

  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{'aria-label': 'select all desserts',}}
          />
        </TableCell>
        <TableCell align={'center'}>Recruitment name</TableCell>
        <TableCell align={'center'}>Creator</TableCell>
        <TableCell align={'center'}>Amount</TableCell>
        <TableCell align={'center'}>Reason</TableCell>
        <TableCell align={'center'}>Expiry date</TableCell>
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const { numSelected, listSelected } = props;
  const confirm = useConfirm();

  const handleCloseRecruitment = async (listRequestId) => {
    await confirm({ description: "Are you sure to close this recruitment request?" }).then(() => {
      closeRecruimentRequest(currentUser.token, listRequestId).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Delete successfully') : toast.error('Something error')
      })
    })
  }

  return (
    <React.Fragment>
      <Toolbar>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Choose
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon onClick={() => { handleCloseRecruitment(listSelected) }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

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


