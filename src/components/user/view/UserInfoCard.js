// ** React Imports
import { useState, Fragment } from "react";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  CardBody,
  Button,
  Badge,
  Modal,
  Input,
  Label,
  ModalBody,
  ModalHeader,
} from "reactstrap";

// ** Third Party Components
import Swal from "sweetalert2";
import { showApplyChangesSwal } from "../../../utility/Utils";
import Select from "react-select";
import { Check, Briefcase, X, Users, MessageSquare } from "react-feather";
import { useForm, Controller } from "react-hook-form";
import withReactContent from "sweetalert2-react-content";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../../services/middleware";
import toast from "react-hot-toast";

// const roleColors = {
//   editor: "light-info",
//   admin: "light-danger",
//   author: "light-warning",
//   maintainer: "light-success",
//   subscriber: "light-primary",
// };

// const statusColors = {
//   active: "light-success",
//   pending: "light-warning",
//   inactive: "light-secondary",
// };

// const statusOptions = [
//   { value: "active", label: "Active" },
//   { value: "inactive", label: "Inactive" },
//   { value: "suspended", label: "Suspended" },
// ];

// const countryOptions = [
//   { value: "uk", label: "UK" },
//   { value: "usa", label: "USA" },
//   { value: "france", label: "France" },
//   { value: "russia", label: "Russia" },
//   { value: "canada", label: "Canada" },
// ];

// const languageOptions = [
//   { value: "english", label: "English" },
//   { value: "spanish", label: "Spanish" },
//   { value: "french", label: "French" },
//   { value: "german", label: "German" },
//   { value: "dutch", label: "Dutch" },
// ];

const MySwal = withReactContent(Swal);

