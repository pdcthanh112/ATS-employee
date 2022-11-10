import React from 'react'
import './ListPlanDetail.scss'

import ShowMoreComponent from '../../ShowMoreComponent/ShowMoreComponent'
import CalendarIcon from './../../../../assets/icon/calendar.png'

const ListPlanDetail = ({listPlanDetail}) => {
  return (
    <div className='listPlanDetail-container'>
      {listPlanDetail.map((item, id) => (
        <div key={id} className='planDetail-item'>
          <div>
            <span className='process-buton text-[#1BC5BD] bg-[#C9F7F5] ml-32 hover:cursor-pointer'>APPROVE</span>
            <span className='process-buton text-[#F64E60] bg-[#FFE2E5] ml-10 hover:cursor-pointer'>Reject</span>
          </div>
          <div>    
              <div className='font-semibold text-xl mt-3'>Thời gian</div>
              <div className='grid grid-cols-2 px-1'>
                <div>
                  <div className='font-medium text-base'>Từ</div>
                  <div className='item-value w-[80%] justify-between'>{item.periodFrom}<img src={CalendarIcon} alt='' width={'18rem'}/></div>
                </div>
                <div>
                  <div className='font-medium text-base'>Đến</div>
                  <div className='item-value w-[80%] justify-between'>{item.periodTo}<img src={CalendarIcon} alt='' width={'18rem'}/></div>
                </div>
              </div>
              <div className='grid grid-cols-3 mt-3'>
                <div>
                  <div className='font-semibold text-xl mb-1'>Số lượng</div>
                  <div className='item-value w-[60%] justify-center ml-10'>{item.amount}</div>
                </div>
                <div>
                  <div className='font-semibold text-xl mb-1'>Mức lương</div>
                  <div className='item-value w-[70%]'>{item.salary}</div>
                </div>
                <div>
                  <div className='font-semibold text-xl mb-1'>Vị trí</div>
                  <div className='item-value w-[80%]'>{item.position.name}</div>
                </div>
              </div>
          </div>
         <div className='mt-2 pl-5'>
         <div><ShowMoreComponent title='Reason' content={item.reason} /></div>
          <div><ShowMoreComponent title='Description' content={item.description} /></div>
          <div><ShowMoreComponent title='Requirment' content={item.requirement} /></div>
          <div><ShowMoreComponent title='Note' content={item.reason} /></div>         
         </div>
        </div>
      ))}
    </div>
  )
}

export default ListPlanDetail