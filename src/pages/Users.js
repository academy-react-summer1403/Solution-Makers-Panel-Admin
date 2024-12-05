import { Col, Row } from "reactstrap";
import UsersListTable from "../components/users/list/Table";
import UsersListTopCards from "../components/users/list/UsersListTopCards";
import "@styles/react/apps/app-users.scss";

function UsersList() {
  return (
    <div className="app-user-list">
      <Row>
        <UsersListTopCards />
      </Row>
      <Row>
        <Col>
          <UsersListTable RowsOfPage={10} needAddNewUser={true} />
        </Col>
      </Row>
    </div>
  );
}

export default UsersList;
