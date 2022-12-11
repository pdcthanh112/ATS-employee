import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { store } from "../../redux/store";
import { departmentName } from "../../utils/constants";

const SidebarLink = styled(Link)`
  display: flex;
  color: #000;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: #67e86e;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 12px;
`;

const DropdownLink = styled(Link)`
  background: #63f16b;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #000;
  font-size: 18px;
  &:hover {
    background: #37df40;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);
  const currentUser = store.getState().auth.login.currentUser;

  return (
    <React.Fragment>
      {currentUser.employee.department.id === departmentName.HR_DEPARTMENT || currentUser.roleName === "ADMIN" || !item.onlyHR? (
        <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
          <div className="inline-flex text-[#FFF]">
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
          </div>
          <div>
            {item.subNav && subnav
              ? item.iconOpened
              : item.subNav
              ? item.iconClosed
              : null}
          </div>
        </SidebarLink>
      ) : (
        <></>
      )}
      {/* {currentUser.employee.department.id === departmentName.HR_DEPARTMENT || currentUser.roleName === 'ADMIN' ? (
        <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
          <div className="inline-flex text-[#FFF]">
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
          </div>
          <div>
            {item.subNav && subnav
              ? item.iconOpened
              : item.subNav
              ? item.iconClosed
              : null}
          </div>
        </SidebarLink>
      ) : (
        <>
          {!item.onlyHR && (
            <>
              <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
                <div className="inline-flex text-[#FFF]">
                  {item.icon}
                  <SidebarLabel>{item.title}</SidebarLabel>
                </div>
                <div>
                  {item.subNav && subnav
                    ? item.iconOpened
                    : item.subNav
                    ? item.iconClosed
                    : null}
                </div>
              </SidebarLink>
            </>
          )}
        </>
      )} */}
      {subnav &&
        item.subNav.map((item, index) => (
          <DropdownLink to={item.path} key={index}>
            <div className="inline-flex text-[#FFF]">
              {item.icon}
              <SidebarLabel>{item.title}</SidebarLabel>
            </div>
          </DropdownLink>
        ))}
    </React.Fragment>
  );
};

export default SubMenu;