const UserInfoCard = ({ selectedUser }) => {
  // ** State
  const [show, setShow] = useState(false);
  const { courseId } = useParams();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => instance.get(`/Course/${courseId}`),
  });

  // console.log(data?.data);

  // ** Hook
  // const {
  //   reset,
  //   control,
  //   setError,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm({
  //   defaultValues: {
  //     username: selectedUser.username,
  //     lastName: selectedUser.fullName.split(' ')[1],
  //     firstName: selectedUser.fullName.split(' ')[0]
  //   }
  // })

  // ** render user img
  const renderCourseImg = (course) => {
    if (course.data.imageAddress) {
      return (
        <img
          height="120"
          width="160"
          alt="course-image"
          src={course.data.imageAddress}
          className="rounded mt-3 mb-2"
        />
      );
    } else {
      return (
        <img
          height="120"
          width="160"
          alt="course-image"
          src="/src/assets/images/notFound/1047293-صفحه-یافت-نشد-خطای-404.jpg"
          className="rounded mt-3 mb-2"
        />
      );
    }
  };

  // const onSubmit = (data) => {
  //   if (Object.values(data).every((field) => field.length > 0)) {
  //     setShow(false);
  //   } else {
  //     for (const key in data) {
  //       if (data[key].length === 0) {
  //         setError(key, {
  //           type: "manual",
  //         });
  //       }
  //     }
  //   }
  // };

  // const handleReset = () => {
  //   reset({
  //     username: selectedUser.username,
  //     lastName: selectedUser.fullName.split(" ")[1],
  //     firstName: selectedUser.fullName.split(" ")[0],
  //   });
  // };

  const queryClient = useQueryClient();

  const activateOrDeactiveCourse = (obj) =>
    instance.put("/Course/ActiveAndDeactiveCourse", obj);

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: activateOrDeactiveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries("courseDetails");
    },
    onError: () => {
      toast.error("error");
    },
  });

  if (isLoading) {
    return <span>loading data ....</span>;
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className="user-avatar-section">
            <div className="d-flex align-items-center flex-column">
              {renderCourseImg(data)}
              <div className="d-flex flex-column align-items-center text-center">
                <div className="user-info">
                  <h4>
                    {data.data !== null ? data.data.title : "Eleanor Aguilar"}
                  </h4>
                  {data?.data.isActive ? (
                    <span
                      style={{
                        display: "inline-flex",
                        marginTop: "10px",
                        padding: "5px 12px 5px 12px",
                        backgroundColor: "#cafade",
                        color: "#28c76f",
                      }}
                      className="text-capitalize rounded-2"
                    >
                      فعال
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        marginTop: "10px",
                        padding: "5px 12px 5px 12px",
                        backgroundColor: "#ffdbdb",
                        color: "#ff0000",
                      }}
                      className="text-capitalize rounded-2"
                    >
                      غیر فعال
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around my-2 pt-75">
            <div className="d-flex align-items-start me-2">
              <Badge color="light-primary" className="rounded p-75">
                <Users className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">{data.data.courseUserTotal}</h4>
                <small>دانشجو</small>
              </div>
            </div>
            <div className="d-flex align-items-start">
              <Badge color="light-primary" className="rounded p-75">
                <MessageSquare className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">{data.data.courseCommentTotal}</h4>
                <small>کامنت</small>
              </div>
            </div>
          </div>
          <h4 className="fw-bolder border-bottom pb-50 mb-1">جزئیات دوره</h4>
          <div className="info-container">
            {data.data !== null ? (
              <ul className="list-unstyled">
                <li className="mb-75">
                  <span className="fw-bolder me-25">نام استاد دوره :</span>
                  <span>{data.data.teacherName}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">نام کلاس :</span>
                  <span>{data.data.courseClassRoomName}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">سطح دوره :</span>
                  <span className="text-capitalize">
                    {data.data.courseLevelName}
                  </span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">نوع دوره :</span>
                  <span className="text-capitalize">
                    {data.data.courseTypeName}
                  </span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">قیمت دوره :</span>
                  <span>{data.data.cost.toLocaleString()} تومان</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">شروع دوره :</span>
                  <span>{data.data.startTime.slice(0, 10)}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">پایان دوره :</span>
                  <span>{data.data.endTime.slice(0, 10)}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">توضیحات دوره :</span>
                  <p>{data.data.describe}</p>
                </li>
              </ul>
            ) : null}
          </div>
          <div className="d-flex justify-content-center pt-2">
            <Button color="primary" onClick={() => setShow(true)}>
              ویرایش
            </Button>
            {data.data.isActive ? (
              <Button
                className="ms-1"
                color="danger"
                outline
                onClick={() => {
                  showApplyChangesSwal(() =>
                    mutateAsync({ active: false, id: courseId })
                  );
                }}
              >
                غیر فعال کردن
              </Button>
            ) : (
              <Button
                className="ms-1"
                color="success"
                outline
                onClick={() => {
                  showApplyChangesSwal(() =>
                    mutateAsync({ active: true, id: courseId })
                  );
                }}
              >
                فعال کردن
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
      {/* <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 pt-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit User Information</h1>
            <p>Updating user details will receive a privacy audit.</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='gy-1 pt-75'>
              <Col md={6} xs={12}>
                <Label className='form-label' for='firstName'>
                  First Name
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='firstName'
                  name='firstName'
                  render={({ field }) => (
                    <Input {...field} id='firstName' placeholder='John' invalid={errors.firstName && true} />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='lastName'>
                  Last Name
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='lastName'
                  name='lastName'
                  render={({ field }) => (
                    <Input {...field} id='lastName' placeholder='Doe' invalid={errors.lastName && true} />
                  )}
                />
              </Col>
              <Col xs={12}>
                <Label className='form-label' for='username'>
                  Username
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='username'
                  name='username'
                  render={({ field }) => (
                    <Input {...field} id='username' placeholder='john.doe.007' invalid={errors.username && true} />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='billing-email'>
                  Billing Email
                </Label>
                <Input
                  type='email'
                  id='billing-email'
                  defaultValue={selectedUser.email}
                  placeholder='example@domain.com'
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='status'>
                  Status:
                </Label>
                <Select
                  id='status'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={statusOptions}
                  theme={selectThemeColors}
                  defaultValue={statusOptions[statusOptions.findIndex(i => i.value === selectedUser.status)]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='tax-id'>
                  Tax ID
                </Label>
                <Input
                  id='tax-id'
                  placeholder='Tax-1234'
                  defaultValue={selectedUser.contact.substr(selectedUser.contact.length - 4)}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='contact'>
                  Contact
                </Label>
                <Input id='contact' defaultValue={selectedUser.contact} placeholder='+1 609 933 4422' />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='language'>
                  language
                </Label>
                <Select
                  id='language'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={languageOptions}
                  theme={selectThemeColors}
                  defaultValue={languageOptions[0]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='country'>
                  Country
                </Label>
                <Select
                  id='country'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={countryOptions}
                  theme={selectThemeColors}
                  defaultValue={countryOptions[0]}
                />
              </Col>
              <Col xs={12}>
                <div className='d-flex align-items-center mt-1'>
                  <div className='form-switch'>
                    <Input type='switch' defaultChecked id='billing-switch' name='billing-switch' />
                    <Label className='form-check-label' htmlFor='billing-switch'>
                      <span className='switch-icon-left'>
                        <Check size={14} />
                      </span>
                      <span className='switch-icon-right'>
                        <X size={14} />
                      </span>
                    </Label>
                  </div>
                  <Label className='form-check-label fw-bolder' for='billing-switch'>
                    Use as a billing address?
                  </Label>
                </div>
              </Col>
              <Col xs={12} className='text-center mt-2 pt-50'>
                <Button type='submit' className='me-1' color='primary'>
                  Submit
                </Button>
                <Button
                  type='reset'
                  color='secondary'
                  outline
                  onClick={() => {
                    handleReset()
                    setShow(false)
                  }}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal> */}
    </Fragment>
  );
};

export default UserInfoCard;
