import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
      {/* Profile Icon with Gradient and Animation */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 animate-pulse">
        {getInitials(userInfo?.fullName)}
      </div>

      {/* User Information */}
      <div className="text-white">
        <p className="text-sm font-semibold tracking-wide">{userInfo?.fullName}</p>
        <button
          className="text-sm text-blue-200 underline hover:text-blue-100 transition-colors duration-200 hover:scale-105"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
