import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  acceptPayment,
  deletePayment,
  getCoursePaymentById,
} from "../../../services/api/Payment";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Check, Eye, MoreHorizontal, Trash } from "react-feather";
import toast from "react-hot-toast";
import ErrorComponent from "../../common/ErrorComponent";
import { showApplyChangesSwal } from "../../../utility/Utils";

function CoursePayments() {
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const { data, error } = useQuery({
    queryKey: ["coursePayments", courseId],
    queryFn: () => getCoursePaymentById(courseId),
  });

  const { mutateAsync: acceptPaymentMutate } = useMutation({
    mutationFn: acceptPayment,
    onSuccess: (res) => {
      queryClient.invalidateQueries("coursePayments");
      toast.success(res.data.message);
    },
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  const { mutateAsync: deletePaymentMutate } = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => queryClient.invalidateQueries("coursePayments"),
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  console.log(
    data?.data.filter(
      (item) => item.courseId == courseId && item.paymentInvoiceImage
    )
  );

  const columns = [
    {
      name: "نام کاربر",
      selector: (row) => row.studentName,
    },
    {
      name: "گروه دوره",
      center: true,
      selector: (row) => row.groupName,
    },
    {
      name: "تاریخ پرداخت",
      center: true,
      selector: (row) => row.peymentDate.slice(0, 10),
    },
    {
      name: "وضعیت پرداخت",
      center: true,
      cell: (row) => {
        if (row.accept) {
          return (
            <span
              className="rounded-1"
              style={{
                padding: 4,
                backgroundColor: "#cafade",
                color: "#28c76f",
              }}
            >
              تایید شده
            </span>
          );
        } else {
          return (
            <span
              className="rounded-1"
              style={{
                padding: 4,
                backgroundColor: "#ffdbdb",
                color: "#ff0000",
              }}
            >
              تایید نشده
            </span>
          );
        }
      },
    },
    {
      name: "عملیات",
      center: true,
      cell: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreHorizontal size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu className="mb-4" container="body">
              <DropdownItem
                tag="a"
                target="_blank"
                href={row.paymentInvoiceImage}
                className="w-100"
              >
                <Eye size={14} className="me-50" />
                <span className="align-middle">مشاهده فیش</span>
              </DropdownItem>
              {!row.accept && (
                <DropdownItem
                  tag="span"
                  className="w-100"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("PaymentId", row.id);
                    showApplyChangesSwal(() => acceptPaymentMutate(formData));
                  }}
                >
                  <Check size={14} className="me-50" />
                  <span className="align-middle">تایید پرداخت</span>
                </DropdownItem>
              )}
              {!row.accept && (
                <DropdownItem
                  tag="span"
                  className="w-100"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("PaymentId", row.id);
                    showApplyChangesSwal(() => deletePaymentMutate(formData));
                  }}
                >
                  <Trash size={14} className="me-50" />
                  <span className="align-middle">حذف پرداخت</span>
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <Card className="overflow-hidden">
      <div className="react-dataTable">
        <DataTable
          noHeader
          sortServer
          responsive
          data={data?.data.filter(
            (item) => item.courseId == courseId && item.paymentInvoiceImage
          )}
          columns={columns}
          className="react-dataTable"
        />
      </div>
    </Card>
  );
}

export default CoursePayments;
