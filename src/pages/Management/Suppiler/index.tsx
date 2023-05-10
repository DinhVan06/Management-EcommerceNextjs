import React, { useEffect, useState } from "react";
import { Modal, Space, Table, Upload } from "antd";
import { Image, Button, Form, Input, message, Popconfirm } from "antd";
import { axiosClient } from "../../../libraries/axiosClient.js";
import "../../index.css";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineUpload,
  AiOutlinePlus,
  AiOutlineLoading,
  AiFillQuestionCircle,
} from "react-icons/ai";
import { FaTrashRestore } from "react-icons/fa";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../constants/URLS.js";
import axios from "axios";

function Suppliers() {
  // Supplier
  const [suppliers, setSuppliers] = useState<any>([]);
  // biến kiểm tra delete
  const [isDelete, setIsDelete] = useState<any>([]);
  // xem
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // tạo mới
  const [createFormVisible, setCreateFormVisible] = useState(false);
  // xóa
  const [editFormDelete, setEditFormDelete] = useState(false);
  // cập nhật
  const [editFormVisible, setEditFormVisible] = useState(false);
  // load lại form
  const [refresh, setRefresh] = React.useState(0);
  // hình ảnh
  const [file, setFile] = useState<any>(null);
  // hình ảnh chi tiết
  const [isPreview, setIsPreview] = useState(false);
  // form
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const columns = [
    {
      title: "Tên Nhà Cung Cấp",
      dataIndex: "name",
      key: "name",
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
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    // delete, update
    {
      title: "Actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        return (
          <Space>
            {/* delete */}
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .patch("/suppliers/" + id, { isDelete: true })
                  .then((response: any) => {
                    message.success("Xóa thành công và thêm vào danh sách rác");
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
          </Space>
        );
      },
    },
  ];
  const columnDelete = [
    {
      title: "Tên Nhà Cung Cấp",
      dataIndex: "name",
      key: "name",
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
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
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
              title="Bạn chắc chắn muốn xóa vĩnh viễn?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/suppliers/" + id)
                  .then((response: any) => {
                    message.success("Xóa thành công");
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
            {/* Restore */}
            <Button
              onClick={() => {
                const id = record._id;
                console.log("id", id);
                axiosClient
                  .patch("/suppliers/" + id, { isDelete: false })
                  .then((response) => {
                    message.success("Khôi phục");
                    setRefresh((pre) => pre + 1);
                    setEditFormDelete(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    message.error("Khôi phục");
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
    axiosClient.get("/suppliers").then((response) => {
      let array: any = [];
      response.data.map((supp: any) => {
        if (supp.isDelete === false) array.push(supp);
      });
      setSuppliers(array);
    });
  }, [refresh]);
  useEffect(() => {
    axiosClient.get("/suppliers").then((response) => {
      let array: any = [];
      response.data.map((supp: any) => {
        if (supp.isDelete === true) array.push(supp);
      });
      setIsDelete(array);
    });
  }, [refresh]);
  const onFinish = (values: any) => {
    axiosClient
      .post("/suppliers", values)
      .then((response) => {
        message.success("Thêm thành công");
        createForm.resetFields(); //reset input form
        setRefresh((pre) => pre + 1);
      })
      .catch((err) => {
        message.error("Thêm thất bại!");
      });
    console.log("👌👌👌", values);
  };
  const onFinishFailed = (errors: any) => {
    console.log("💣💣💣 ", errors);
  };
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/suppliers/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công");
        updateForm.resetFields();
        setRefresh((pre) => pre + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
      });
  };

  const onUpdateFinishFailed = (errors: any) => {
    console.log("🐣", errors);
  };
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
  return (
    <>
      <div className="text-blue-700 font-bold text-[25px] text-center mb-10">
        NHÀ CUNG CẤP
      </div>
      <div className="flex mb-4">
        <p className="flex-auto font-bold">Danh sách nhà cung cấp</p>
        <div className="total-categories font-bold">
          <span className="text-black">Tổng: </span>
          <span className="text-red-600">{suppliers.length} nhà cung cấp</span>
        </div>
      </div>
      <div>
        <Modal
          centered
          open={createFormVisible}
          title="Thêm mới nhà cung cấp"
          onOk={() => {
            createForm.submit();
            //setCreateFormVisible(false);
          }}
          onCancel={() => {
            setCreateFormVisible(false);
          }}
          okText={<p className="text-black">Thêm</p>}
          cancelText="Thóat"
        >
          <Form
            form={createForm}
            name="create-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
          >
            {/* Name */}
            <Form.Item
              hasFeedback
              className=""
              label="Tên nhà cung cấp"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Tên nhà cung cấp không để trống",
                },
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
                { required: true, message: "Email không để trống" },
                { type: "email", message: "Email không đúng đinh dạng" },
              ]}
            >
              <Input />
            </Form.Item>
            {/* Phone */}
            <Form.Item
              hasFeedback
              className=""
              label="SĐT"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không để trống",
                },
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
              rules={[{ required: true, message: "Địa chỉ không để trống" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        <Table rowKey="_id" dataSource={suppliers} columns={columns} />

        {/* update form */}
        <Modal
          centered
          open={editFormVisible}
          title="Cập nhật nhà cung cấp"
          onOk={() => {
            updateForm.submit();
          }}
          onCancel={() => {
            setEditFormVisible(false);
          }}
          okText={<p className="text-black">Lưu</p>}
          cancelText="Thoát"
        >
          <Form
            form={updateForm}
            name="update-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onUpdateFinish}
            onFinishFailed={onUpdateFinishFailed}
            autoComplete="on"
          >
            {/* Name */}
            <Form.Item
              hasFeedback
              className=""
              label="Tên nhà cung cấp"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Nhà cung cấp không để trống",
                },
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
                { required: true, message: "Email không để trống" },
                { type: "email", message: "Email không đúng định dạng" },
              ]}
            >
              <Input />
            </Form.Item>
            {/* Phone */}
            <Form.Item
              hasFeedback
              className=""
              label="SĐT"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không để trống",
                },
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
              rules={[{ required: true, message: "Địa chỉ không để trống" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          centered
          title="Danh mục rác"
          open={editFormDelete}
          onCancel={() => {
            setEditFormDelete(false);
          }}
          okText={<p className="text-black">Lưu</p>}
          cancelText="Thoát"
          className="ant-modal"
        >
          <Table rowKey={"_id"} dataSource={isDelete} columns={columnDelete} />
        </Modal>
      </div>
      <div className="flex mt-5">
        <Button
          className="bg-blue-500 font-bold mr-6"
          onClick={() => {
            setCreateFormVisible(true);
          }}
        >
          <p className="text-white">Thêm nhà cung cấp</p>
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

export default Suppliers;
