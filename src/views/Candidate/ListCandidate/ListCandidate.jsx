import React from 'react'
import './ListCandidate.scss'

import scheduleIcon from '../../../assets/icon/calendar.png'
import folderIcon from '../../../assets/icon/folder-icon.png'

const ListCandidate = ({listCandidate}) => {
  return (
    <div className='table-candidate'>
    <table className="table-auto" >
      <thead>
        <tr className='text-center'>
          <th style={{ width: '24%' }}>Candidate</th>
          <th style={{ width: '12%' }}>Position</th>
          <th style={{ width: '12%' }}>Phone</th>
          <th style={{ width: '22%' }}>Email</th>
          <th style={{ width: '6%' }}>Folder</th>
          <th style={{ width: '12%' }}>Status</th>               
          <th style={{ width: '15%' }}>Action</th>
          <th style={{ width: '7%' }}>Schedule</th>
        </tr>
      </thead>
      <tbody>
        {listCandidate.map((item, id) => (
          <tr key={id} style={{ height: '4rem' }}>
            <td className='inline-flex'>
              <img src={item.image} alt='' width={'50rem'} className='rounded-xl' />
              <span className='px-1'>{item.name}</span>
            </td>
            <td className='text-center'>IT/BA</td>
            <td className='text-center'>{item.phone}</td>
            <td className=''>{item.email}</td>
            <td><img src={folderIcon} alt='' title='Schedule' width={'30rem'} className='m-auto' /></td>
            <td className='text-center'>{item.status}</td>    
            <td className='block text-center mt-3'>
              <a href='/#/' className=''><i title='Edit' className="fa-solid fa-pen-to-square text-2xl mr-2 text-[#53ADFF]"></i></a>
              <a href='/#/' className=''><i title='Delete' className="fa-solid fa-trash-can text-2xl text-[#FF5353]"></i></a>
            </td>
            <td>
              <a href='/#/'><img src={scheduleIcon} alt='' title='Schedule' width={'30rem'} className='m-auto' /></a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default ListCandidate