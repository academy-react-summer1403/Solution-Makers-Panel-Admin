import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Info, MessageSquare, Edit2 } from "react-feather";
import ArticleDescribe from "./Describe";
import ArticleComments from "./ArticleComments";
import EditArticle from "./EditArticle";

const ArticleDetailsTabs = ({ active, toggleTab }) => {
  return (
    <>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
            <Info className="font-medium-3 me-50" />
            <span className="fw-bold">توضیحات اصلی</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
            <MessageSquare className="font-medium-3 me-50" />
            <span className="fw-bold">کامنت ها</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
            <Edit2 className="font-medium-3 me-50" />
            <span className="fw-bold">ویرایش</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <ArticleDescribe />
        </TabPane>
        <TabPane tabId="2">
          <ArticleComments />
        </TabPane>
        <TabPane tabId="3">
          <EditArticle />
        </TabPane>
      </TabContent>
    </>
  );
};
export default ArticleDetailsTabs;
