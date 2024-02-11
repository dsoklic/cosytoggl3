import { DateRange, DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";
import { AppDispatch, RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDateRange } from "../state/tasks";

const nowDate = new Date();

export default function DatePicker() {
  const dispatch = useDispatch<AppDispatch>();

  const range = useSelector(
    (state: RootState): DateRange => ({
        from: state.tasks.selectedDateRange.from !== undefined ? new Date(state.tasks.selectedDateRange.from) : undefined,
        to: state.tasks.selectedDateRange.to !== undefined ? new Date(state.tasks.selectedDateRange.to) : undefined
    }),
    (a, b) =>
      a.from?.toISOString() === b.from?.toISOString() &&
      a.to?.toISOString() === b.to?.toISOString()
  );

  return (
    <DayPicker
      id="test"
      mode="range"
      defaultMonth={nowDate}
      selected={range}
      weekStartsOn={1}
      onSelect={(e) =>
        dispatch(
          setSelectedDateRange({
            from: e?.from?.toISOString(),
            to: e?.to?.toISOString(),
          })
        )
      }
    />
  );
}
