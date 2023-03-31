import React, { useEffect, useState } from "react";
import { Modal, Space, Table, Upload, Select, InputNumber } from "antd";
import { Image, Button, Form, Input, message, Popconfirm } from "antd";
import TextArea from "antd/lib/input/TextArea";
import "../../index.css";
import { axiosClient } from "../../../libraries/axiosClient.js";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AiFillDelete } from "react-icons/ai";
import { FaTrashRestore } from "react-icons/fa";
import { API_URL } from "../../../constants/URLS.js";
import axios from "axios";
import numeral from "numeral";
function Products() {
  // products
  const [products, setProducts] = useState<any>([]);
  // categories
  const [categories, setCategories] = useState<any>([]);
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

  // table view
  const columns = [
    {
      title: "Image",
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
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: any, record: any) => {
        return <strong>{record?.category?.name}</strong>;
      },
    },
    {
      title: "Products name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      render: (text: any) => {
        return <strong>{text}</strong>;
      },
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0.0")}%</span>;
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0.0")}</span>;
      },
    },
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
              action={API_URL + "/upload/products/" + record._id}
              headers={{ authorization: "authorization-text" }}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  //console.log(info.file, info.fileList);
                }

                if (info.file.status === "done") {
                  message.success(`${info.file.name} Add file successfully`);
                  setRefresh((pre) => pre + 1);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} Add file failed`);
                }
              }}
            >
              <Button icon={<UploadOutlined />} />
            </Upload>
            {/* delete */}
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .patch("/products/" + id, { isDelete: true })
                  .then((response: any) => {
                    message.success(
                      "Deleted items have been stored in garbage category"
                    );
                    setRefresh((pre) => pre + 1);
                  })
                  .catch((err: any) => {
                    message.error("Delete failed");
                  });
                //console.log("delete", record);
              }}
              onCancel={() => {}}
              okText={<p className="text-black">yes</p>}
              cancelText="No"
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
  const columnsDelete = [
    {
      title: "Products name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      render: (text: any) => {
        return <strong>{text}</strong>;
      },
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0$")}</span>;
      },
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0.0")}%</span>;
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0.0")}</span>;
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
              title="Are you sure you want to delete it permanently?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/products/" + id)
                  .then((response: any) => {
                    message.success("Delete successfully");
                    setRefresh((pre) => pre + 1);
                  })
                  .catch((err: any) => {
                    message.error("Delete failed");
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
                  .patch("/products/" + id, { isDelete: false })
                  .then((response) => {
                    message.success("Restore successfully");
                    setRefresh((pre) => pre + 1);
                    setEditFormDelete(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    message.error("Restore failed");
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
  useEffect(() => {
    axiosClient
      .get("/products")
      .then((response) => {
        let array: any[] = [];
        // console.log(response.data);
        response.data.map((prod: any) => {
          if (prod.isDelete === false) {
            array.push(prod);
          }
        });
        console.log(response.data);
        setProducts(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  useEffect(() => {
    axiosClient
      .get("/products")
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

  // get list categories
  useEffect(() => {
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  // get list suppliers
  useEffect(() => {
    axiosClient.get("/suppliers").then((response) => {
      setSuppliers(response.data);
    });
  }, []);

  // xử lý thêm mới
  const onFinish = (values: any) => {
    axiosClient.post("/products", values).then((response) => {
      const { _id } = response.data;
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(API_URL + "/upload/products/" + _id, formData)
        .then((respose) => {
          //console.log(respose.data);
          message.success("Add success❤");
          // reset dữ liệu đã nhập ở form nhập
          createForm.resetFields();

          // load lại form
          setRefresh((pre) => pre + 1);
        })
        .catch((err) => {
          console.log(err);
          message.error("Add failed😥");
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
      .patch("/products/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Update success ❤");
        updateForm.resetFields();
        // load lại form
        setRefresh((pre) => pre + 1);
        // đóng
        setEditFormVisible(false);
      })
      .catch((err: any) => {
        message.error("Update failed😥");
      });
    //console.log("❤", values);
  };
  const onUpdateFinishFailed = (errors: any) => {
    //console.log("💣", errors);
  };
  return (
    <>
      <div className="text-blue-700 font-bold text-[25px] text-center mb-10">
        Products
      </div>
      <div>
        <div className="flex mb-5">
          <Button
            className="bg-blue-500 font-bold mr-6"
            onClick={() => {
              setCreateFormVisible(true);
              console.log("ok");
            }}
          >
            <p className="text-white">Add new products</p>
          </Button>
          <Button
            danger
            className="text-right flex items-center"
            onClick={() => {
              setEditFormDelete(true);
            }}
          >
            Recycle bin <AiFillDelete size={"20px"} />
          </Button>
        </div>

        <Modal
          centered
          open={createFormVisible}
          title="Add new Category"
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
            autoComplete="on"
          >
            {/* hình ảnh */}
            <Form.Item label="Image" name="file">
              <Upload
                showUploadList={true}
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Please choose image</Button>
              </Upload>
            </Form.Item>
            {/* Danh mục sản phẩm */}
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Can not be empty 'category'",
                },
              ]}
            >
              <Select
                options={
                  categories &&
                  categories.map((category: any) => {
                    return {
                      value: category._id,
                      label: category.name,
                    };
                  })
                }
              />
            </Form.Item>

            {/* Tên sản phẩm */}
            <Form.Item
              hasFeedback
              label="Products Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Can not be empty 'products name'",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Giá tiền */}
            <Form.Item
              hasFeedback
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Can not be empty 'price'" },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Price must be greater than 0")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" addonAfter="VND" />
            </Form.Item>

            {/* Giảm giá */}
            <Form.Item
              hasFeedback
              className=""
              label="Discount"
              name="discount"
              rules={[
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Discount must be greater than 0")
                      );
                    } else if (value > 100) {
                      return Promise.reject(
                        new Error("Discount must be less than 100")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" addonAfter="%" />
            </Form.Item>

            {/* Tồn kho */}
            <Form.Item
              hasFeedback
              className=""
              label="Stock"
              name="stock"
              rules={[
                { required: true, message: "Can not be empty 'stock'" },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Stock must be greater than 0")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" />
            </Form.Item>
            {/* Nhà cung cấp */}
            <Form.Item
              label="Suppliers"
              name="supplierId"
              rules={[
                {
                  required: true,
                  message: "Can not be empty 'suppliers'",
                },
              ]}
            >
              <Select
                options={
                  suppliers &&
                  suppliers.map((suplier: any) => {
                    return {
                      value: suplier._id,
                      label: suplier.name,
                    };
                  })
                }
              />
            </Form.Item>

            {/* Mô tả */}
            <Form.Item hasFeedback label="Description" name="description">
              <TextArea rows={5} />
            </Form.Item>
          </Form>
        </Modal>

        <Table rowKey="_id" dataSource={products} columns={columns} />

        {/* update form */}
        <Modal
          centered
          open={editFormVisible}
          title="Update Category"
          onOk={() => {
            updateForm.submit();
          }}
          onCancel={() => {
            setEditFormVisible(false);
          }}
          okText={<p className="text-black">Save</p>}
          cancelText="Close"
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
            {/* hình ảnh */}
            <Form.Item label="Image" name="file">
              <Upload
                showUploadList={true}
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Please choose image</Button>
              </Upload>
            </Form.Item>
            {/* Danh mục sản phẩm */}
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Can not be empty 'category'",
                },
              ]}
            >
              <Select
                options={
                  categories &&
                  categories.map((category: any) => {
                    return {
                      value: category._id,
                      label: category.name,
                    };
                  })
                }
              />
            </Form.Item>

            {/* Tên sản phẩm */}
            <Form.Item
              hasFeedback
              className=""
              label="Products Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Can not be empty 'products name'",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Giá tiền */}
            <Form.Item
              hasFeedback
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Can not be empty 'price'" },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Price must be greater than 0")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" addonAfter="VND" />
            </Form.Item>

            {/* Giảm giá */}
            <Form.Item
              hasFeedback
              className=""
              label="Discount"
              name="discount"
              rules={[
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Discount must be greater than 0")
                      );
                    } else if (value > 100) {
                      return Promise.reject(
                        new Error("Discount must be less than 100")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" addonAfter="%" />
            </Form.Item>

            {/* Tồn kho */}
            <Form.Item
              hasFeedback
              className=""
              label="Stock"
              name="stock"
              rules={[
                { required: true, message: "Can not be empty 'stock'" },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Stock must be greater than 0")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" />
            </Form.Item>
            {/* Nhà cung cấp */}
            <Form.Item
              label="Suppliers"
              name="supplierId"
              rules={[
                {
                  required: true,
                  message: "Can not be empty 'suppliers'",
                },
              ]}
            >
              <Select
                options={
                  suppliers &&
                  suppliers.map((suplier: any) => {
                    return {
                      value: suplier._id,
                      label: suplier.name,
                    };
                  })
                }
              />
            </Form.Item>

            {/* Mô tả */}
            <Form.Item hasFeedback label="Description" name="description">
              <TextArea rows={5} />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          centered
          title="Garbage List"
          open={editFormDelete}
          onCancel={() => {
            setEditFormDelete(false);
          }}
          okText={<p className="text-black">Save</p>}
          cancelText="Exit"
          className="ant-modal"
        >
          <Table rowKey={"_id"} dataSource={isDelete} columns={columnsDelete} />
        </Modal>
      </div>
    </>
  );
}

export default Products;
