import { toast } from "react-toastify";

const autoCloseTime = 3000;
const position = "top-right";

export function showErrorNotify(message: string) {
  toast.error(message, {
    position: position,
    autoClose: autoCloseTime,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

export function showSuccessNotify(message: string) {
  toast.success(message, {
    position: position,
    autoClose: autoCloseTime,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};