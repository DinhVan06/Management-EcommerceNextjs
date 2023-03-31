import {
  DatabaseOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const items = [
  { label: "Home", key: "home", icon: <HomeOutlined /> }, // remember to pass the key prop
  { label: "Settings", key: "settings", icon: <SettingOutlined /> }, // which is required
  {
    label: "Managements",
    key: "management",
    icon: <DatabaseOutlined />,
    children: [
      { label: "Categories", key: "management-categories" },
      { label: "Suppliers", key: "management-suppliers" },
      {
        label: "Products",
        key: "management-products",
      },
      { label: "Orders", key: "management-orders" },
      { label: "Customers", key: "management-customers" },
      {
        label: "Employees",
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
