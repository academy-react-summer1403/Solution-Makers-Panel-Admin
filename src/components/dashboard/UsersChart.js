import Chart from "react-apexcharts";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
} from "reactstrap";
import { useQuery } from "@tanstack/react-query";
import { getDashboardReport } from "../../services/api/Dashboard";

const UsersChart = (props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardReport"],
    queryFn: getDashboardReport,
  });

  const activeUsersOptions = {
    plotOptions: {
      radialBar: {
        size: 150,
        offsetY: 20,
        startAngle: -150,
        endAngle: 150,
        hollow: {
          size: "65%",
        },
        track: {
          background: "#fff",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            offsetY: -5,
            fontFamily: "Montserrat",
            fontSize: "1rem",
          },
          value: {
            offsetY: 15,
            fontFamily: "Montserrat",
            fontSize: "1.714rem",
          },
        },
      },
    },
    colors: [props.danger],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [props.primary],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      dashArray: 8,
    },
    labels: ["درصد کاربران فعال"],
  };

  const deactiveUsersOptions = {
    ...activeUsersOptions,
    labels: ["درصد کاربران غیر فعال"],
  };

  const activeUsersSeries = [
    Math.round(Number(data?.data.activeUserPercent)) || "...",
  ];
  const deactiveUsersSeries = [
    Math.round(Number(data?.data.interActiveUserPercent)) || "...",
  ];

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle tag="h4">اطلاعات کاربران</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm="6" className="d-flex justify-content-center">
            <Chart
              options={activeUsersOptions}
              series={activeUsersSeries}
              type="radialBar"
              height={270}
              id="support-tracker-card"
            />
          </Col>
          <Col sm="6" className="d-flex justify-content-center">
            <Chart
              options={deactiveUsersOptions}
              series={deactiveUsersSeries}
              type="radialBar"
              height={270}
              id="support-tracker-card"
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-1">
          <div className="text-center">
            <CardText className="mb-50">کاربران فعال</CardText>
            <span className="font-large-1 fw-bold">
              {Math.round(
                (data?.data.allUser * data?.data.activeUserPercent) / 100
              ) || "..."}
            </span>
          </div>
          <div className="text-center">
            <CardText className="mb-50">کاربران با پروفایل تکمیل نشده</CardText>
            <span className="font-large-1 fw-bold">
              {data?.data.inCompeletUserCount || "..."}
            </span>
          </div>
          <div className="text-center">
            <CardText className="mb-50">کاربران غیر فعال</CardText>
            <span className="font-large-1 fw-bold">
              {data?.data.deactiveUsers}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default UsersChart;
