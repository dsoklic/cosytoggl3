import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { spreadTasksOverTickets } from "../state/tasks";
import { Form, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { SpreadDesiredAmount } from "../model/types";

function SpreadModal() {
  const dispatch = useDispatch<AppDispatch>();
  const show = useSelector((state: RootState) => state.tasks.spreadModalShown);
  const mappedTasks = useSelector(
    (state: RootState) => state.tasks.mappedTasks
  );
  const unmappedTasks = useSelector(
    (state: RootState) => state.tasks.unmappedTasks
  );

  const [selectedTask, setSelectedTask] = useState("0");

  const getInitialTimeAmounts = (): SpreadDesiredAmount[] =>
    Object.entries(mappedTasks).map(([k, v]) => ({
      rt: k,
      amountMin: 0,
      amountPercentage: 0,
    }));

  const [timeAmounts, setTimeAmounts] = useState(getInitialTimeAmounts());

  useEffect(() => {
    setTimeAmounts(getInitialTimeAmounts());
  }, [mappedTasks]);

  const setPercentage = (rt: string, amount: string | undefined) => {
    const numberVal = parseInt(amount || "0") / 100;

    const total = unmappedTasks[selectedTask ?? ""].totalTimeS;
    const newValMin = (total * numberVal) / 60;

    setTimeAmounts((amounts) =>
      amounts.map((x) => ({
        ...x,
        amountPercentage:
          x.rt === rt ? parseInt(amount || "0") : x.amountPercentage,
        amountMin: x.rt === rt ? newValMin : x.amountMin,
      }))
    );
  };

  const setMinutes = (rt: string, amount: string | undefined) => {
    const numberVal = parseInt(amount || "0");

    const total = unmappedTasks[selectedTask ?? ""].totalTimeS / 60;
    const newValPercentage = (numberVal / total) * 100;

    setTimeAmounts((amounts) =>
      amounts.map((x) => ({
        ...x,
        amountPercentage: x.rt === rt ? newValPercentage : x.amountPercentage,
        amountMin: x.rt === rt ? numberVal : x.amountMin,
      }))
    );
  };

  const onSave = () => {
    const desiredAmounts = timeAmounts
      .filter((x) => x.amountMin > 0);
    const taskToOverwrite = unmappedTasks[selectedTask ?? ""];

    console.log('desiredAmounts', desiredAmounts);
    console.log('taskToOverwrite', taskToOverwrite)
    
    dispatch(spreadTasksOverTickets(desiredAmounts));
    // dispatch(getTasks());
    // dispatch(setSpreadModalShown(false));
  };

  return (
    <Modal show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Spread task over tickets</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Ticket</Form.Label>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => setSelectedTask(e.target.value)}
            value={selectedTask}
          >
            <option value={0}>Select a task</option>

            {Object.entries(unmappedTasks).map(([id, { desc }]) => (
              <option value={id} key={id}>
                {desc}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Spread{" "}
            {(unmappedTasks[selectedTask ?? ""]?.totalTimeS / 60).toFixed()} min
            over:
          </Form.Label>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>RT#</th>
                <th>Ticket name</th>
                <th>Amount %</th>
                <th>Amount min</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mappedTasks).map(([rt, data]) => (
                <tr key={rt}>
                  <td>{rt}</td>
                  <td>{data.description}</td>
                  <td>
                    <Form.Control
                      type="test"
                      value={
                        timeAmounts
                          .find((x) => x.rt === rt)
                          ?.amountPercentage.toFixed() ?? 0
                      }
                      onChange={(e) => setPercentage(rt, e.target.value)}
                      id={`inputPercent-${rt}`}
                      disabled={selectedTask === "0"}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="test"
                      value={
                        timeAmounts
                          .find((x) => x.rt === rt)
                          ?.amountMin.toFixed() ?? 0
                      }
                      onChange={(e) => setMinutes(rt, e.target.value)}
                      id={`inputMin-${rt}`}
                      disabled={selectedTask === "0"}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3}>Total</td>
                <td>
                  {timeAmounts
                    .map((x) => x.amountMin)
                    .reduce((prev, cur) => prev + cur, 0)
                    .toFixed()}
                </td>
              </tr>
            </tbody>
          </Table>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SpreadModal;
