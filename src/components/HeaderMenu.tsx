import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
function HeaderMenu() {
  const navigate = useNavigate();
  const items = [{ label: "Home", key: "home", icon: <AiOutlineHome /> }];
  return (
    <div className="text-white flex justify-between">
      <div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          onClick={({ key }) => {
            navigate("/" + key.split("-").join("/"));
          }}
        />
      </div>
    </div>
  );
}

export default HeaderMenu;
