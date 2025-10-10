import React from "react";

// DP Component
const DP = ({ className = "", children }) => {

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Display Picture */}
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
        {children?.avatar ? (
          <img
            src={children.avatar}
            alt={children.fullname || "User"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-gray-500 font-bold">
            {children?.name ? children.name[0].toUpperCase() : "U"}
          </span>
        )}
      </div>

      {/* User Info */}
      {/* <div className="flex flex-col">
        {children?.fullname && (
          <span className="font-medium text-white">{children.fullname}</span>
        )}
      </div> */}
    </div>
  );
};

export default DP;
