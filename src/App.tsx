import { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, setSpreadModalShown, setThisMonth, setThisWeek, setTokenModalShown } from "./state/tasks";
import { AppDispatch, RootState } from "./state/store";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import DatePicker from "./components/DatePicker";
import TicketTable from "./components/TicketTable";
import FixMappingsTable from "./components/FixMappingsTable";
import TogglTokenModal from "./components/TogglTokenModal";
import SpreadModal from "./components/SpreadModal";
import NotificationToast from "./components/NotificationToast";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const selectedTime = useSelector((state: RootState) => state.tasks.selectedDateRange);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch, selectedTime])

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      dispatch(setTokenModalShown(true));
    }
  }, [dispatch])

  return (
    <div className="App">
      <NotificationToast />
      <TogglTokenModal />
      <SpreadModal />
      <div className="sidebar">
        <h1 className="title">Cosytoggl 3</h1>

        <div className="text-center">
          <Button className="m-1" onClick={() => dispatch(setThisWeek())}>This week</Button>
          <Button className="m-1" onClick={() => dispatch(setThisMonth())}>This month</Button>
        </div>

        <DatePicker />
      </div>

      <div className="main-content">
        <Button onClick={() => dispatch(getTasks())}>Refresh</Button>
        <Button className="m-1" onClick={() => dispatch(setSpreadModalShown(true))}>Spread task</Button>
        <h2>Unmapped tasks</h2>
        <FixMappingsTable />
        <br />
        <h2>Task list</h2>
        <TicketTable />
      </div>
    </div>
  );
}

export default App;
