import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getNewsWithCategoryId } from "../../services/api/Articles";
import { Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import DataTable from "react-data-table-component";
import Avatar from "@components/avatar";
import ErrorComponent from "../common/ErrorComponent";

function NewsWithCategoryModal({
  categoryId,
  newsWithCategoryModal,
  setNewsWithCategoryModal,
}) {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["newsWithCategory"],
    queryFn: () => getNewsWithCategoryId(categoryId),
    enabled: false,
  });

  useEffect(() => {
    if (categoryId) {
      refetch();
    }
  }, [categoryId]);

  const columns = [
    {
      name: "تصویر",
      center: true,
      cell: (row) => {
        if (row.currentImageAddressTumb) {
          return (
            <Avatar
              className="me-1"
              img={row.currentImageAddressTumb}
              width="32"
              height="32"
              onClick={() => navigate(`/articles/view/${row.id}`)}
            />
          );
        } else {
          return (
            <Avatar
              initials
              className="me-1"
              img="/src/assets/images/notFound/1047293-صفحه-یافت-نشد-خطای-404.jpg"
              onClick={() => navigate(`/articles/view/${row.id}`)}
            />
          );
        }
      },
    },
    {
      name: "نویسنده",
      center: true,
      selector: (row) => row.addUserFullName,
    },
    {
      name: "عنوان",
      center: true,
      selector: (row) => row.title,
    },
    {
      name: "تعداد بازدید",
      center: true,
      selector: (row) => row.currentView,
    },
    {
      name: "وضعیت",
      center: true,
      cell: (row) => {
        if (row.isActive) {
          return (
            <span
              style={{
                padding: 4,
                backgroundColor: "#cafade",
                color: "#28c76f",
                cursor: "pointer",
              }}
              className="rounded-1"
            >
              فعال
            </span>
          );
        } else {
          return (
            <span
              style={{
                padding: 4,
                backgroundColor: "#ffdbdb",
                color: "#ff0000",
                cursor: "pointer",
              }}
              className="rounded-1"
            >
              غیر فعال
            </span>
          );
        }
      },
    },
  ];

  return (
    <Modal
      isOpen={newsWithCategoryModal}
      toggle={() => setNewsWithCategoryModal(!newsWithCategoryModal)}
      className="modal-dialog-centered modal-lg"
    >
      <ModalHeader
        toggle={() => setNewsWithCategoryModal(!newsWithCategoryModal)}
      >
        مقاله های این دسته بندی
      </ModalHeader>
      <ModalBody>
        <div className="react-dataTable user-view-account-projects">
          {isLoading ? (
            <Spinner color="primary" />
          ) : (
            <>
              {error ? (
                <ErrorComponent />
              ) : (
                <DataTable
                  noHeader
                  responsive
                  columns={columns}
                  data={data?.data}
                  className="react-dataTable"
                />
              )}
            </>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}

export default NewsWithCategoryModal;
