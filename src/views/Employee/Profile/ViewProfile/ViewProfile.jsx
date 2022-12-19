import React, { useState} from "react";
import "./ViewProfile.scss";

import EditInformation from "../EditInformation/EditInformation";
import PersonalInformation from "../PersonalInformation/PersonalInformation";
import 'react-toastify/dist/ReactToastify.css';

const ViewProfile = () => {

  const [isEditProfile, setIsEditProfile] = useState(false)
  
  return (
    <React.Fragment>
      <div className="viewProfile-container">
        <div className="bg-white h-12 font-bold text-2xl mb-3 rounded-md pt-2 px-4">Hồ sơ của tôi</div>
        <div className="profile-container">
          <div className="text-2xl font-semibold pt-4">
           
            {isEditProfile ? <i className="fa-solid fa-xmark edit-icon hover:cursor-pointer" title="Cancel" onClick={() => setIsEditProfile(false)}></i> : <i className="fa-regular fa-pen-to-square edit-icon hover:cursor-pointer" title="Edit your profile" onClick={() => setIsEditProfile(true)}></i>}
           
            <div className="ml-3 text-center">Thông tin cá nhân </div>
          </div>
          {isEditProfile ? <><EditInformation /></> : <PersonalInformation />}
        </div>
      </div>

    </React.Fragment>
  );
};

export default ViewProfile;
