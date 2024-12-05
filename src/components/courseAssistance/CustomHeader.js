import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import toast from "react-hot-toast";
import UsersListTable from "../users/list/Table";
import CoursesListTable from "../courses/list/Table";
import Swal from "sweetalert2";
import { addAssistanceForCourse } from "../../services/api/Assistance";

function CourseAssistanceListHeader() {
  const [step, setStep] = useState(1);
  const [obj, setObj] = useState({});
  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: addAssistanceForCourse,
    onSuccess: () => {
      toast.success("پشتیبان با موفقیت انتخاب شد");
      queryClient.invalidateQueries("assistanceList");
      setModal(false);
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  useEffect(() => {
    if (Object.keys(obj).length == 2) {
      Swal.fire({
        title: "آیا از انتخاب پشتیبان مطمئن هستید؟",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7367F0",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله",
        cancelButtonText: "خیر",
        customClass: {
          confirmButton: "mx-1 px-2 fs-5 rounded-2",
          cancelButton: "mx-1 px-2 fs-5 rounded-2",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          mutateAsync(obj);
        }
      });
    }
  }, [obj]);

  return (
    <>
      <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75 d-flex justify-content-end">
        <Button color="primary" onClick={() => setModal(!modal)}>
          افزودن پشتیبان جدید
        </Button>
      </div>

      <Modal
        isOpen={modal}
        toggle={() => setModal(!modal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setModal(!modal)}>
          {step == 1 ? "انتخاب کاربر به عنوان پشتیبان" : "انتخاب دوره پشتیبانی"}
        </ModalHeader>
        <ModalBody>
          {step == 1 ? (
            <UsersListTable
              RowsOfPage={5}
              needAddNewUser={false}
              needUserId={true}
              setStep={setStep}
              setObj={setObj}
            />
          ) : (
            <CoursesListTable
              RowsOfPage={5}
              needAddNewCourse={false}
              needCourseId={true}
              setStep={setStep}
              setObj={setObj}
            />
          )}
        </ModalBody>
      </Modal>
    </>
  );
}

export default CourseAssistanceListHeader;
