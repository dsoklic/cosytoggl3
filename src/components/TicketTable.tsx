import { Table, Form, Button } from "react-bootstrap";
import { CheckSquareFill, DashSquareFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import {
  AllTicketData,
  markAllToCommit,
  setTaskComment,
  toggleToCommit,
} from "../state/tasks";

export default function TicketTable() {
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => state.tasks.mappedTasks);

  const getTotalTimeInHours = (data: AllTicketData) => {
    return (
      Object.values(data)
        .map((x) => x.timeS)
        .reduce((acc, cur) => acc + cur, 0) /
      (60 * 60)
    ).toFixed(1);
  };

  const openTabs = () => {
    const ticketsToCommit = Object.entries(tasks)
      .filter(([rt, { toCommit }]) => toCommit)
      .map(([rt, { timeS, comment }]) => ({ rt, timeS, comment }));

    ticketsToCommit.forEach(({ rt, timeS, comment}) => {
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
                  >
                    {rt}
                  </a>
                </td>
                <td>{data.description}</td>
                <td>{(data.timeS / 60).toFixed()} min</td>
                <td>
                  <Form.Control
                    type="text"
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
