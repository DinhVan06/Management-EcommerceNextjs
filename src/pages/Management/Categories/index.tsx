import React, { useEffect } from "react";
import { Modal, Space, Table, Upload, InputNumber } from "antd";
import { Image, Button, Form, Input, message, Popconfirm } from "antd";
import { axiosClient } from "../../../libraries/axiosClient.js";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "../../index.css";
import { AiFillDelete } from "react-icons/ai";
import { FaTrashRestore } from "react-icons/fa";
import { API_URL } from "../../../constants/URLS.js";
import axios from "axios";
function Category() {
  const [categories, setCategories] = React.useState<any>([]);

  const [isDelete, setIsDelete] = React.useState<any>([]);
  // xem
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);
  // xóa
  const [editFormDelete, setEditFormDelete] = React.useState(false);
  // tạo mới
  const [createFormVisible, setCreateFormVisible] = React.useState(false);
  // sửa
  const [editFormVisible, setEditFormVisible] = React.useState(false);

  // load lại form khi thực hiện hành công nào đó thành công
  const [refresh, setRefresh] = React.useState(0);

  const [file, setFile] = React.useState<any>(null);
  // xem chi tiết hình ảnh
  const [isPreview, setIsPreview] = React.useState(false);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  // table
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
      title: "Loại danh mục",
      dataIndex: "categoryType",
      key: "categoryType",
      render: (text: any) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Số Calo",
      dataIndex: "calories",
      key: "calories",
      render: (text: any) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: any) => {
        return <em>{text}</em>;
      },
    },
    // delete, update
    {
      title: "Actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        return (
          <Space>
            {/* upload hình ảnh */}
            <Upload
              showUploadList={false}
              name="file"
              action={API_URL + "/upload/categories/" + record._id}
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
            {/* delete */}
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa không?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .patch("/categories/" + id, { isDelete: true })
                  .then((response: any) => {
                    message.success(
                      "Đã xóa thành công và lưu vào danh mục rác"
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

  // table delete
  const columnsDelete = [
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
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: any) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
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
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/categories/" + id)
                  .then((response: any) => {
                    message.success("Xóa thành công");
                    setRefresh((pre) => pre + 1);
                    setEditFormDelete(false);
                  })
                  .catch((err: any) => {
                    message.error("Xóa thất bại");
                  });
                //console.log("delete", record);
              }}
              onCancel={() => {}}
              okText={<p className="text-black">yes</p>}
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
            {/* Restore */}
            <Button
              onClick={() => {
                const id = record._id;
                console.log("id", id);
                axiosClient
                  .patch("/categories/" + id, { isDelete: false })
                  .then((response) => {
                    message.success("Khôi phục thành công");
                    setRefresh((f) => f + 1);
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
                Restore
              </div>
            </Button>
          </Space>
        );
      },
    },
  ];
  // get dữ liệu cho categories
  useEffect(() => {
    axiosClient.get("/categories").then((response) => {
      let array: any[] = [];
      const data = response.data;
      data.map((cate: any) => {
        if (cate.isDelete === false) {
          array.push(cate);
        }
      });
      setCategories(array);
      // console.log(response.data);
    });
  }, [refresh]);

  // get dữ liệu cho table delete
  useEffect(() => {
    axiosClient.get("/categories").then((response) => {
      let array: any[] = [];
      const data = response.data;
      data.map((cate: any) => {
        if (cate.isDelete === true) {
          array.push(cate);
        }
      });
      setIsDelete(array);
      // console.log(response.data);
    });
  }, [refresh]);
  // xử lý thêm mới
  const onFinish = (values: any) => {
    axiosClient.post("/categories", values).then((response) => {
      const { _id } = response.data;
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(API_URL + "/upload/categories/" + _id, formData)
        .then((respose) => {
          //console.log(respose.data);
          message.success("Thêm mới thành công ❤");
          // reset dữ liệu đã nhập ở form nhập
          createForm.resetFields();

          // load lại form
          setRefresh((pre) => pre + 1);

          // thoát khỏi form
          setCreateFormVisible(false);
        })
        .catch((err) => {
          console.log(err);
          message.error("Thêm mới thất bại 😥");
        });
    });

    console.log("❤", values);
  };
  const onFinishFailed = (errors: any) => {
    //console.log("💣", errors);
  };
  // xử lý cập nhật thông tin
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/categories/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công ❤");
        updateForm.resetFields();
        // load lại form
        setRefresh((pre) => pre + 1);
        // đóng
        setEditFormVisible(false);
      })
      .catch((err: any) => {
        message.error("Cập nhật thất bại 😥");
      });
    //console.log("❤", values);
  };
  const onUpdateFinishFailed = (errors: any) => {
    //console.log("💣", errors);
  };

  // validate
  const validateNumber = (rule: any, value: any, callback: any) => {
    if (!isNaN(value)) {
      callback();
    } else {
      callback("Hãy nhập số");
    }
  };
  // form nhập liệu
  return (
    <>
      <div className="text-blue-700 font-bold text-[25px] text-center mb-10">
        DANH MỤC
      </div>
      <div className="flex mb-4">
        <p className="flex-auto font-bold">Danh sách danh mục</p>
        <div className="total-categories font-bold">
          <span className="text-black">Tổng: </span>
          <span className="text-red-600">{categories.length} danh mục</span>
        </div>
      </div>
      <div>
        <Modal
          centered
          open={createFormVisible}
          title="Thêm danh mục"
          onOk={() => {
            createForm.submit();
            //setCreateFormVisible(false);
          }}
          onCancel={() => {
            setCreateFormVisible(false);
          }}
          okText={<p className="text-black">Add</p>}
          cancelText="Close"
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
          >
            <Form.Item label="Hình ảnh" name="file">
              <Upload
                showUploadList={true}
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Loại danh mục"
              name="categoryType"
              rules={[
                { required: true, message: "Loại danh mục không thể để trống" },
              ]}
            >
              <Input placeholder="Trái cây" />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Số Calo"
              name="calories"
              rules={[
                { required: true, message: "Số lượng calo không thể để trống" },
              ]}
            >
              <InputNumber className="w-[40%]" addonAfter="Calo" />
            </Form.Item>
            <Form.Item hasFeedback label="Mô tả" name="description">
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        <Table rowKey="_id" dataSource={categories} columns={columns} />

        {/* update form */}
        <Modal
          centered
          open={editFormVisible}
          title="Cập nhật danh mục"
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
            <Form.Item label="Hình ảnh" name="file">
              <Upload
                showUploadList={true}
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Loại danh mục"
              name="categoryType"
              rules={[
                { required: true, message: "Loại danh mục không thể để trống" },
              ]}
            >
              <Input placeholder="Trái cây" />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Số Calo"
              name="calories"
              rules={[
                { required: true, message: "Số lượng calo không thể để trống" },
                { validator: validateNumber },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Số Calo phải lớn hơn 0")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[40%]" addonAfter="Calo" />
            </Form.Item>
            <Form.Item hasFeedback label="Mô tả" name="description">
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
          <Table rowKey={"_id"} dataSource={isDelete} columns={columnsDelete} />
        </Modal>
      </div>
      <div className="flex mt-5 ">
        <Button
          className="bg-blue-500 font-bold mr-6"
          onClick={() => {
            setCreateFormVisible(true);
          }}
        >
          <p className="text-white">Thêm danh mục</p>
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

export default Category;
