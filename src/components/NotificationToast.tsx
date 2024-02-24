import { Toast, ToastContainer } from "react-bootstrap";
import { AppDispatch, RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../state/tasks";

function NotificationToast() {
  const dispatch = useDispatch<AppDispatch>();

  const shown = useSelector((state: RootState) => state.tasks.notificationShown);
  const title = useSelector((state: RootState) => state.tasks.notificationTitle);
  const message = useSelector(
    (state: RootState) => state.tasks.notificationMessage
  );

  return (
    <ToastContainer className="p-3" position="top-end" style={{ zIndex: 1 }}>
      <Toast show={shown} onClose={() => dispatch(hideNotification())} autohide>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default NotificationToast;
