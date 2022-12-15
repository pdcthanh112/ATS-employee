import React, { useState } from 'react'
import './ViewJobApply.scss'

import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import PassScreeningPage from './PassScreeningPage/PassScreeningPage'
import FailScreeningPage from './FailScreeningPage/FailScreeningPage'

const ViewJobApply = () => {

  const [currentTab, setCurrentTab] = useState('1');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <TabContext value={currentTab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
          <Tab label="Pass screening" value="1" />
          <Tab label="Fail screening" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1"><PassScreeningPage /></TabPanel>
      <TabPanel value="2"><FailScreeningPage /></TabPanel>
    </TabContext>
  )
}

export default ViewJobApply

