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
import CourseLevelListHeader from "./CustomHeader";
import { getAllCourseLevels } from "../../services/api/CourseLevel";

function CourseLevelListTable() {
  const [editId, setEditId] = useState("");
  const [createOrEditModal, setCreateOrEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["courseLevelsList"],
    queryFn: getAllCourseLevels,
  });

  const columns = [
    {
      name: "نام سطح",
      center: true,
      selector: (row) => row.levelName,
    },
    {
      name: "شناسه",
      center: true,
      selector: (row) => row.id,
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
          data={data?.data.filter((item) => {
            if (!searchTerm) {
              return item;
            } else {
              const pattern = new RegExp(`${searchTerm}`, "i");
              return pattern.test(item.levelName);
            }
          })}
          subHeaderComponent={
            <CourseLevelListHeader
              editId={editId}
              setEditId={setEditId}
              createOrEditModal={createOrEditModal}
              setCreateOrEditModal={setCreateOrEditModal}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          }
        />
      </div>
    </Card>
  );
}

export default CourseLevelListTable;
