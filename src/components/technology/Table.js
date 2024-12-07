import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTechnologies } from "../../services/api/Technology";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Edit2, MoreHorizontal } from "react-feather";
import TechsListCustomHeader from "./CustomHeader";
import ErrorComponent from "../common/ErrorComponent";
import "@styles/react/libs/tables/react-dataTable-component.scss";

function TechnologiesTable() {
  const [editId, setEditId] = useState("");
  const [createOrEditTechModal, setCreateOrEditTechModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["techsList"],
    queryFn: getTechnologies,
  });

  const columns = [
    {
      name: "نام تکنولوژی",
      center: true,
      selector: (row) => row.techName,
    },
    {
      name: "شناسه تکنولوژی",
      center: true,
      selector: (row) => row.id,
    },
    {
      name: "توضیحات",
      center: true,
      selector: (row) => row.describe,
    },
    {
      name: "آدرس آیکون",
      center: true,
      selector: (row) => row.iconAddress,
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
                  setCreateOrEditTechModal(!createOrEditTechModal);
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
              return pattern.test(item.techName) || pattern.test(item.describe);
            }
          })}
          subHeaderComponent={
            <TechsListCustomHeader
              editId={editId}
              setEditId={setEditId}
              createOrEditTechModal={createOrEditTechModal}
              setCreateOrEditTechModal={setCreateOrEditTechModal}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          }
        />
      </div>
    </Card>
  );
}

export default TechnologiesTable;
