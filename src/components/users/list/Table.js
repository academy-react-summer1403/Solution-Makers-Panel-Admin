import { useEffect, useState } from "react";
import instance from "../../../services/middleware";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { FileText, Trash, MoreHorizontal } from "react-feather";
import UsersCustomHeader from "./CustomHeader";
import { selectThemeColors } from "../../../utility/Utils";
import toast from "react-hot-toast";

function UsersListTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRole, setCurrentRole] = useState({
    value: "",
    label: "انتخاب کنید",
  });
  const [currentStatus, setCurrentStatus] = useState({
    value: "",
    label: "انتخاب کنید",
  });

  const getUsersList = () =>
    instance.get(
      `/User/UserMannage?PageNumber=${currentPage}&RowsOfPage=10&SortingCol=DESC&SortType=InsertDate${
        searchTerm ? `&Query=${searchTerm}` : ""
      }${currentRole.value ? `&roleId=${currentRole.value}` : ""}${
        currentStatus.value ? `&IsActiveUser=${currentStatus.value}` : ""
      }`
    );

  const reverseToActiveUser = (userId) =>
    instance.put("/User/ReverseToActiveUser", {
      userId,
    });

  const deleteUser = (userId) =>
    instance.delete("/User/DeleteUser", {
      data: { userId },
    });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersList,
  });

  const { mutateAsync: deleteUserMutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("کاربر حذف شد");
      queryClient.invalidateQueries("users");
    },
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  const { mutateAsync: reverseToActiveUserMutate } = useMutation({
    mutationFn: reverseToActiveUser,
    onSuccess: () => {
      toast.success("تغییرات اعمال شد");
      queryClient.invalidateQueries("users");
    },
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  useEffect(() => {
    refetch();
  }, [currentPage, currentRole, currentStatus]);

  //   console.log(data?.data.listUser);
  //   console.log(data?.data.totalCount);
  //   console.log(data?.data);

  const columns = [
    {
      name: "نام",
      center: true,
      selector: (row) => row.fname,
    },
    {
      name: "نام خانوادگی",
      center: true,
      selector: (row) => row.lname,
    },
    {
      name: "ایمیل",
      center: true,
      selector: (row) => row.gmail,
    },
    {
      name: "َشماره همراه",
      center: true,
      selector: (row) => row.phoneNumber,
    },
    {
      name: "وضعیت",
      center: true,
      cell: (row) => {
        if (row.active == "True") {
          return (
            <span
              className="rounded-1"
              style={{
                padding: 4,
                backgroundColor: "#cafade",
                color: "#28c76f",
              }}
            >
              فعال
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
              <DropdownItem className="w-100" onClick={() => console.log(row.id)}>
                <FileText size={14} className="me-50" />
                <span className="align-middle">جزئیات</span>
              </DropdownItem>
              <DropdownItem
                className="w-100"
                onClick={() => deleteUserMutate(row.id)}
              >
                <Trash size={14} className="me-50" />
                <span className="align-middle">حذف</span>
              </DropdownItem>
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">فیلترها</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="6">
              <Label for="role-select">نقش</Label>
              <Select
                isClearable={false}
                value={currentRole}
                options={data?.data.roles.map((role) => ({
                  value: role.id,
                  label: role.roleName,
                }))}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentPage(1);
                  setCurrentRole(data);
                }}
              />
            </Col>
            {/* <Col className='my-md-0 my-1' md='4'>
              <Label for='plan-select'>Plan</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={planOptions}
                value={currentPlan}
                onChange={data => {
                  setCurrentPlan(data)
                  dispatch(
                    getData({
                      sort,
                      sortColumn,
                      q: searchTerm,
                      page: currentPage,
                      perPage: rowsPerPage,
                      role: currentRole.value,
                      currentPlan: data.value,
                      status: currentStatus.value
                    })
                  )
                }}
              />
            </Col> */}
            <Col md="6">
              <Label for="status-select">وضعیت</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={[
                  { value: "true", label: "فعال" },
                  { value: "false", label: "غیر فعال" },
                ]}
                value={currentStatus}
                onChange={(data) => {
                  setCurrentPage(1);
                  setCurrentStatus(data);
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

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
            data={data?.data.listUser}
            subHeaderComponent={
              <UsersCustomHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                refetch={refetch}
              />
            }
          />
        </div>
      </Card>
    </>
  );
}

export default UsersListTable;
