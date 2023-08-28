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
import InfiniteScroll from "react-infinite-scroll-component";
import MsgToast from "../Components/MsgToast";
import MsgToastError from "../Components/MsgToastError";

import * as Yup from "yup";
import { useFormik } from "formik";
import DeleteModal from "../Components/DeleteModal";
import makeApiCall from "../utils/makeApiCall";
import { debounce } from "lodash";

export const handleScroll = async (productState) => {
  try {
    productState.setIsLoading(true);
    let skip = productState.phonebooks.length;

    let data = await new makeApiCall().get("phonebook", { skip });

    const products = data.phonebooks;

    productState.setIsLoading(false);

    productState.setPhoneBookList((p) => [...p, ...products]);

    setFetchingNew(false);
  } catch (err) {
    productState.setIsLoading(false);
  }
};

const phonebookList = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [phonebooks, setPhoneBookList] = useState([]);
  const [phonebook, setPhoneBook] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [totalPhonebooks, setTotalPhonebooks] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [IsError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  let productState = {
    phonebooks,
    setIsLoading,
    setPhoneBookList,
  };

  const resetFlag = () => {
    setIsSubmitted(false);
    setIsError(false);
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
        setPhoneBookList(data.phonebooks);
        setTotalPhonebooks(data.totalCount);
        setIsLoading(false);
      } catch (err) {
        handleError();
        setIsLoading(false);
      }
    };
    getPhoneBookList();
  }, [isSubmitted]);

  const toggle = useCallback(() => {
    setModal(!modal);
  }, [modal]);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      firstName: phonebook?.firstName || "",
      lastName: phonebook?.lastName || "",
      phoneNumber: phonebook?.phoneNumber || "",
    },

    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("Please Enter A First name")
        .max(15, "Maximum length is 15 characters"),
      lastName: Yup.string()
        .notRequired("Please last name")
        .max(15, "Maximum length is 15 characters"),

      phoneNumber: Yup.string()
        .required("Please Enter phone number")
        .max(15, "Maximum length is 15 numbers"),
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

          validation.resetForm();
          setIsLoading(false);
          return;
        } catch (err) {
          handleError(err);
          setIsLoading(false);

          return;
        }
      }

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
    },
  });

  const handleEdit = (p) => {
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
    }, 500),
    []
  );

  const handleSearch = (e) => {
    let term = e.target.value;
    handler(term);
  };

  function handleError(err) {
    let { message } = err?.response?.data || {};

    setIsLoading(false);
    setIsSubmitted(false);
    setIsError(true);

    setErrorMsg(message || "a server error occured");
  }

  const handleOnchange = (e, type = "text") => {
    let value = e.target.value;
    let name = e.target.name;

    let regex = /[^a-zA-Z]/;

    if (type === "number") {
      regex = /[^0-9]/;
    }

    if (!regex.test(value)) {
      validation.setFieldValue(name, value);
    }
  };

  return (
    <React.Fragment>
      <div className="container">
        {/* <Container> */}
        <Row>
          <Col md={5}>
            <CardBody>
              <div className="header__container">
                <div className="header">Phone book</div>

                <div className="total__phonebooks">
                  {isLoading ? (
                    <div className="ripple">
                      <div></div>
                      <div></div>
                    </div>
                  ) : null}
                  <ul>
                    <li>
                      <p>{totalPhonebooks} total phone books</p>
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
                </div>
                <div className="search-box">
                  <Input
                    type="text"
                    className="form-control search"
                    placeholder="Search for contact by first, last or full name"
                    onChange={handleSearch}
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
              </div>
            </CardBody>
          </Col>
        </Row>

        <div className="phoneList__container">
          <Row>
            <Col>
              {/* <Card> */}
              <CardBody>
                {phonebooks && phonebooks.length ? (
                  <InfiniteScroll
                    dataLength={phonebooks && phonebooks.length}
                    next={() => handleScroll(productState)}
                    hasMore={true}
                  >
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
                                          <img
                                            src="/static/delete.png"
                                            alt=""
                                          />
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </InfiniteScroll>
                ) : null}

                {!isLoading && !phonebooks.length ? "No data yet" : ""}
              </CardBody>
              {/* </Card> */}
            </Col>
          </Row>
        </div>

        {errorMsg ? (
          <MsgToastError
            msg={errorMsg}
            color="danger"
            icon="ri-error-warning-line"
          />
        ) : null}
        {/* </Container> */}
      </div>

      <Modal id="showModal" size="lg" isOpen={modal} toggle={toggle} centered>
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
                  <Label htmlFor="name-field" className="form-label">
                    first name
                  </Label>
                  <Input
                    name="firstName"
                    id="name-field"
                    className="form-control"
                    placeholder="Enter first name"
                    type="text"
                    onChange={handleOnchange}
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
                  <Label htmlFor="name-field" className="form-label">
                    last name
                  </Label>
                  <Input
                    name="lastName"
                    id="name-field"
                    className="form-control"
                    placeholder="Enter last name"
                    type="text"
                    onChange={handleOnchange}
                    onBlur={validation.handleBlur}
                    value={validation.values.lastName || ""}
                    invalid={
                      validation.touched.lastName && validation.errors.lastName
                        ? true
                        : false
                    }
                  />
                  {validation.touched.lastName && validation.errors.lastName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.lastName}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={12}>
                <div>
                  <Label htmlFor="phoneNumber-field" className="form-label">
                    Phone number
                  </Label>
                  <Input
                    name="phoneNumber"
                    id="phoneNumber-field"
                    className="form-control"
                    placeholder="Enter phone number"
                    type="text"
                    rows="3"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={(e) => handleOnchange(e, "number")}
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
              {!isUpdate ? (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    validation.resetForm();
                  }}
                >
                  Clear
                </button>
              ) : null}

              <button type="submit" className="btn btn-success" id="add-btn">
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
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={isLoading}
      />
    </React.Fragment>
  );
};

export default phonebookList;
