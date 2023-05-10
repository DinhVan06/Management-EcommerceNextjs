import React, { useEffect, useState } from "react";
import {
  Modal,
  Space,
  Table,
  Upload,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { Image, Button, Form, Input, message, Popconfirm } from "antd";
import TextArea from "antd/lib/input/TextArea";
import "../../index.css";
import { axiosClient } from "../../../libraries/axiosClient.js";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FaTrashRestore } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { API_URL } from "../../../constants/URLS.js";
import axios from "axios";
import numeral from "numeral";
import moment from "moment";

function Employees() {
  const [employees, setEmployees] = useState<any>([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState<any>(false);
  const [editFormDelete, setEditFormDelete] = useState<any>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // hình ảnh
  const [file, setFile] = useState<any>(null);
  // biến kiểm tra delete
  const [isDelete, setIsDelete] = useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [createFormVisible, setCreateFormVisible] = useState<any>(false);
  // hình ảnh chi tiết
  const [isPreview, setIsPreview] = useState<any>(false);
  const columns = [
    {
      title: "Hình ảnh",
      key: "imageUrl",
      dataIndex: "imageUrl",
      width: "10%",
      render: (text: any, record: any) => {
        return (
          <div>
            {text && (
              <React.Fragment>
                <Image
                  onClick={() => {
                    setSelectedRecord(record);
                    setIsPreview(true);
                  }}
                  preview={{
                    visible: false,
                  }}
                  width={60}
                  src={`${API_URL}${text}`}
                />
                <div
                  style={{
                    display: "none",
                  }}
                >
                  <Image.PreviewGroup
                    preview={{
                      visible: isPreview && record._id === selectedRecord?._id,
                      onVisibleChange: (vis) => setIsPreview(vis),
                    }}
                  >
                    <Image src={`${API_URL}${text}`} />
                    {record &&
                      record.images &&
                      record.images.map((image: any) => {
                        return <Image key={image} src={`${API_URL}${image}`} />;
                      })}
                  </Image.PreviewGroup>
                </div>
              </React.Fragment>
            )}
          </div>
        );
      },
    },
    {
      title: "Họ Và Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Ngày Sinh",
      dataIndex: "birthDay",
      key: "birthDay",
      render: (text: any) => {
        return <p>{moment(text).format("DD/MM/yyyy")}</p>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        return (
          <div className="flex gap-5">
            {/* upload hình ảnh */}
            <Upload
              showUploadList={false}
              name="file"
              action={API_URL + "/upload/employees/" + record._id}
              headers={{ authorization: "authorization-text" }}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  //console.log(info.file, info.fileList);
                }

                if (info.file.status === "done") {
                  message.success(`${info.file.name} Thêm thành công`);
                  setRefresh((pre) => pre + 1);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} Thêm thất bại`);
                }
              }}
            >
              <Button icon={<UploadOutlined />} />
            </Upload>
            {/* Update */}
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                //console.log("selectes", record);
                updateForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            />
            {/* delete */}
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .patch("/employees/" + id, { isDelete: true })
                  .then((response: any) => {
                    message.success(
                      "Đã xóa thành công và thêm vào danh mục rác"
                    );
                    setRefresh((pre) => pre + 1);
                  })
                  .catch((err: any) => {
                    message.error("Xóa thất bại");
                  });
                //console.log("delete", record);
              }}
              onCancel={() => {}}
              okText={<p className="text-black">Có</p>}
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const columnsDelete = [
    {
      title: "Họ Và Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        return (
          <Space>
            {/* delete */}
            <Popconfirm
              title="Bạn chắc chắn muốn xóa vĩnh viễn không?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/employees/" + id)
                  .then((response: any) => {
                    message.success("Xóa thành công");
                    setRefresh((pre) => pre + 1);
                  })
                  .catch((err: any) => {
                    message.error("Xóa thất bai");
                  });
                //console.log("delete", record);
              }}
              onCancel={() => {}}
              okText={<p className="text-black">Có</p>}
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
            {/* Restore */}
            <Button
              onClick={() => {
                const id = record._id;
                console.log("id", id);
                axiosClient
                  .patch("/employees/" + id, { isDelete: false })
                  .then((response) => {
                    message.success("Khôi phục thành công");
                    setRefresh((pre) => pre + 1);
                    setEditFormDelete(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    message.error("Khôi phục thất bại");
                  });
              }}
              className="flex items-center bg-blue-400 rounded-2xl text-white"
            >
              <div className="flex hover:text-black">
                <FaTrashRestore size={"16px"} style={{ marginRight: "5px" }} />
                Khôi phục
              </div>
            </Button>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    axiosClient
      .get("/employees")
      .then((response) => {
        let array: any[] = [];
        // console.log(response.data);
        response.data.map((prod: any) => {
          if (prod.isDelete === false) {
            array.push(prod);
          }
        });
        console.log(response.data);
        setEmployees(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  useEffect(() => {
    axiosClient
      .get("/employees")
      .then((response) => {
        let array: any[] = [];
        response.data.map((prod: any) => {
          // console.log(response.data);
          if (prod.isDelete === true) {
            array.push(prod);
          }
        });
        setIsDelete(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  // xử lý thêm mới
  const onFinish = (values: any) => {
    axiosClient.post("/employees", values).then((response) => {
      const { _id } = response.data;
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(API_URL + "/upload/employees/" + _id, formData)
        .then((respose) => {
          //console.log(respose.data);
          message.success("Thêm thành công❤");
          // reset dữ liệu đã nhập ở form nhập
          createForm.resetFields();

          // load lại form
          setRefresh((pre) => pre + 1);
        })
        .catch((err) => {
          console.log(err);
          message.error("Thêm thất bại😥");
        });
    });
  };
  const onFinishFailed = (errors: any) => {
    //console.log("💣", errors);
  };
  // xử lý cập nhật thông tin
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/employees/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công ❤");
        updateForm.resetFields();
        // load lại form
        setRefresh((pre) => pre + 1);
        // đóng
        setEditFormVisible(false);
      })
      .catch((err: any) => {
        message.error("Cập nhật thất bại😥");
      });
  };
  const onUpdateFinishFailed = (errors: any) => {
    //console.log("💣", errors);
  };
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  // validate
  // validate phone number
  const phoneValidator = (rule: any, value: any, callback: any) => {
    const phoneNumberPattern =
      /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    if (value && !phoneNumberPattern.test(value)) {
      callback("Số điện thoại không hợp lệ");
    } else {
      callback();
    }
  };

  // validate birth date
  const dateOfBirthValidator = (rule: any, value: any, callback: any) => {
    const dateFormat = "YYYY/MM/DD"; // Định dạng ngày tháng
    const currentDate = moment(); // Lấy ngày hiện tại
    const dateOfBirth = moment(value, dateFormat); // Chuyển đổi giá trị nhập vào thành kiểu moment

    // Kiểm tra tính hợp lệ của ngày sinh
    if (currentDate.diff(dateOfBirth, "days") < 0) {
      callback("Ngày sinh phải nhỏ hơn ngày hiện tại");
    } else {
      callback();
    }
  };
  return (
    <>
      <div className="text-blue-700 font-bold text-[25px] text-center mb-10">
        NHÂN VIÊN
      </div>
      <div className="flex mb-4">
        <p className="flex-auto font-bold">Danh sách nhân viên</p>
        <div className="total-categories font-bold">
          <span className="text-black">Tổng: </span>
          <span className="text-red-600">{employees.length} nhân viên</span>
        </div>
      </div>
      <div>
        {/* modal thêm mới */}
        <div className="ant-modal-content">
          <Modal
            centered
            open={createFormVisible}
            title="Thêm mới thông tin khách hàng"
            onOk={() => {
              createForm.submit();
            }}
            onCancel={() => {
              setCreateFormVisible(false);
            }}
            okText={<p className="text-black">Thêm</p>}
            cancelText="Đóng"
            className="w-[50rem]"
          >
            <Form
              form={createForm}
              name="create-form"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              className="w-[100%]"
            >
              <div className="w-[100%]">
                {/* FirstName */}
                <Form.Item
                  hasFeedback
                  className=""
                  label="Họ - Tên Đệm"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Họ - Tên đệm không được để trống!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                {/* LastName */}
                <Form.Item
                  hasFeedback
                  className=""
                  label="Tên"
                  name="lastName"
                  rules={[
                    { required: true, message: "Tên không được để trống!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                {/* Email */}
                <Form.Item
                  hasFeedback
                  className=""
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email không thể để trống" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                  hasFeedback
                  className=""
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Số điện thoại bắt buộc nhập!" },
                    { min: 10, message: "Số điện thoại không quá 10 chữ số!" },
                    { max: 10, message: "Số điện thoại không quá 10 chữ số!" },
                    {
                      validator: phoneValidator,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                {/* Address */}
                <Form.Item
                  hasFeedback
                  className=""
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    { required: true, message: "Địa chỉ không được để trống!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                {/* BirthDay */}
                <Form.Item
                  hasFeedback
                  className=""
                  label="Ngày Sinh"
                  name="birthDay"
                  rules={[
                    {
                      validator: dateOfBirthValidator,
                    },
                    { type: "date", message: "Ngày sinh không hợp lệ" },
                  ]}
                >
                  <DatePicker format="YYYY/MM/DD" />
                </Form.Item>

                <Form.Item
                  label="Hình ảnh"
                  name="file"
                  rules={[
                    {
                      required: true,
                      message: "Hình ảnh không được để trống!",
                    },
                  ]}
                >
                  <Upload
                    showUploadList={true}
                    // listType="picture-card"
                    beforeUpload={(file) => {
                      setFile(file);
                      return false;
                    }}
                  >
                    <div className="flex justify-center items-center w-[100px] h-[100px] border border-dashed rounded-lg hover:cursor-pointer hover:border-blue-400 hover:bg-white transition-all ease-in duration-150">
                      <UploadOutlined />
                    </div>
                  </Upload>
                </Form.Item>
              </div>
            </Form>
          </Modal>
        </div>
        <Table rowKey="_id" dataSource={employees} columns={columns} />

        <Modal
          centered
          open={editFormVisible}
          width={"50%"}
          title="Cập nhật thông tin nhân viên"
          onOk={() => {
            updateForm.submit();
          }}
          onCancel={() => {
            setEditFormVisible(false);
          }}
          okText={<p className="text-black">Lưu</p>}
          cancelText="Đóng"
        >
          <Form
            form={updateForm}
            name="update-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onUpdateFinish}
            onFinishFailed={onUpdateFinishFailed}
            autoComplete="off"
          >
            {/* FirstName */}
            <Form.Item
              hasFeedback
              className=""
              label="Họ - Tên Đệm"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Họ - Tên đệm không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* LastName */}
            <Form.Item
              hasFeedback
              className=""
              label="Tên"
              name="lastName"
              rules={[{ required: true, message: "Tên không được để trống!" }]}
            >
              <Input />
            </Form.Item>

            {/* Email */}
            <Form.Item
              hasFeedback
              className=""
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email không thể để trống" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              hasFeedback
              className=""
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Số điện thoại bắt buộc nhập!" },
                { min: 10, message: "Số điện thoại không quá 10 chữ số!" },
                { max: 10, message: "Số điện thoại không quá 10 chữ số!" },
                {
                  validator: phoneValidator,
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Address */}
            <Form.Item
              hasFeedback
              className=""
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Địa chỉ không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* BirthDay */}
            <Form.Item
              hasFeedback
              className=""
              label="Ngày Sinh"
              name="birthDay"
              rules={[
                {
                  validator: dateOfBirthValidator,
                },
                { type: "date", message: "Ngày sinh không hợp lệ" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Hình ảnh" name="file">
              <Upload
                showUploadList={true}
                // listType="picture-card"
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
              >
                <div className="flex justify-center items-center w-[100px] h-[100px] border border-dashed rounded-lg hover:cursor-pointer hover:border-blue-400 hover:bg-white transition-all ease-in duration-150">
                  <UploadOutlined />
                </div>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          centered
          title="Danh sách rác"
          open={editFormDelete}
          onCancel={() => {
            setEditFormDelete(false);
          }}
          okText={<p className="text-black">Lưu</p>}
          cancelText="Thoát"
          className="ant-modal"
        >
          <Table rowKey={"_id"} dataSource={isDelete} columns={columnsDelete} />
        </Modal>
      </div>
      <div className="flex mt-5">
        <Button
          className="bg-blue-500 text-white font-bold mr-6"
          onClick={() => {
            setCreateFormVisible(true);
            console.log("ok");
          }}
        >
          Thêm nhân viên
        </Button>
        <Button
          danger
          className="text-right flex items-center"
          onClick={() => {
            setEditFormDelete(true);
          }}
        >
          Thùng rác <AiFillDelete size={"20px"} />
        </Button>
      </div>
    </>
  );
}

export default Employees;
