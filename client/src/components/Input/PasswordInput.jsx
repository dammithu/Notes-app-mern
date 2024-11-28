import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Import the correct icons

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="relative mb-3">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="input-box w-full text-sm py-3 pr-10 rounded outline-none"
      />
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={toggleShowPassword}
      >
        {isShowPassword ? (
          <FaRegEyeSlash size={22} className="text-slate-400" />
        ) : (
          <FaRegEye size={22} className="text-primary" />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
