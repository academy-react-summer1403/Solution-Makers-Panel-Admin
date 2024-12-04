import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import { getTechnologyUsedInCourses } from "../../services/api/Dashboard";
import ErrorComponent from "../common/ErrorComponent";

const TechsChart = () => {
  const { data, error } = useQuery({
    queryKey: ["technologyUsedInCourses"],
    queryFn: getTechnologyUsedInCourses,
  });

  const donutColors = {
    series1: "#70bfff",
    series2: "#2ce010",
    series3: "#ff9f45",
    series4: "#c363ff",
    series5: "#ff4545",
  };

  // ** Chart Options
  const options = {
    legend: {
      show: true,
      position: "bottom",
    },

    labels: data?.data.map((item) => item.techName).slice(0, 5),

    colors: [
      donutColors.series1,
      donutColors.series2,
      donutColors.series3,
      donutColors.series4,
      donutColors.series5,
    ],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: "2rem",
              fontFamily: "Montserrat",
            },
            value: {
              fontSize: "1rem",
              fontFamily: "Montserrat",
              formatter(val) {
                return `استفاده شده در ${parseInt(val)} دوره`;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: "1.5rem",
                  },
                  value: {
                    fontSize: "1rem",
                  },
                  total: {
                    fontSize: "1.5rem",
                  },
                },
              },
            },
          },
        },
      },
    ],
  };

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="mb-75" tag="h4">
            محبوب ترین تکنولوژی های تدریس شده در دوره های سایت
          </CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        <Chart
          options={options}
          series={data?.data.map((item) => item.countUsed).slice(0, 5) || []}
          type="donut"
          height={350}
        />
      </CardBody>
    </Card>
  );
};

export default TechsChart;
