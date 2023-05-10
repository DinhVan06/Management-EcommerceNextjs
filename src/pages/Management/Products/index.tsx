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
      title: "Hình ảnh chi tiết",
      dataIndex: "images",
      key: "images",
      render: (text: any, record: any) => {
        return (
          <div>
            <div style={{ marginRight: "10px", display: "inline-block" }}>
              {record &&
                record.images &&
                record.images.map((image: any) => {
                  return (
                    <img
                      style={{ width: "60px" }}
                      key={image}
                      src={`${API_URL}${image}`}
                      alt=""
                    />
                  );
                })}
            </div>
            <div style={{ display: "inline-block" }}>
              <Upload
                showUploadList={false}
                name="file"
                action={API_URL + "/upload/products/" + record._id + "/images"}
                headers={{ authorization: "authorization-text" }}
                onChange={(info) => {
                  if (info.file.status !== "uploading") {
                    console.log(info.file, info.fileList);
                  }

                  if (info.file.status === "done") {
                    message.success("thêm file thành công");
                    setRefresh((pre) => pre + 1);
                  } else if (info.file.status === "error") {
                    message.error("thêm file thất bại");
                  }
                }}
              >
                <Button icon={<UploadOutlined />} />
              </Upload>
            </div>
          </div>
        );
      },
    },
    {
      title: "Loại danh mục",
      dataIndex: "categoryType",
      key: "categoryType",
      render: (text: any, record: any) => {
        return <strong>{record?.category?.categoryType}</strong>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "15%",
      render: (text: any) => {
        return <strong>{text}</strong>;
      },
    },

    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0.0")} %</span>;
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0")} </span>;
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      render: (text: any) => {
        return <span>{text}</span>;
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
              title="Bạn có chắc muốn xóa?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .patch("/products/" + id, { isDelete: true })
                  .then((response: any) => {
                    message.success("Xóa thành công và thêm vào danh mục rác");
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
  const columnsDelete = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "15%",
      render: (text: any) => {
        return <strong>{text}</strong>;
      },
    },

    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0.0 $")}</span>;
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0.0")} %</span>;
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (text: any) => {
        return <span>{numeral(text).format("0,0.0")} Kg</span>;
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
              title="Bạn có chắc muốn xóa vĩnh viễn không?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/products/" + id)
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
                  .patch("/products/" + id, { isDelete: false })
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
          message.success("Thêm thành công❤");
          // reset dữ liệu đã nhập ở form nhập
          createForm.resetFields();

          // load lại form
          setRefresh((pre) => pre + 1);
          setCreateFormVisible(false);
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
      .patch("/products/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công❤");
        updateForm.resetFields();
        // load lại form
        setRefresh((pre) => pre + 1);
        // đóng
        setEditFormVisible(false);
      })
      .catch((err: any) => {
        message.error("Cập nhật thất bại😥");
      });
    //console.log("❤", values);
  };
  const onUpdateFinishFailed = (errors: any) => {
    //console.log("💣", errors);
  };
  return (
    <>
      <div className="text-blue-700 font-bold text-[25px] text-center mb-10">
        SẢN PHẨM
      </div>
      <div className="flex mb-4">
        <p className="flex-auto font-bold">Danh sách sản phẩm</p>
        <div className="total-categories font-bold">
          <span className="text-black">Tổng: </span>
          <span className="text-red-600">{products.length} sản phẩm</span>
        </div>
      </div>
      <div>
        <Modal
          centered
          open={createFormVisible}
          title="Thêm sản phẩm"
          onOk={() => {
            createForm.submit();
            //setCreateFormVisible(false);
          }}
          onCancel={() => {
            setCreateFormVisible(false);
          }}
          okText={<p className="text-black">Thêm</p>}
          cancelText="Thoát"
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
            {/* Danh mục sản phẩm */}
            <Form.Item
              label="Loại Danh mục"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Danh mục không để trống",
                },
              ]}
            >
              <Select
                options={
                  categories &&
                  categories.map((category: any) => {
                    return {
                      value: category._id,
                      label: category.categoryType,
                    };
                  })
                }
              />
            </Form.Item>

            {/* Tên sản phẩm */}
            <Form.Item
              hasFeedback
              label="Tên sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Tên sản phẩm  không để trống",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Giá tiền */}
            <Form.Item
              hasFeedback
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Giá không để trống" },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(new Error("Giá phải lớn hơn 0"));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" addonAfter="$" />
            </Form.Item>

            {/* Giảm giá */}
            <Form.Item
              hasFeedback
              className=""
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Giảm giá phải lớn hơn hoặc bằng 0")
                      );
                    } else if (value > 100) {
                      return Promise.reject(
                        new Error("Giảm giá phải nhỏ hơn hoặc bằng 100")
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
              label="Tồn kho"
              name="stock"
              rules={[
                { required: true, message: "Tồn kho không để trống" },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Tồn kho lớn hơn bằng 0")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" />
            </Form.Item>

            {/* Đơn vị tính */}
            <Form.Item
              hasFeedback
              className=""
              label="Đơn vị"
              name="unit"
              rules={[{ required: true, message: "Đơn vị không để trống" }]}
            >
              <Input placeholder={`"1kg" hoặc "1 lon" hoặc "1 cây"`} />
            </Form.Item>
            {/* Nhà cung cấp */}
            <Form.Item
              label="Nhà cung cấp"
              name="supplierId"
              rules={[
                {
                  required: true,
                  message: "Nhà cung cấp không để trống",
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
            <Form.Item hasFeedback label="Mô tả" name="description">
              <TextArea rows={5} />
            </Form.Item>
          </Form>
        </Modal>

        <Table rowKey="_id" dataSource={products} columns={columns} />

        {/* update form */}
        <Modal
          centered
          open={editFormVisible}
          title="Cập nhật sản phẩm"
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
            {/* hình ảnh */}
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
            {/* Danh mục sản phẩm */}
            <Form.Item
              label="Loại Danh mục"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Danh mục không để trống",
                },
              ]}
            >
              <Select
                options={
                  categories &&
                  categories.map((category: any) => {
                    return {
                      value: category._id,
                      label: category.categoryType,
                    };
                  })
                }
              />
            </Form.Item>

            {/* Tên sản phẩm */}
            <Form.Item
              hasFeedback
              className=""
              label="Tên sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Tên sản phẩm không để trống",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Giá tiền */}
            <Form.Item
              hasFeedback
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Giá không để trống" },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Giá lớn hơn hoặc bằng 0")
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
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Giảm giá lớn hơn hoặc bằng 0")
                      );
                    } else if (value > 100) {
                      return Promise.reject(
                        new Error("Giảm giá nhỏ hơn hoặc bằng 100")
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
              label="Tồn kho"
              name="stock"
              rules={[
                { required: true, message: "Tồn kho không để trống" },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Tồn kho lớn hơn hoặc bằng 0")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber className="w-[50%]" />
            </Form.Item>
            {/* Đơn vị tính */}
            <Form.Item
              hasFeedback
              className=""
              label="Đơn vị"
              name="unit"
              rules={[{ required: true, message: "Đơn vị không để trống" }]}
            >
              <Input placeholder={`"1kg" hoặc "1 lon" hoặc "1 cây"`} />
            </Form.Item>
            {/* Nhà cung cấp */}
            <Form.Item
              label="Nhà cung cấp"
              name="supplierId"
              rules={[
                {
                  required: true,
                  message: "Nhà cung cấp không để trống",
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
            <Form.Item hasFeedback label="Mô tả" name="description">
              <TextArea rows={5} />
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
      <div className="flex mb-5">
        <Button
          className="bg-blue-500 font-bold mr-6"
          onClick={() => {
            setCreateFormVisible(true);
            console.log("ok");
          }}
        >
          <p className="text-white">Thêm sản phẩm</p>
        </Button>
        <Button
          danger
          className="text-right flex items-center"
          onClick={() => {
            setEditFormDelete(true);
          }}
        >
          Thùng rác
          <AiFillDelete size={"20px"} />
        </Button>
      </div>
    </>
  );
}

export default Products;
