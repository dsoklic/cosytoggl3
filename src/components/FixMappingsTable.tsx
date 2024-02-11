import { useState } from 'react';
import { Table, InputGroup, FormControl, Button } from 'react-bootstrap'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { UpdateTaskData, changeUnmappedTaskDescription, updateTasks } from '../state/tasks';
import capitalizeTitle from 'capitalize-title';

export default function FixMappingsTable() {
  const dispatch = useDispatch<AppDispatch>();

  const fixCapitalization = (id: string, desc: string) => {
    const newDesc = capitalizeTitle(desc);

    dispatch(changeUnmappedTaskDescription({id, new: newDesc}));
  }

  const fixMappings = () => {
    const data: UpdateTaskData[] = Object.values(unmappedTasks).map(([id, {ids, totalTimeS, desc, workspace}]) => ({
        ids,
        totalTimeS,
        desc,
        workspace,
        newRt: newMappingData[id]?.trim(),
    })).filter((x) => x.newRt);

    console.log(data);

    dispatch(updateTasks(data));
  };

  const unmappedTasks = useSelector((state: RootState) => Object.entries(state.tasks.unmappedTasks).sort(), shallowEqual);
  const [ newMappingData, setNewMappingData ] = useState<{[desc: string]: string}>({})

  return (
    <>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Count</th>
          <th>RT#</th>
          <th>Name</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
          {unmappedTasks.map((task, i) => {
            const [id, { ids, totalTimeS, desc }] = task;

            return <tr key={i}>
                    <td>{ids.length}</td>
                    <td>
                      <InputGroup className="mb-3">
                        <FormControl
                          value={newMappingData[id] ?? ''}
                          onChange={(e) => {
                            const copy = {...newMappingData};
                            copy[id] = e.target.value;
                            setNewMappingData(copy);
                          }}
                        />
                      </InputGroup>
                    </td>
                    <td>
                      <InputGroup className="mb-3">
                        <FormControl
                          type="text"
                          value={desc}
                          onChange={(e) => dispatch(changeUnmappedTaskDescription({ id, new: e.target.value }))} />
                         <Button variant="outline-secondary" id="button-addon2" onClick={() => fixCapitalization(id, desc)}>
                           Aa
                         </Button>
                      </InputGroup>
                    </td>
                    <td>{Math.round(totalTimeS/60)} min</td>
                  </tr>
          })}
        
      </tbody>
    </Table>
    <Button onClick={fixMappings}>Fix mappings</Button>
    </>
  )
}
