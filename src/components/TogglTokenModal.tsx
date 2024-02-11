import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { getTasks, setTokenModalShown } from "../state/tasks";
import { Form } from "react-bootstrap";
import { useState } from "react";

function TogglTokenModal() {
  const dispatch = useDispatch<AppDispatch>();
  const show = useSelector((state: RootState) => state.tasks.tokenModalShown);
  const [token, setToken] = useState('');

  const onSave = () => {
    localStorage.setItem("token", token);

    dispatch(getTasks());
    dispatch(setTokenModalShown(false));
  };

  return (
    <Modal show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Set Toggl token</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Please set the Toggl access token</Form.Label>
          <Form.Control type="password" placeholder="Enter token" value={token} onChange={(e) => setToken(e.target.value)} />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={onSave}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TogglTokenModal;
