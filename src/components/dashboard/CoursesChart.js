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

const CoursesChart = (props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardReport"],
    queryFn: getDashboardReport,
  });

  const acceptOptions = {
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
    labels: ["درصد رزروهای تایید شده"],
  };

  const notAcceptOptions = {
    ...acceptOptions,
    labels: ["درصد رزروهای تایید نشده"],
  };

  const acceptSeries = [
    Math.round(Number(data?.data.reserveAcceptPercent)) || "...",
  ];

  const notAcceptSeries = [
    Math.round(Number(data?.data.reserveNotAcceptPercent)) || "...",
  ];

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle tag="h4">اطلاعات دوره ها</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm="6" className="d-flex justify-content-center">
            <Chart
              options={acceptOptions}
              series={acceptSeries}
              type="radialBar"
              height={270}
              id="support-tracker-card"
            />
          </Col>
          <Col sm="6" className="d-flex justify-content-center">
            <Chart
              options={notAcceptOptions}
              series={notAcceptSeries}
              type="radialBar"
              height={270}
              id="support-tracker-card"
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-1">
          <div className="text-center">
            <CardText className="mb-50">تعداد کل رزروها</CardText>
            <span className="font-large-1 fw-bold">
              {data?.data.allReserve || "..."}
            </span>
          </div>
          <div className="text-center">
            <CardText className="mb-50">تعداد رزروهای تایید شده</CardText>
            <span className="font-large-1 fw-bold">
              {data?.data.allReserveAccept || "..."}
            </span>
          </div>
          <div className="text-center">
            <CardText className="mb-50">تعداد رزروهای تایید نشده</CardText>
            <span className="font-large-1 fw-bold">
              {data?.data.allReserveNotAccept || "..."}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default CoursesChart;
