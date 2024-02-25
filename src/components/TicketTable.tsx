import { Table, Form, Button, InputGroup } from "react-bootstrap";
import { CheckSquareFill, DashSquareFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import {
  markAllToCommit,
  setTaskComment,
  toggleToCommit,
} from "../state/tasks";
import { AllTicketData } from "../model/types";

const getTotalTimeInHours = (data: AllTicketData) => {
  return (
    Object.values(data)
      .map((x) => x.timeS)
      .reduce((acc, cur) => acc + cur, 0) /
    (60 * 60)
  ).toFixed(1);
};

export default function TicketTable() {
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => state.tasks.mappedTasks);

  const openTabs = () => {
    const ticketsToCommit = Object.entries(tasks)
      .filter(([rt, { toCommit }]) => toCommit)
      .map(([rt, { timeS, comment }]) => ({ rt, timeS, comment }));

    ticketsToCommit.forEach(({ rt, timeS, comment }) => {
      const timeMin = (timeS / 60).toFixed();
      const url = `https://rt.cosylab.com/Ticket/Update.html?Action=Respond;id=${rt}&UpdateTimeWorked=${timeMin}&UpdateContent=${comment}`;
      window.open(url, "_blank");
    });
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>RT#</th>
            <th>Name</th>
            <th>Time</th>
            <th>Comment</th>
            <th>
              <a href="#" className="link-dark">
                <CheckSquareFill
                  onClick={() => dispatch(markAllToCommit(true))}
                />
              </a>{" "}
              <a href="#" className="link-dark">
                <DashSquareFill
                  onClick={() => dispatch(markAllToCommit(false))}
                />
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tasks).map(([rt, data], index) => {
            return (
              <tr key={rt}>
                <td>
                  <a
                    href={"https://rt.cosylab.com/Ticket/Display.html?id=" + rt}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {rt}
                  </a>
                </td>
                <td>{data.description}</td>
                <td>{(data.timeS / 60).toFixed()} min</td>
                <td>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      aria-describedby="basic-addon2"
                      value={data.comment}
                      onChange={(e) =>
                        dispatch(
                          setTaskComment({
                            rt: parseInt(rt),
                            comment: e.target.value,
                          })
                        )
                      }
                    />
                    <Button
                      variant="outline-secondary"
                      id="button-addon2"
                      onClick={() => {
                        dispatch(
                          setTaskComment({
                            rt: parseInt(rt),
                            comment: data.description,
                          })
                        );
                      }}
                    >
                      Title
                    </Button>
                  </InputGroup>
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={data.toCommit}
                    onChange={(e) => dispatch(toggleToCommit(parseInt(rt)))}
                  />
                </td>
              </tr>
            );
          })}

          <tr className="total-row">
            <td colSpan={2}>Total</td>
            <td>{getTotalTimeInHours(tasks)} h</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <Button onClick={openTabs}>Enter time</Button>
    </>
  );
}
