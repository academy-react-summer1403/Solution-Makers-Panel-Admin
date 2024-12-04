import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import Select from "react-select";

function CourseAssistanceListHeader({
  editId,
  setEditId,
  createOrEditModal,
  setCreateOrEditModal,
}) {
  return (
    <>
      <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75 d-flex justify-content-end">
        <Button
          color="primary"
          onClick={() => setCreateOrEditModal(!createOrEditModal)}
        >
          افزودن پشتیبان جدید
        </Button>
      </div>
    </>
  );
}

export default CourseAssistanceListHeader;
