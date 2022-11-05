import React, { useEffect } from 'react'
import './Dashboard.scss'

import { getCategory } from '../../apis/recruimentRequestApi';
import { useDispatch, useSelector } from 'react-redux';


const Dashboard = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    getCategory(dispatch)  
  }, [])


  return (
    <React.Fragment>

      <div className='text-[red]'>asdfasdsaf</div>

    </React.Fragment>
  )
}

export default Dashboard
