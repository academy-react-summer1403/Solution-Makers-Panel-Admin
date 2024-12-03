import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { Edit2, MoreHorizontal } from "react-feather";
import ErrorComponent from "../common/ErrorComponent";
import DataTable from "react-data-table-component";
import DepartmentListCustomHeader from "./CustomHeader";
import { getAllDepartments } from "../../services/api/Department";
import "@styles/react/libs/tables/react-dataTable-component.scss";

function DepartmentListTable() {
  const [editId, setEditId] = useState("");
  const [createOrEditModal, setCreateOrEditModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["departmentList"],
    queryFn: getAllDepartments,
  });

  const columns = [
    {
      name: "نام دپارتمان",
      center: true,
      selector: (row) => row.depName,
    },
    {
      name: "شناسه",
      center: true,
      selector: (row) => row.id,
    },
    {
      name: "نام ساختمان",
      center: true,
      selector: (row) => row.buildingName,
    },
    {
      name: "تاریخ ثبت",
      center: true,
      selector: (row) => row.insertDate.slice(0, 10),
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
                tag="span"
                className="w-100"
                onClick={() => {
                  setEditId(row.id);
                  setCreateOrEditModal(!createOrEditModal);
                }}
              >
                <Edit2 size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <Card className="overflow-hidden">
      <div className="react-dataTable">
        <DataTable
          noHeader
          subHeader
          responsive
          columns={columns}
          className="react-dataTable"
          data={data?.data}
          subHeaderComponent={
            <DepartmentListCustomHeader
              editId={editId}
              setEditId={setEditId}
              createOrEditModal={createOrEditModal}
              setCreateOrEditModal={setCreateOrEditModal}
            />
          }
        />
      </div>
    </Card>
  );
}

export default DepartmentListTable;
