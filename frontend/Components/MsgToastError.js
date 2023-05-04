import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MsgToastError = (props) => {
  return (
    <React.Fragment>
      {toast.error(`${props.msg}`, {
        position: "top-right",
        className: "bg-success text-white",
        hideProgressBar: true,
        progress: undefined,
        autoClose: 2000,
        toastId: "",
        theme: "light",
      })}
      <ToastContainer autoClose={true} limit={2000} />
    </React.Fragment>
  );
};

export default MsgToastError;
