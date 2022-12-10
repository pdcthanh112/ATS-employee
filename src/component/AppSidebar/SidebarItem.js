import React from "react";
import Home from "../../assets/icon/homeNavbar.png";
import Recruitment from "../../assets/icon/recruitmentNavbar.png";
import RecruitmentPlan from "../../assets/icon/recruitment-planNavbar.png";
import PlanDetail from "../../assets/icon/plan-detailNavbar.png";
import RecruitmentRequest from "../../assets/icon/recruitment-requestNavbar.png";
import Candidates from "../../assets/icon/candidatesNavbar.png";
import JobApply from "../../assets/icon/jobApply-sidebar.png";
import Interview from "../../assets/icon/job-interviewNavbar.png";
import InterviewSchedule from "../../assets/icon/interviewSchedule-sidebar.png";
import InterviewDetail from "../../assets/icon/interviewDetail-sidebar.png";
import CurriculumVitae from "../../assets/icon/curriculum-vitaeNavbar.png";
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
    //path: "/recruitment-request",
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
        title: "Job request",
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
  },
  {
    title: "Job apply",
    path: "/job-apply",
    icon: <img src={JobApply} alt="" width={"30rem"} />,   
  },
  {
    title: "Interview",
    //path: "/interview-schedule",
    icon: <img src={Interview} alt="" width={"30rem"} />,
    iconClosed: <img src={IconDown} alt="" width={"15rem"} />,
    iconOpened: <img src={IconUp} alt="" width={"15rem"} />,
       
    subNav: [
      {
        title: "Interview schedule",
        path: "/interview-schedule",
        icon: <img src={InterviewSchedule} alt="" width={"25rem"} />,      
      },
      {
        title: "Interview detail",
        path: "/interview-detail",
        icon: <img src={InterviewDetail} alt="" width={"25rem"} />,      
      },
    ],
  },
  {
    title: "Curriculum vitae",
    path: "/curriculum-vitae",
    icon: <img src={CurriculumVitae} alt="" width={"30rem"} />,
  },
  {
    title: "Notification",
    path: "/notification",
    icon: <img src={Notification} alt="" width={"30rem"} />,   
  },
];
