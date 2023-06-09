import React, { useEffect, useState, useCallback } from "react";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  FormFeedback,
} from "reactstrap";

import BreadCrumb from "../Components/BreadCrumb";
import MsgToast from "../Components/MsgToast";
import MsgToastError from "../Components/MsgToastError";

import * as Yup from "yup";
import { useFormik } from "formik";
import DeleteModal from "../Components/DeleteModal";
import makeApiCall from "../utils/makeApiCall";
import { debounce } from "lodash";

const phonebookList = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [phonebooks, setPhoneBookList] = useState([]);
  const [phonebook, setPhoneBook] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [IsError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const resetFlag = () => {
    setIsSubmitted(false);
    setIsDeleted(false);
    setErrorMsg("");
    setIsAdded(false);
    setIsUpdated(false);
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (isDeleted || isAdded || isUpdated || IsError) {
      setTimeout(() => {
        resetFlag();
      }, 3000);
    }
  }, [isDeleted, isAdded, isUpdated, IsError]);

  useEffect(() => {
    const getPhoneBookList = async () => {
      setIsLoading(true);

      try {
        let data = await new makeApiCall().get("phonebook");
        console.log(data, "phone books");
        setPhoneBookList(data.phonebooks);
        setIsLoading(false);
      } catch (err) {
        handleError();
        setIsLoading(false);
      }
    };
    getPhoneBookList();
  }, [isSubmitted]);

  console.log(isLoading, "isLoading list");

  const toggle = useCallback(() => {
    setModal(!modal);
  }, [modal]);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      firstName: (phonebook && phonebook.firstName) || "",
      lastName: (phonebook && phonebook.lastName) || "",
      phoneNumber: (phonebook && phonebook.phoneNumber) || "",
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter A First name"),
      lastName: Yup.string().required("Please last name"),
      phoneNumber: Yup.string().required("Please Enter phone number"),
    }),

    onSubmit: async (values) => {
      resetFlag();
      setIsLoading(true);

      if (isUpdate) {
        try {
          let data = await new makeApiCall().put("phonebook", {
            ...values,
            _id: phonebook._id,
          });

          setIsSubmitted(true);
          setIsLoading(false);
          setIsUpdated(true);
          toggle();

          console.log(data, "UPDTATE");
          validation.resetForm();
          setIsLoading(false);
        } catch (err) {
          handleError(err);
          setIsLoading(false);
        }
      } else {
        try {
          let data = await new makeApiCall().post("phonebook", values);

          setPhoneBookList([...phonebooks, data.phonebook]);

          setIsLoading(false);
          setIsSubmitted(true);
          setIsAdded(true);
          toggle();
          validation.resetForm();
          setIsLoading(false);
        } catch (err) {
          handleError(err);
          setIsLoading(false);
        }
      }
    },
  });

  console.log(validation.errors);

  const handleEdit = (p) => {
    console.log(p, "EIDT BOOK");
    setIsUpdate(true);
    setPhoneBook(p);
    toggle();
  };

  const handleToggle = (p) => {
    setIsUpdate(false);
    setPhoneBook({});
    toggle();
  };

  const handleDelete = async (p) => {
    resetFlag();

    let data = await new makeApiCall().delete("phonebook", {
      data: {
        _id: phonebook._id,
      },
    });
    setIsSubmitted(true);
    setDeleteModal(false);
    setIsLoading(false);
    setIsDeleted(true);
  };

  const onClickDelete = (p) => {
    setPhoneBook(p);
    setDeleteModal(true);
  };

  const search = async (term) => {
    setIsLoading(true);

    let data = await new makeApiCall().get(`phonebook/:term`, {
      params: {
        term,
      },
    });
    setPhoneBookList(data.phonebook);
    setIsLoading(false);
  };
  const handler = useCallback(
    debounce((term) => {
      if (term) search(term);
      else search();
    }, 1000),
    []
  );

  const handleSearch = (e) => {
    let term = e.target.value;
    handler(term);
  };

  function handleError(err) {
    let { response } = (err && err) || {};
    let { data } = (response && response) || {};
    let { message } = (data && data) || {};
    console.log(message, err, "ADD ERROR");
    setIsLoading(false);
    setIsSubmitted(false);
    setIsError(true);

    setErrorMsg(message || "a server error occured");
  }

  return (
    <React.Fragment>
      <div className="container">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDelete}
          onCloseClick={() => setDeleteModal(false)}
          isLoading={isLoading}
        />

        <Container fluid>
          <div className="header">Phone book</div>

          <Row>
            <Col lg={12}>
              <ul className="tab">
                <li>
                  <h3>Contacts</h3>
                </li>

                <li>
                  <div className="flex-grow-1">
                    <button
                      className="btn btn-info add-btn"
                      onClick={() => {
                        handleToggle();
                      }}
                    >
                      <i className="ri-add-fill me-1 align-bottom"></i>
                      Add contact
                    </button>
                  </div>
                </li>
              </ul>
            </Col>
            <Col>
              <Card>
                <CardHeader>
                  <Row className="g-3">
                    <Col md={4}>
                      <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for contact by last name or first name..."
                          onChange={(e) => handleSearch(e)}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                {isDeleted ? (
                  <MsgToast
                    msg={"contact deleted successfuly"}
                    color="success"
                    icon="ri-error-warning-line"
                  />
                ) : null}
                {isAdded ? (
                  <MsgToast
                    msg={"contact added successfuly"}
                    color="success"
                    icon="ri-error-warning-line"
                  />
                ) : null}
                {isUpdated ? (
                  <MsgToast
                    msg={"contact updated successfuly"}
                    color="success"
                    icon="ri-error-warning-line"
                  />
                ) : null}

                <CardBody>
                  {phonebooks.length
                    ? phonebooks.map((p, i) => {
                        return (
                          <div key={i} className="phoneList">
                            <div className="phoneList__list">
                              <div className="phoneList__item">
                                <div className="phoneList__details">
                                  <p className="phoneList__name">
                                    {p.firstName} {p.lastName}
                                  </p>

                                  <div className="phoneList__phoneIcon">
                                    <img src="/static/phone.png" alt="" />{" "}
                                    <p> {p.phoneNumber}</p>
                                  </div>
                                </div>
                                <div className="actions">
                                  <ul>
                                    <li>
                                      <span onClick={() => handleEdit(p)}>
                                        edit
                                      </span>
                                    </li>
                                    <li>
                                      <div
                                        className="actions__img"
                                        onClick={() => onClickDelete(p)}
                                      >
                                        <img src="/static/delete.png" alt="" />
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                  {isLoading ? <div className="loader">please wait</div> : ""}
                  {!isLoading && !phonebooks.length ? "No data yet" : ""}

                  <Modal
                    id="showModal"
                    size="lg"
                    isOpen={modal}
                    toggle={toggle}
                    centered
                  >
                    <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                      {isUpdate ? "Edit record" : "Add record"}
                    </ModalHeader>

                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="name-field"
                                className="form-label"
                              >
                                first name
                              </Label>
                              <Input
                                name="firstName"
                                id="name-field"
                                className="form-control"
                                placeholder="Enter first name"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.firstName || ""}
                                invalid={
                                  validation.touched.firstName &&
                                  validation.errors.firstName
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.firstName &&
                              validation.errors.firstName ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.firstName}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="name-field"
                                className="form-label"
                              >
                                last name
                              </Label>
                              <Input
                                name="lastName"
                                id="name-field"
                                className="form-control"
                                placeholder="Enter last name"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.lastName || ""}
                                invalid={
                                  validation.touched.lastName &&
                                  validation.errors.lastName
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.lastName &&
                              validation.errors.lastName ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.lastName}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          {/* phoneNumber */}
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="phoneNumber-field"
                                className="form-label"
                              >
                                Phone number
                              </Label>
                              <Input
                                name="phoneNumber"
                                id="phoneNumber-field"
                                className="form-control"
                                placeholder="Enter phone number"
                                type="number"
                                rows="3"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.phoneNumber || ""}
                                invalid={
                                  validation.touched.phoneNumber &&
                                  validation.errors.phoneNumber
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.phoneNumber &&
                              validation.errors.phoneNumber ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.phoneNumber}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setModal(false);
                            }}
                          >
                            {" "}
                            Close{" "}
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            id="add-btn"
                          >
                            {isUpdate
                              ? isLoading
                                ? "please wait"
                                : "Update"
                              : isLoading
                              ? "please wait"
                              : "Add contact"}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {errorMsg ? (
            <MsgToastError
              msg={errorMsg}
              color="danger"
              icon="ri-error-warning-line"
            />
          ) : null}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default phonebookList;
