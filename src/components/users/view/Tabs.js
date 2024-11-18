import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { BookOpen, Book, MessageSquare, Info, Link } from "react-feather";
import UserCourses from "./UserCourses";
import UserReserveCourses from "./UserReserveCourses";
import UserComments from "./UserComments";
import UserOtherInfos from "./OtherInfos";
import UserConnections from "./UserConnections";

function UserDetailsTabs({ active, toggleTab }) {
  return (
    <>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
            <BookOpen className="font-medium-3 me-50" />
            <span className="fw-bold">دوره ها</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
            <Book className="font-medium-3 me-50" />
            <span className="fw-bold">دوره های رزرو</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
            <MessageSquare className="font-medium-3 me-50" />
            <span className="fw-bold">کامنت ها</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
            <Info className="font-medium-3 me-50" />
            <span className="fw-bold">سایر اطلاعات کاربر</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
            <Link className="font-medium-3 me-50" />
            <span className="fw-bold">ارتباط با کاربر</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <UserCourses />
        </TabPane>
        <TabPane tabId="2">
          <UserReserveCourses />
        </TabPane>
        <TabPane tabId="3">
          <UserComments />
        </TabPane>
        <TabPane tabId="4">
          <UserOtherInfos />
        </TabPane>
        <TabPane tabId="5">
          <UserConnections />
        </TabPane>
      </TabContent>
    </>
  );
}

export default UserDetailsTabs;
