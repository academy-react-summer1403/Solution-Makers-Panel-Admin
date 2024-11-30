import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import Avatar from "@components/avatar";
import {
  activeOrDeactiveNews,
  getAdminNewsList,
} from "../../../services/api/Articles";
import { Check, FileText, MoreHorizontal, X } from "react-feather";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ArticlesListCustomHeader from "./CustomHeader";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import toast from "react-hot-toast";
import { showApplyChangesSwal } from "../../../utility/Utils";

function ArticlesListTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState({
    value: true,
    label: "وضعیت مقاله",
    number: 0,
  });

  const [sortingCol, setSortingCol] = useState({
    value: "",
    label: "مرتب سازی",
    number: 0,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: () =>
      getAdminNewsList(
        currentPage,
        sortingCol.value,
        searchTerm,
        currentStatus.value
      ),
  });

  const { mutateAsync: activeOrDeactiveNewsMutate } = useMutation({
    mutationFn: activeOrDeactiveNews,
    onSuccess: () => {
      queryClient.invalidateQueries("articles");
      toast.success("تغییرات اعمال شد");
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  useEffect(() => {
    refetch();
  }, [currentPage, currentStatus, sortingCol]);

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
            />
          );
        } else {
          return (
            <Avatar
              initials
              className="me-1"
              img="/src/assets/images/notFound/1047293-صفحه-یافت-نشد-خطای-404.jpg"
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
      name: "دسته بندی",
      center: true,
      selector: (row) => row.newsCatregoryName,
    },
    {
      name: "تعداد بازدید",
      center: true,
      selector: (row) => row.currentView,
    },
    {
      name: "تاریخ ثبت",
      center: true,
      selector: (row) => row.insertDate.slice(0, 10),
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
    {
      name: "عملیات",
      center: true,
      cell: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreHorizontal size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem
                tag={Link}
                to={`/articles/view/${row.id}`}
                className="w-100"
              >
                <FileText size={14} className="me-50" />
                <span className="align-middle">جزئیات</span>
              </DropdownItem>
              {row.isActive ? (
                <DropdownItem
                  className="w-100"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("Id", row.id);
                    formData.append("Active", false);
                    showApplyChangesSwal(() =>
                      activeOrDeactiveNewsMutate(formData)
                    );
                  }}
                >
                  <X size={14} className="me-50" />
                  <span className="align-middle">غیرفعال کردن</span>
                </DropdownItem>
              ) : (
                <DropdownItem
                  className="w-100"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("Id", row.id);
                    formData.append("Active", true);
                    showApplyChangesSwal(() =>
                      activeOrDeactiveNewsMutate(formData)
                    );
                  }}
                >
                  <Check size={14} className="me-50" />
                  <span className="align-middle">فعال کردن</span>
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  const CustomPagination = () => {
    const count = Number(Math.ceil(data?.data.totalCount / 10));
    return (
      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          pageCount={count || 1}
          activeClassName="active"
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          onPageChange={(page) => setCurrentPage(page.selected + 1)}
          pageClassName={"page-item"}
          nextLinkClassName={"page-link"}
          nextClassName={"page-item next"}
          previousClassName={"page-item prev"}
          previousLinkClassName={"page-link"}
          pageLinkClassName={"page-link"}
          containerClassName={
            "pagination react-paginate justify-content-end my-2 pe-1"
          }
        />
      </div>
    );
  };

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  return (
    <Card className="overflow-hidden">
      <div className="react-dataTable">
        <DataTable
          noHeader
          subHeader
          pagination
          responsive
          paginationServer
          columns={columns}
          className="react-dataTable"
          paginationComponent={CustomPagination}
          data={data.data.news}
          subHeaderComponent={
            <ArticlesListCustomHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
              sortingCol={sortingCol}
              setSortingCol={setSortingCol}
              currentStatus={currentStatus}
              setCurrentStatus={setCurrentStatus}
              refetch={refetch}
            />
          }
        />
      </div>
    </Card>
  );
}

export default ArticlesListTable;
