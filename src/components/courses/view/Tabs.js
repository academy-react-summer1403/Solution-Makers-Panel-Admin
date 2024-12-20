import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import {
  Info,
  Users,
  Grid,
  MessageSquare,
  Edit2,
  CreditCard,
} from "react-feather";
import OtherInfos from "./OtherInfos";
import EditCourse from "./EditCourse";
import CourseGroups from "./CourseGroups";
import CourseComments from "./CourseComments";
import CourseReserve from "./CourseReserve";
import CourseUsers from "./CourseUsers";
import CoursePayments from "./CoursePayments";

const CourseDetailsTabs = ({ active, toggleTab }) => {
  return (
    <>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
            <Info className="font-medium-3 me-50" />
            <span className="fw-bold">سایر اطلاعات</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
            <Users className="font-medium-3 me-50" />
            <span className="fw-bold">رزرو کنندگان</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
            <Users className="font-medium-3 me-50" />
            <span className="fw-bold">اعضا دوره</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
            <Grid className="font-medium-3 me-50" />
            <span className="fw-bold">گروه ها</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
            <MessageSquare className="font-medium-3 me-50" />
            <span className="fw-bold">کامنت ها</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "6"} onClick={() => toggleTab("6")}>
            <Edit2 className="font-medium-3 me-50" />
            <span className="fw-bold">ویرایش</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "7"} onClick={() => toggleTab("7")}>
            <CreditCard className="font-medium-3 me-50" />
            <span className="fw-bold">پرداخت ها</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <OtherInfos />
        </TabPane>
        <TabPane tabId="2">
          <CourseReserve toggleTab={toggleTab} />
        </TabPane>
        <TabPane tabId="3">
          <CourseUsers />
        </TabPane>
        <TabPane tabId="4">
          <CourseGroups />
        </TabPane>
        <TabPane tabId="5">
          <CourseComments />
        </TabPane>
        <TabPane tabId="6">
          <EditCourse />
        </TabPane>
        <TabPane tabId="7">
          <CoursePayments />
        </TabPane>
      </TabContent>
    </>
  );
};
export default CourseDetailsTabs;
