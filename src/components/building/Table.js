import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { Check, Edit2, MoreHorizontal, X } from "react-feather";
import ErrorComponent from "../common/ErrorComponent";
import DataTable from "react-data-table-component";
import {
  activeOrDeactiveBuilding,
  getAllBuildings,
} from "../../services/api/Building";
import toast from "react-hot-toast";
import BuildingListCustomHeader from "./CustomHeader";
import { showApplyChangesSwal } from "../../utility/Utils";

function BuildingListTable() {
  const [editId, setEditId] = useState("");
  const [createOrEditModal, setCreateOrEditModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["buildingsList"],
    queryFn: getAllBuildings,
  });

  const { mutateAsync } = useMutation({
    mutationFn: activeOrDeactiveBuilding,
    onSuccess: () => {
      toast.success("تغییرات اعمال شد");
      queryClient.invalidateQueries("buildingsList");
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  const columns = [
    {
      name: "نام ساختمان",
      center: true,
      selector: (row) => row.buildingName,
    },
    {
      name: "تاریخ شروع به کار",
      center: true,
      selector: (row) => row.workDate.slice(0, 10),
    },
    {
      name: "طبقه",
      center: true,
      selector: (row) => row.floor,
    },
    {
      name: "وضعیت",
      center: true,
      cell: (row) => {
        if (row.active) {
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
            <DropdownMenu className="mb-4" container="body">
              {row.active ? (
                <DropdownItem
                  tag="span"
                  className="w-100"
                  onClick={() => {
                    showApplyChangesSwal(() =>
                      mutateAsync({ active: false, id: row.id })
                    );
                  }}
                >
                  <X size={14} className="me-50" />
                  <span className="align-middle">غیر فعال کردن</span>
                </DropdownItem>
              ) : (
                <DropdownItem
                  tag="span"
                  className="w-100"
                  onClick={() => {
                    showApplyChangesSwal(() =>
                      mutateAsync({ active: true, id: row.id })
                    );
                  }}
                >
                  <Check size={14} className="me-50" />
                  <span className="align-middle">فعال کردن</span>
                </DropdownItem>
              )}
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
            <BuildingListCustomHeader
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

export default BuildingListTable;
