import React from "react";
import home from "../../assets/icon/home.png";
import Recruitment from "../../assets/icon/recruitment.png";
import Candidates from "../../assets/icon/cv.png";
import Schedules from "../../assets/icon/calendar.png";
import Settings from "../../assets/icon/settings.png";

export const SidebarItem = [
  {
    title: "Dashboard",
    path: "/#/dashboard",
    icon: <img src={home} alt="" width={"30rem"} />,
  },
  {
    title: "Recruitment",
    path: "/#/recruitment",
    icon: <img src={Recruitment} alt="" width={"20rem"} />,
    iconClosed: <img src={home} alt="" width={"10rem"} />,
    iconOpened: <img src={home} alt="" width={"10rem"} />,

    subNav: [
      {
        title: "Users",
        path: "/overview/users",
        icon: <img src={home} alt="" width={"20rem"} />,
      },
      {
        title: "Revenue",
        path: "/overview/revenue",
        icon: <img src={home} alt="" width={"20rem"} />,
      },
    ],
  },
  {
    title: "Candidates",
    path: "/candidate",
    icon: <img src={Candidates} alt="" width={"30rem"} />,
    iconClosed: <img src={home} alt="" width={"10rem"} />,
    iconOpened: <img src={home} alt="" width={"10rem"} />,

    subNav: [
      {
        title: "Reports",
        path: "/reports/reports1",
        icon: <img src={home} alt="" width={"10rem"} />,
        cName: "sub-nav",
      },
      {
        title: "Reports 2",
        path: "/reports/reports2",
        icon: <img src={home} alt="" width={"10rem"} />,
        cName: "sub-nav",
      },
      {
        title: "Reports 3",
        path: "/reports/reports3",
        icon: <img src={home} alt="" width={"10rem"} />,
      },
    ],
  },
  {
    title: "Schedules",
    path: "/schedules",
    icon: <img src={Schedules} alt="" width={"30rem"} />,

  },
  {
    title: "Settings",
    path: "/settings",
    icon: <img src={Settings} alt="" width={"30rem"} />,

  },
];
