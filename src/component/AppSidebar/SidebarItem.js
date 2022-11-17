import React from "react";
import Home from "../../assets/icon/homeNavbar.png";
import Recruitment from "../../assets/icon/recruitmentNavbar.png";
import RecruitmentPlan from "../../assets/icon/recruitment-planNavbar.png";
import PlanDetail from "../../assets/icon/plan-detailNavbar.png";
import RecruitmentRequest from "../../assets/icon/recruitment-requestNavbar.png";
import Candidates from "../../assets/icon/candidatesNavbar.png";
import Interview from "../../assets/icon/job-interviewNavbar.png";
import CuriculumVitae from "../../assets/icon/curriculum-vitaeNavbar.png";
import IconUp from "../../assets/icon/caret-arrow-up.png";
import IconDown from "../../assets/icon/caret-arrow-down.png";

import Notification from "../../assets/icon/notification-iconNavbar.png"

export const SidebarItem = [
  {
    title: "Dashboard",
    path: "/#/dashboard",
    icon: <img src={Home} alt="" width={"30rem"} />,
  },
  {
    title: "Recruitment",
    path: "/recruitment-request",
    icon: <img src={Recruitment} alt="" width={"30rem"} />,
    iconClosed: <img src={IconDown} alt="" width={"15rem"} />,
    iconOpened: <img src={IconUp} alt="" width={"15rem"} />,

    subNav: [
      {
        title: "Recruitment plan",
        path: "/recruitment-plan",
        icon: <img src={RecruitmentPlan} alt="" width={"25rem"} />,
      },
      {
        title: "Plan detail",
        path: "/plan-detail",
        icon: <img src={PlanDetail} alt="" width={"25rem"} />,
      },
      {
        title: "Recruitment request",
        path: "/recruitment-request",
        icon: <img src={RecruitmentRequest} alt="" width={"25rem"} />,
      },
    ],
  },
  {
    title: "Candidates",
    path: "/candidate",
    icon: <img src={Candidates} alt="" width={"30rem"} />,
    iconClosed: <img src={IconDown} alt="" width={"15rem"} />,
    iconOpened: <img src={IconUp} alt="" width={"15rem"} />,

    // subNav: [
    //   {
    //     title: "Reports",
    //     path: "/reports/reports1",
    //     icon: <img src={Home} alt="" width={"10rem"} />,
    //     cName: "sub-nav",
    //   },
    //   {
    //     title: "Reports 2",
    //     path: "/reports/reports2",
    //     icon: <img src={Home} alt="" width={"10rem"} />,
    //     cName: "sub-nav",
    //   },
    //   {
    //     title: "Reports 3",
    //     path: "/reports/reports3",
    //     icon: <img src={Home} alt="" width={"10rem"} />,
    //   },
    // ],
  },
  {
    title: "Interview",
    path: "/interviews",
    icon: <img src={Interview} alt="" width={"30rem"} />,
  },
  {
    title: "Curiculum vitae",
    path: "/curiculum-vitae",
    icon: <img src={CuriculumVitae} alt="" width={"30rem"} />,
  },
  {
    title: "Notification",
    path: "/notification",
    icon: <img src={Notification} alt="" width={"30rem"} />,
  },
];
