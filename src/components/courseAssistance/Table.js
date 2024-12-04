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

import { getAllAssistance } from "../../services/api/Assistance";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import CourseAssistanceListHeader from "./CustomHeader";

function CourseAssistanceListTable() {
  const [editId, setEditId] = useState("");
  const [createOrEditModal, setCreateOrEditModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["assistanceList"],
    queryFn: getAllAssistance,
  });

  const columns = [
    {
      name: "نام پشتیبان",
      center: true,
      selector: (row) => row.assistanceName,
    },
    {
      name: "نام دوره",
      center: true,
      selector: (row) => row.courseName,
    },
    {
      name: "تاریخ ثبت",
      center: true,
      selector: (row) => row.inserDate.slice(0, 10),
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
            <CourseAssistanceListHeader
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

export default CourseAssistanceListTable;
