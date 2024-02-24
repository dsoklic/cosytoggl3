import { Placeholder, Table } from "react-bootstrap";

function TablePlaceholder() {
    return <Table striped bordered hover>
    <thead>
        <Placeholder as="tr" animation="glow">
            <th><Placeholder xs={6} /></th>
            <th><Placeholder xs={8} /></th>
            <th><Placeholder xs={8} /></th>
            <th><Placeholder xs={10} /></th>
        </Placeholder>
    </thead>
    <tbody>
        <Placeholder as="tr" animation="glow">
            <td><Placeholder xs={3} /></td>
            <td><Placeholder xs={7} /></td>
            <td><Placeholder xs={7} /></td>
            <td><Placeholder xs={7} /></td>
        </Placeholder>
        <Placeholder as="tr" animation="glow">
            <td><Placeholder xs={3} /></td>
            <td><Placeholder xs={6} /></td>
            <td><Placeholder xs={7} /></td>
            <td><Placeholder xs={5} /></td>
        </Placeholder>
        <Placeholder as="tr" animation="glow">
            <td><Placeholder xs={7} /></td>
            <td><Placeholder xs={7} /></td>
            <td><Placeholder xs={7} /></td>
            <td><Placeholder xs={7} /></td>
        </Placeholder>
    </tbody>
    </Table>
}

export default TablePlaceholder;