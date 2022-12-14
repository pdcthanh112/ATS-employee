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
 import Statistics from "../../assets/icon/pie-chart.png"

export const SidebarItem = [
  {
    title: "Dashboard",
    path: "/#/dashboard",
    icon: <img src={Home} alt="" width={"30rem"} />,
    onlyHR: false,
  },
  {
    title: "Recruitment",
    //path: "/recruitment-request",
    icon: <img src={Recruitment} alt="" width={"30rem"} />,
    iconClosed: <img src={IconDown} alt="" width={"15rem"} />,
    iconOpened: <img src={IconUp} alt="" width={"15rem"} />,
    onlyHR: false,
    
    subNav: [
      {
        title: "Recruitment plan",
        path: "/recruitment-plan",
        icon: <img src={RecruitmentPlan} alt="" width={"25rem"} />,    
        onlyHR: false,   
      },
      {
        title: "Plan detail",
        path: "/plan-detail",
        icon: <img src={PlanDetail} alt="" width={"25rem"} />,      
        onlyHR: false, 
      },
      {
        title: "Job request",
        path: "/recruitment-request",
        icon: <img src={RecruitmentRequest} alt="" width={"25rem"} />,    
        onlyHR: true,   
      },
    ],
  },
  {
    title: "Candidates",
    path: "/candidate",
    icon: <img src={Candidates} alt="" width={"30rem"} />,
    iconClosed: <img src={IconDown} alt="" width={"15rem"} />,
    iconOpened: <img src={IconUp} alt="" width={"15rem"} />,   
    onlyHR: true,
  },
  {
    title: "Job apply",
    path: "/job-apply",
    icon: <img src={JobApply} alt="" width={"30rem"} />,   
    onlyHR: true,
  },
  {
    title: "Interview",
    //path: "/interview-schedule",
    icon: <img src={Interview} alt="" width={"30rem"} />,
    iconClosed: <img src={IconDown} alt="" width={"15rem"} />,
    iconOpened: <img src={IconUp} alt="" width={"15rem"} />,
    onlyHR: false,
       
    subNav: [
      {
        title: "Interview schedule",
        path: "/interview-schedule",
        icon: <img src={InterviewSchedule} alt="" width={"25rem"} />,      
        onlyHR: false,
      },
      {
        title: "Interview detail",
        path: "/interview-detail",
        icon: <img src={InterviewDetail} alt="" width={"25rem"} />,    
        onlyHR: false,  
      },
    ],
  },
  {
    title: "Curriculum vitae",
    path: "/curriculum-vitae",
    icon: <img src={CurriculumVitae} alt="" width={"30rem"} />,
    onlyHR: true,
  },
  {
    title: "Statistics",
    path: "/statistics",
    icon: <img src={Statistics} alt="" width={"30rem"} />,   
    onlyHR: true,
  },
  {
    title: "Notification",
    path: "/notification",
    icon: <img src={Notification} alt="" width={"30rem"} />,   
    onlyHR: false,
  },
];
