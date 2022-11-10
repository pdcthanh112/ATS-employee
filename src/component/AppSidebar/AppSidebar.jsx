import React from 'react'
import './AppSidebar.scss'
import styled from 'styled-components';
import { SidebarItem } from './SidebarItem';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';

const SidebarWrap = styled.div`width: 100%;`;

const AppSidebar = () => {
  return (
    <div className='sidebar-container'>
      <IconContext.Provider> 
          <SidebarWrap>
            {SidebarItem.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
      </IconContext.Provider>
    </div>
  );
};
export default AppSidebar
