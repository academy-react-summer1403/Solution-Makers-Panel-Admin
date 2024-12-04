import { Award, BookOpen, Check, User } from "react-feather";
import Avatar from "@components/avatar";
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import { useQuery } from "@tanstack/react-query";
import { getDashboardReport } from "../../services/api/Dashboard";
import UsersChart from "./UsersChart";
import { useContext } from "react";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import CoursesChart from "./CoursesChart";
import TechsChart from "./TechsChart";
import ErrorComponent from "../common/ErrorComponent";

function Dashboard() {
  const { colors } = useContext(ThemeColors);

  const { data: dashboardReport, error } = useQuery({
    queryKey: ["dashboardReport"],
    queryFn: getDashboardReport,
  });

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div id="dashboard-analytics">
      <Row className="match-height align-items-center">
        <Col lg="6" sm="12">
          <Card className="card-congratulations">
            <CardBody className="text-center">
              <Avatar
                icon={<Award size={28} />}
                className="shadow"
                color="primary"
                size="xl"
              />
              <div className="text-center">
                <h2 className="mb-1 text-white">
                  تبریک مبلغ تمامی دوره های پرداختی هگزا اسکواد{" "}
                  {dashboardReport?.data.allPaymentCost} تومان است
                </h2>
                {/* <CardTitle className="m-auto w-75"></CardTitle> */}
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6">
          <Row>
            <Col lg="6" sm="6">
              <StatsHorizontal
                color="primary"
                statTitle="تعداد کل کاربرها"
                icon={<User size={20} />}
                renderStats={
                  <h3 className="fw-bolder mb-75">
                    {dashboardReport?.data.allUser || (
                      <Spinner color="primary" />
                    )}
                  </h3>
                }
              />
            </Col>
            <Col lg="6" sm="6">
              <StatsHorizontal
                color="success"
                statTitle="تعداد کاربران فعال"
                icon={<User size={20} />}
                renderStats={
                  <h3 className="fw-bolder mb-75">
                    {Math.round(
                      (dashboardReport?.data.allUser *
                        dashboardReport?.data.activeUserPercent) /
                        100
                    ) || <Spinner color="primary" />}
                  </h3>
                }
              />
            </Col>
            <Col lg="6" sm="6">
              <StatsHorizontal
                color="primary"
                statTitle="تعداد کل رزروها"
                icon={<BookOpen size={20} />}
                renderStats={
                  <h3 className="fw-bolder mb-75">
                    {dashboardReport?.data.allReserve || (
                      <Spinner color="primary" />
                    )}
                  </h3>
                }
              />
            </Col>
            <Col lg="6" sm="6">
              <StatsHorizontal
                color="success"
                statTitle="تعداد رزروهای تایید شده"
                icon={<Check size={20} />}
                renderStats={
                  <h3 className="fw-bolder mb-75">
                    {dashboardReport?.data.allReserveAccept || (
                      <Spinner color="primary" />
                    )}
                  </h3>
                }
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col lg="6" xs="12">
          <UsersChart
            primary={colors.primary.main}
            danger={colors.danger.main}
          />
        </Col>
        <Col lg="6" xs="12">
          <CoursesChart
            primary={colors.primary.main}
            danger={colors.danger.main}
          />
        </Col>
        <Col lg="6" xs="12">
          <TechsChart />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
