import { toast } from "react-toastify";
import CustomToast from "../components/CustomToast";

const notification = new Audio("src/audio/notification.mp3");
const addedNotification = new Audio("src/audio/added.mp3");

export const toastWithSound = (msg, type = "default") => {
  const playSound = (audio) => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  if (type === "success" || type === "default") {
    playSound(notification);

    toast(<CustomToast msg={msg} type={type} />, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
      draggable: true,
      pauseOnHover: true,
      className: "!bg-transparent !p-0",
    });

    return;
  }

  if (type === "info") {
    playSound(addedNotification);

    toast(<CustomToast msg={msg} type="info" />, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
      draggable: true,
      className: "!bg-transparent !p-0",
    });

    return;
  }

  toast[type](msg);
};
