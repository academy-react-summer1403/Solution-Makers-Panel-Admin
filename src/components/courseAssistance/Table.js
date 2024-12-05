import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { Edit2, MoreHorizontal } from "react-feather";
import ErrorComponent from "../common/ErrorComponent";
import DataTable from "react-data-table-component";
import { getAllAssistance } from "../../services/api/Assistance";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import CourseAssistanceListHeader from "./CustomHeader";
import UsersListTable from "../users/list/Table";
import CoursesListTable from "../courses/list/Table";

function CourseAssistanceListTable() {
  const [editModal, setEditModal] = useState(false);
  const [editStep, setEditStep] = useState(1);
  const [editObj, setEditObj] = useState({});

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
                  setEditModal(!editModal);
                  setEditObj({
                    id: row.id,
                    courseId: row.courseId,
                    userId: row.userId,
                  });
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

  useEffect(() => {
    if (!editModal) {
      setEditStep(1);
    }
  }, [editModal]);

  useEffect(() => {
    console.log(editObj);
  }, [editObj]);

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            responsive
            columns={columns}
            className="react-dataTable"
            data={data?.data.reverse()}
            subHeaderComponent={<CourseAssistanceListHeader />}
          />
        </div>
      </Card>

      <Modal
        isOpen={editModal}
        toggle={() => setEditModal(!editModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setEditModal(!editModal)}>
          {editStep == 1 ? "ویرایش پشتیبان دوره" : "ویرایش دوره پشتیبانی"}
        </ModalHeader>
        <ModalBody>
          {editStep == 1 ? (
            <UsersListTable
              RowsOfPage={5}
              needAddNewUser={false}
              needUserId={true}
              setEditStep={setEditStep}
              editObj={editObj}
              setEditObj={setEditObj}
            />
          ) : (
            <CoursesListTable
              RowsOfPage={5}
              needAddNewCourse={false}
              needCourseId={true}
              setEditStep={setEditStep}
              editObj={editObj}
              setEditObj={setEditObj}
              setEditModal={setEditModal}
            />
          )}
        </ModalBody>
      </Modal>
    </>
  );
}

export default CourseAssistanceListTable;
