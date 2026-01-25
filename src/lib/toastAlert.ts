import toast from "react-hot-toast";
import { Messages } from "./config";

export const toastErrorHandling = (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  toast.error(message);
};

export const toastTopSuccessAlert = (msg: string, time: number = 2000) => {
  toast.success(msg, {
    duration: time,
    style: { fontSize: "18px", padding: "16px,24px" },
  });
};

export const toastTopSmallSuccessAlert = (msg: string, time: number = 2000) => {
  toast.success(msg, {
    duration: time,
    style: { fontSize: "18px", padding: "16px,24px" },
  });
};

export const toastFailureProvider = (msg: string, forward_url: string = "") => {
  toast.error(msg, { duration: 3000 });

  if (forward_url !== "") {
    setTimeout(() => {
      window.location.replace(forward_url);
    }, 2000);
  }
};
