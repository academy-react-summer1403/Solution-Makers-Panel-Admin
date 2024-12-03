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
import { getAllClassRooms } from "../../services/api/ClassRoom";
import ClassRoomsListTableHeader from "./CustomHeader";
import "@styles/react/libs/tables/react-dataTable-component.scss";

function ClassRoomsListTable() {
  const [editId, setEditId] = useState("");
  const [createOrEditModal, setCreateOrEditModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["classList"],
    queryFn: getAllClassRooms,
  });

  const columns = [
    {
      name: "نام کلاس",
      center: true,
      selector: (row) => row.classRoomName,
    },
    {
      name: "ظرفیت",
      center: true,
      selector: (row) => row.capacity,
    },
    {
      name: "نام ساختمان کلاس",
      center: true,
      selector: (row) => row.buildingName,
    },
    {
      name: "تاریخ ثبت کلاس",
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
            <ClassRoomsListTableHeader
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

export default ClassRoomsListTable;
