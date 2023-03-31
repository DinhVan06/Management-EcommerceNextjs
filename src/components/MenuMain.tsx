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
  { label: "Cấu hình", key: "settings", icon: <SettingOutlined /> }, // which is required
  {
    label: "Quản trị dữ liệu",
    key: "management",
    icon: <DatabaseOutlined />,
    children: [
      {
        label: "Nhân viên",
        key: "management-employees",
      },
      {
        label: "Sản phẩm",
        key: "management-products",
      },
      { label: "Khách hàng", key: "management-customers" },
      { label: "Danh mục", key: "management-categories" },
      { label: "Nhà cung cấp", key: "management-suppliers" },
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
