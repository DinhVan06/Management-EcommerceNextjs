import {
  DatabaseOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const items = [
  { label: "Trang chủ", key: "home", icon: <HomeOutlined /> }, // remember to pass the key prop
  { label: "Cài đặt", key: "settings", icon: <SettingOutlined /> }, // which is required
  {
    label: "Quản trị",
    key: "management",
    icon: <DatabaseOutlined />,
    children: [
      { label: "Danh mục", key: "management-categories" },
      { label: "Nhà cung cấp", key: "management-suppliers" },
      {
        label: "Sản phẩm",
        key: "management-products",
      },
      { label: "Đơn hàng", key: "management-orders" },
      { label: "Khách hàng", key: "management-customers" },
      {
        label: "Nhân viên",
        key: "management-employees",
      },
    ],
  },
];

function MenuMain() {
  const navigate = useNavigate();

  return (
    <div>
      <Menu
        theme="light"
        items={items}
        onClick={({ key }) => {
          navigate("/" + key.split("-").join("/"));
        }}
      />
    </div>
  );
}

export default MenuMain;
