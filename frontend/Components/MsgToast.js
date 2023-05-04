import React from "react";
import { Alert, UncontrolledAlert } from "reactstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MsgToast = (props) => {
  return (
    <React.Fragment>
      {toast.success(`${props.msg}`, {
        position: "top-right",
        className: "bg-success text-white",
        hideProgressBar: true,
        progress: undefined,
        autoClose: 3000,
        toastId: "",
        theme: "light",
      })}
      <ToastContainer autoClose={false} limit={3000} />
    </React.Fragment>
  );
};

export default MsgToast;
