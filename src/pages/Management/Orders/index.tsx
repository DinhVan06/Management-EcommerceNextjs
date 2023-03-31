import React from "react";
import numeral from "numeral";
import moment from "moment";
import {
  Table,
  Button,
  Card,
  Modal,
  Descriptions,
  Divider,
  Form,
  message,
  Input,
  Select,
  Space,
  Popconfirm,
  DatePicker,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { axiosClient } from "../../../libraries/axiosClient";

export default function Orders() {
  const [editFormVisible, setEditFormVisible] = React.useState<any>(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);
  const [addProductsModalVisible, setAddProductsModalVisible] =
    React.useState<any>(false);
  const [employees, setEmployees] = React.useState<any>([]);
  const [customers, setCustomers] = React.useState<any>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [refresh, setRefresh] = React.useState<number>(0);
  const [createFormVisible, setCreateFormVisible] = React.useState<any>(false);
  const [loading, setLoading] = React.useState<any>(false);
  // Products
  const [products, setProducts] = React.useState<any>([]);

  const [orders, setOrders] = React.useState<any>([]);

  // create form
  const [createForm] = Form.useForm();
  // update form
  const [updateForm] = Form.useForm();
  // search form
  const [searchForm] = Form.useForm();
  React.useEffect(() => {
    axiosClient.get("/products").then((response) => {
      setProducts(response.data);
    });
  }, [refresh]);
  React.useEffect(() => {
    axiosClient.get("/employees").then((response) => {
      setEmployees(response.data);
    });
  }, [refresh]);
  React.useEffect(() => {
    axiosClient.get("/customers").then((response) => {
      setCustomers(response.data);
    });
  }, [refresh]);

  React.useEffect(() => {
    if (selectedOrder) {
      axiosClient.get("orders/" + selectedOrder._id).then((response) => {
        setSelectedOrder(response.data);
      });
    }
    axiosClient.get("/orders").then((response) => {
      setOrders(response.data);
    });
  }, [refresh]);

  const productColumns = [
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product.name",
      key: "product.name",
      render: (text: any, record: any) => {
        return <strong>{record?.product?.name}</strong>;
      },
    },
    {
      title: "Giá",
      dataIndex: "product.price",
      key: "product.price",
      render: (text: any, record: any) => {
        return (
          <div style={{ textAlign: "right" }}>
            {numeral(
              record?.product?.discount
                ? record?.product?.total
                : record?.product?.price
            ).format("0,0$")}
          </div>
        );
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "product.discount",
      key: "product.discount",
      render: (text: any, record: any) => {
        return (
          <div style={{ textAlign: "right" }}>
            {numeral(record?.product?.discount).format("0,0")}%
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => {
        return (
          <Button
            onClick={async () => {
              setRefresh((pre) => pre + 1);
              const currentProduct = record;
              const response = await axiosClient.get(
                "orders/" + selectedOrder._id
              );
              const currentOrder = response.data;
              const { orderDetails } = currentOrder;
              const remainOrderDetails = orderDetails.filter((x: any) => {
                return (
                  x.productId.toString() !== currentProduct.productId.toString()
                );
              });
              await axiosClient.patch("orders/" + selectedOrder._id, {
                orderDetails: remainOrderDetails,
              });

              setAddProductsModalVisible(false);
              message.success("Xóa thành công");
              setRefresh((pre) => pre + 1);
            }}
          >
            Xóa
          </Button>
        );
      },
    },
  ];

  // Orders
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: any) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: any) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: any) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Nhân viên",
      dataIndex: "employee",
      key: "employee",
      render: (text: any, record: any) => {
        return <strong>{record.employee?.fullName}</strong>;
      },
    },
    {
      title: "Ngày tạo hóa đơn",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text: any) => {
        return <p>{moment(text).format("DD/MM/yyyy")}</p>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (text: any, record: any) => {
        const { orderDetails } = record;

        let total = 0;
        orderDetails.forEach((od: any) => {
          let sum = od.quantity * od.product.total;
          total = total + sum;
        });

        return <strong>{numeral(total).format("0,0$")}</strong>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => {
        return (
          <Button
            onClick={() => {
              setSelectedOrder(record);
            }}
          >
            Xem
          </Button>
        );
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
            {/* Update */}
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                console.log("selectes", record);
                updateForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            />
            {/* delete */}
            <Popconfirm
              title="Bạn có muốn hủy đơn hàng không?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/orders/" + id)
                  .then((response) => {
                    message.success("Hủy đơn hàng thành công!");
                    setRefresh((pre) => pre + 1);
                  })
                  .catch((err) => {
                    message.error("Hủy đơn hàng thất bại!");
                  });
                console.log("delete", record);
              }}
              onCancel={() => {}}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // tạo mới form
  const onFinish = (values: any) => {
    axiosClient
      .post("/orders", values)
      .then((response) => {
        message.success("Thêm Hóa Đơn thành công!");
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error("Thêm Hóa Đơn thất bại!");
      });
    console.log("👌👌👌", values);
  };
  const onFinishFailed = (errors: any) => {
    console.log("💣💣💣 ", errors);
  };

  // update form
  // xử lý cập nhật thông tin
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/orders/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công ❤");
        updateForm.resetFields();
        // load lại form
        setRefresh((pre) => pre + 1);
        // đóng
        setEditFormVisible(false);
        console.log();
      })
      .catch((err) => {
        message.error("Cập nhật thất bại 😥");
      });
    console.log("❤", values);
  };
  const onUpdateFinishFailed = (errors: any) => {
    console.log("💣", errors);
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

  // validate ngày hóa đơn
  const dateOfValidator = (rule: any, value: any, callback: any) => {
    const dateFormat = "YYYY/MM/DD"; // Định dạng ngày tháng
    const currentDate = moment(); // Lấy ngày hiện tại
    const dateOfCreatedDate = moment(value, dateFormat); // Chuyển đổi giá trị nhập vào thành kiểu moment

    // Kiểm tra tính hợp lệ của ngày sinh
    if (currentDate.diff(dateOfCreatedDate, "days") < 0) {
      callback("Ngày hóa đơn phải nhỏ hơn ngày hiện tại");
    } else {
      callback();
    }
  };
  return (
    <>
      <div className="text-blue-700 font-bold text-[25px] text-center mb-10">
        Orders
      </div>
      <div>
        <div className="flex mb-5">
          <Button
            className="bg-blue-500 text-white font-bold mr-6"
            onClick={() => {
              setCreateFormVisible(true);
              console.log("ok");
            }}
          >
            Thêm mới đơn hàng
          </Button>
          {/* <Button
            danger
            className="text-right flex items-center"
            onClick={() => {
              setEditFormDelete(true);
            }}
          >
            Recycle bin <AiFillDelete size={"20px"} />
          </Button> */}
        </div>
        {/* Modal thêm mới sản phẩm */}

        <Modal
          centered
          open={createFormVisible}
          title="Thêm mới thông tin đơn hàng"
          onOk={() => {
            createForm.submit();
            //setCreateFormVisible(false);
          }}
          onCancel={() => {
            setCreateFormVisible(false);
          }}
          okText="Lưu"
          cancelText="Đóng"
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
            <div className="w-[100%]">
              {/* Created Date */}
              <Form.Item
                hasFeedback
                className=""
                label="Ngày tạo"
                name="createdDate"
                rules={[
                  { required: true, message: "Không thể để trống" },
                  {
                    validator: dateOfValidator,
                  },
                  { type: "date", message: "Ngày không hợp lệ" },
                ]}
              >
                <DatePicker format="YYYY/MM/DD" />
              </Form.Item>

              {/* Shipped Date */}
              <Form.Item
                hasFeedback
                className=""
                label="Ngày giao"
                name="shippedDate"
                rules={[
                  { required: true, message: "Không thể để trống" },
                  {
                    validator: dateOfValidator,
                  },
                  { type: "date", message: "Ngày không hợp lệ" },
                ]}
              >
                <DatePicker format="YYYY/MM/DD" />
              </Form.Item>

              {/* Status */}
              <Form.Item
                hasFeedback
                className=""
                label="Trạng thái đơn hàng"
                name="status"
                rules={[
                  { required: true, message: "Không thể để trống" },
                  {
                    validator: (_, value) => {
                      if (
                        [
                          "WAITING CONFIRMATION ORDER",
                          "CONFIRMED ORDER",
                          "SHIPPING CONFIRMATION",
                          "DELIVERY IN PROGRESS",
                          "DELIVERY SUCCESS",
                          "RECEIVED ORDER",
                          "CANCELED ORDER",
                        ].includes(value)
                      ) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Trạng thái không hợp lệ!");
                      }
                    },
                  },
                ]}
              >
                <Select
                  options={[
                    {
                      value: "WAITING CONFIRMATION ORDER",
                      label: "Đang Chờ Xác Nhận",
                    },
                    {
                      value: "CONFIRMED ORDER",
                      label: "Đã xác nhận đặt hàng",
                    },
                  ]}
                />
              </Form.Item>

              {/* Description */}
              <Form.Item
                hasFeedback
                className=""
                label="Mô tả"
                name="description"
              >
                <Input />
              </Form.Item>

              {/* Shipping Address */}
              <Form.Item
                hasFeedback
                className=""
                label="Địa chỉ giao hàng"
                name="shippingAddress"
                rules={[{ required: true, message: "Không thể để trống" }]}
              >
                <Input />
              </Form.Item>

              {/* Payment Type */}
              <Form.Item
                hasFeedback
                className=""
                label="Hình thức thanh toán"
                name="paymentType"
                rules={[{ required: true, message: "Không thể để trống" }]}
              >
                <Select
                  options={[
                    {
                      value: "MOMO",
                      label: "MOMO",
                    },
                    {
                      value: "CASH",
                      label: "Thanh Toán Bằng Tiền Mặt",
                    },
                  ]}
                />
              </Form.Item>

              {/* Customer */}
              <Form.Item
                className=""
                label="Khách hàng"
                name="fullName"
                rules={[{ required: true, message: "Không thể để trống" }]}
              >
                <Input />
              </Form.Item>
              {/* PhoneNumber */}
              <Form.Item
                className=""
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống!",
                  },
                  { min: 10, message: "Số điện thoại không quá 10 chữ số!" },
                  { max: 10, message: "Số điện thoại không quá 10 chữ số!" },
                  {
                    validator: phoneValidator,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {/* Employee */}
              <Form.Item
                className=""
                label="Nhân viên"
                name="employeeId"
                rules={[{ required: true, message: "Không thể để trống" }]}
              >
                <Select
                  options={
                    employees &&
                    employees.map((suplier: any) => {
                      return {
                        value: suplier._id,
                        label: suplier.fullName,
                      };
                    })
                  }
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>

        <Modal
          centered
          title="Chi tiết đơn hàng"
          open={selectedOrder}
          onCancel={() => {
            setSelectedOrder(null);
          }}
        >
          {selectedOrder && (
            <div>
              <Descriptions
                bordered
                column={1}
                labelStyle={{ fontWeight: "700" }}
              >
                <Descriptions.Item label="Trạng thái">
                  {selectedOrder.status}
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {selectedOrder.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedOrder.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo hóa đơn">
                  {selectedOrder.createdDate}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày giao">
                  {selectedOrder.shippedDate}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ giao hàng">
                  {selectedOrder.shippingAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Nhân viên">
                  {selectedOrder.employee?.fullName}
                </Descriptions.Item>
              </Descriptions>
              <Divider />
              <Table
                rowKey="_id"
                dataSource={selectedOrder.orderDetails}
                columns={productColumns}
              />

              <Button
                onClick={() => {
                  setAddProductsModalVisible(true);
                  setRefresh((pre) => pre + 1);
                }}
              >
                Thêm sản phẩm
              </Button>

              <Modal
                centered
                title="Danh sách sản phẩm"
                open={addProductsModalVisible}
                onCancel={() => {
                  setAddProductsModalVisible(false);
                }}
                onOk={() => {
                  setRefresh((pre) => pre + 1);
                }}
              >
                {products &&
                  products.map((product: any) => {
                    return (
                      <Card key={product?._id}>
                        <strong>{product?.name}</strong>
                        <Button
                          onClick={async () => {
                            const response = await axiosClient.get(
                              "orders/" + selectedOrder._id
                            );
                            const currentOrder = response.data;
                            const { orderDetails } = currentOrder;
                            const found = orderDetails.find(
                              (x: any) => x.productId === product._id
                            );
                            if (found) {
                              found.quantity++;
                            } else {
                              orderDetails.push({
                                productId: product._id,
                                quantity: 1,
                              });
                            }

                            await axiosClient.patch(
                              "orders/" + selectedOrder._id,
                              {
                                orderDetails,
                              }
                            );

                            setAddProductsModalVisible(false);
                            // RELOAD //

                            setRefresh((pre) => pre + 1);
                          }}
                        >
                          Add
                        </Button>
                      </Card>
                    );
                  })}
              </Modal>
            </div>
          )}
        </Modal>

        {/* update form */}
        <Modal
          centered
          open={editFormVisible}
          title="Cập nhật thông tin"
          onOk={() => {
            updateForm.submit();
          }}
          onCancel={() => {
            setEditFormVisible(false);
          }}
          okText="Lưu thông tin"
          cancelText="Đóng"
        >
          <Form
            form={updateForm}
            name="update-form"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onUpdateFinish}
            onFinishFailed={onUpdateFinishFailed}
            autoComplete="off"
          >
            <div className="w-[80%]">
              {/* Created Date */}
              <Form.Item
                hasFeedback
                className=""
                label="Ngày tạo"
                name="createdDate"
                rules={[
                  { required: true, message: "Không thể để trống" },
                  {
                    validator: dateOfValidator,
                  },
                  { type: "date", message: "Ngày không hợp lệ" },
                ]}
              >
                <Input />
              </Form.Item>

              {/* Shipped Date */}
              <Form.Item
                hasFeedback
                className=""
                label="Ngày giao"
                name="shippedDate"
                rules={[
                  { required: true, message: "Không thể để trống" },
                  {
                    validator: dateOfValidator,
                  },
                  { type: "date", message: "Ngày không hợp lệ" },
                ]}
              >
                <Input value={Date.now()} />
              </Form.Item>

              {/* Status */}
              <Form.Item
                hasFeedback
                className=""
                label="Trạng thái đơn hàng"
                name="status"
                rules={[
                  { required: true, message: "Không thể để trống" },
                  {
                    validator: (_, value) => {
                      if (
                        [
                          "WAITING CONFIRMATION ORDER",
                          "CONFIRMED ORDER",
                          "SHIPPING CONFIRMATION",
                          "DELIVERY IN PROGRESS",
                          "DELIVERY SUCCESS",
                          "RECEIVED ORDER",
                          "CANCELED ORDER",
                        ].includes(value)
                      ) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Trạng thái không hợp lệ!");
                      }
                    },
                  },
                ]}
              >
                <Select
                  options={[
                    {
                      value: "WAITING CONFIRMATION ORDER",
                      label: "Đang Chờ Xác Nhận",
                    },
                    {
                      value: "CONFIRMED ORDER",
                      label: "Đã Xác Nhận Đơn Hàng",
                    },
                  ]}
                />
              </Form.Item>

              {/* Description */}
              <Form.Item
                hasFeedback
                className=""
                label="Mô tả"
                name="description"
              >
                <Input />
              </Form.Item>

              {/* Shipping Address */}
              <Form.Item
                hasFeedback
                className=""
                label="Địa chỉ giao hàng"
                name="shippingAddress"
                rules={[{ required: true, message: "Không thể để trống" }]}
              >
                <Input />
              </Form.Item>

              {/* Payment Type */}
              <Form.Item
                hasFeedback
                className=""
                label="Hình thức thanh toán"
                name="paymentType"
                rules={[{ required: true, message: "Không thể để trống" }]}
              >
                <Select
                  options={[
                    {
                      value: "MOMO",
                      label: "MOMO",
                    },
                    {
                      value: "CASH",
                      label: "Thanh Toán Bằng Tiền Mặt",
                    },
                  ]}
                />
              </Form.Item>

              {/* Customer */}
              <Form.Item
                className=""
                label="Khách hàng"
                name="fullName"
                rules={[{ required: true, message: "Không thể để trống" }]}
              >
                <Input />
              </Form.Item>
              {/* PhoneNumber */}
              <Form.Item
                className=""
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Không thể để trống" },
                  {
                    validator: phoneValidator,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {/* Employee */}
              <Form.Item
                className=""
                label="Nhân viên"
                name="employeeId"
                rules={[{ required: true, message: "Không thể để trống" }]}
              >
                <Select
                  options={
                    employees &&
                    employees.map((employee: any) => {
                      return {
                        value: employee._id,
                        label: employee.fullName,
                      };
                    })
                  }
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>

        <Table rowKey="_id" dataSource={orders} columns={columns} />
      </div>
    </>
  );
}
