import { toast } from "react-toastify";
import CustomToast from "../components/CustomToast";
import notification from "../audio/notification.mp3";
import addedNotification from "../audio/added.mp3";

const notificationSound = new Audio(notification);
const addedNotificationSound = new Audio(addedNotification);

export const toastWithSound = (msg, type = "default") => {
  const playSound = (audio) => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  if (type === "success" || type === "default") {
    playSound(notificationSound);

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
    playSound(addedNotificationSound);

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
