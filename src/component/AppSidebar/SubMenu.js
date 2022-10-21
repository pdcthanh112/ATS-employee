import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

  return (
    <>
      <SidebarLink to={item.path}>
        <div className="inline-flex">
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div onClick={item.subNav && showSubnav}>
          {item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              {item.icon}
              <SidebarLabel>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
