import React, { useEffect } from 'react'
import './Dashboard.scss'

import { getCategory } from '../../apis/recruimentRequestApi';
import { useDispatch, useSelector } from 'react-redux';
import ChartComponent from './ChartComponent/ChartComponent';


const Dashboard = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    getCategory(dispatch)
  }, [])


  return (
    <React.Fragment>
      <ChartComponent />

    </React.Fragment>
  )
}

export default Dashboard
