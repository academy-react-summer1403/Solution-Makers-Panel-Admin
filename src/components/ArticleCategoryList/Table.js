import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNewsCategoriesList } from "../../services/api/Articles";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Edit2, Eye, MoreHorizontal } from "react-feather";
import NewsWithCategoryModal from "./NewsWithCategoryModal";
import ArticleCategoryListTableHeader from "./CustomHeader";
import ErrorComponent from "../common/ErrorComponent";
import "@styles/react/libs/tables/react-dataTable-component.scss";

function ArticleCategoryListTable() {
  const [categoryId, setCategoryId] = useState("");
  const [editId, setEditId] = useState("");
  const [newsWithCategoryModal, setNewsWithCategoryModal] = useState(false);
  const [createOrEditCategoryModal, setCreateOrEditCategoryModal] =
    useState(false);

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["newsCategories"],
    queryFn: getNewsCategoriesList,
  });

  const columns = [
    {
      name: "عنوان دسته بندی",
      center: true,
      selector: (row) => row.categoryName,
    },
    {
      name: "شناسه دسته بندی",
      center: true,
      selector: (row) => row.id,
    },
    {
      name: "نام آیکون",
      center: true,
      selector: (row) => row.iconName,
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
                  setCategoryId(row.id);
                  setNewsWithCategoryModal(!newsWithCategoryModal);
                }}
              >
                <Eye size={14} className="me-50" />
                <span className="align-middle">نمایش مقاله ها</span>
              </DropdownItem>
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() => {
                  setEditId(row.id);
                  setCreateOrEditCategoryModal(!createOrEditCategoryModal);
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
    <>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            responsive
            columns={columns}
            className="react-dataTable"
            data={categories?.data}
            subHeaderComponent={
              <ArticleCategoryListTableHeader
                editId={editId}
                setEditId={setEditId}
                createOrEditCategoryModal={createOrEditCategoryModal}
                setCreateOrEditCategoryModal={setCreateOrEditCategoryModal}
              />
            }
          />
        </div>
      </Card>

      <NewsWithCategoryModal
        categoryId={categoryId}
        newsWithCategoryModal={newsWithCategoryModal}
        setNewsWithCategoryModal={setNewsWithCategoryModal}
      />
    </>
  );
}

export default ArticleCategoryListTable;
