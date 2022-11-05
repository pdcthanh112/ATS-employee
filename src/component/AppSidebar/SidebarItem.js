import React from "react";
import Home from "../../assets/icon/home.png";
import Recruitment from "../../assets/icon/recruitment.png";
import Candidates from "../../assets/icon/candidate.png";
import Schedules from "../../assets/icon/calendar.png";
import Settings from "../../assets/icon/settings.png";
import IconUp from "../../assets/icon/caret-arrow-up.png";
import IconDown from "../../assets/icon/caret-arrow-down.png";
import RecruitmentPlan from "../../assets/icon/recruitment-plan.png";
import RecruitmentRequest from "../../assets/icon/request.png";

export const SidebarItem = [
  {
    title: "Dashboard",
    path: "/#/dashboard",
    icon: <img src={Home} alt="" width={"30rem"} />,
  },
  {
    title: "Recruitment",
    path: "/#/recruitment",
    icon: <img src={Recruitment} alt="" width={"20rem"} />,
    iconClosed: <img src={IconDown} alt="" width={"15rem"} />,
    iconOpened: <img src={IconUp} alt="" width={"15rem"} />,

    subNav: [
      {
        title: "Recruitment plan",
        path: "/recruitment-plan",
        icon: <img src={RecruitmentPlan} alt="" width={"20rem"} />,
      },
      {
        title: "Recruitment request",
        path: "/recruitment-request",
        icon: <img src={RecruitmentRequest} alt="" width={"20rem"} />,
      },
    ],
  },
  {
    title: "Candidates",
    path: "/candidate",
    icon: <img src={Candidates} alt="" width={"30rem"} />,
    iconClosed: <img src={IconDown} alt="" width={"15rem"} />,
    iconOpened: <img src={IconUp} alt="" width={"15rem"} />,

    subNav: [
      {
        title: "Reports",
        path: "/reports/reports1",
        icon: <img src={Home} alt="" width={"10rem"} />,
        cName: "sub-nav",
      },
      {
        title: "Reports 2",
        path: "/reports/reports2",
        icon: <img src={Home} alt="" width={"10rem"} />,
        cName: "sub-nav",
      },
      {
        title: "Reports 3",
        path: "/reports/reports3",
        icon: <img src={Home} alt="" width={"10rem"} />,
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