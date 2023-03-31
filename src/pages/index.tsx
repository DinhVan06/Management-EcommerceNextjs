import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Button } from "antd";
import MenuMain from "../components/MenuMain";
import HeaderMenu from "../components/HeaderMenu";
import Home from "./Home";
import Category from "./Management/Categories";
import Products from "./Management/Products";
import Suppliers from "./Management/Suppiler";
import Orders from "./Management/Orders";
import Employees from "./Management/Employees";
import Customers from "./Management/Customers";
const { Header, Footer, Sider, Content } = Layout;
function List() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Header style={{ backgroundColor: "black" }}>
            <HeaderMenu />
          </Header>
          <Layout>
            <Sider theme="light" style={{ minHeight: "100vh" }}>
              <MenuMain />
            </Sider>
            <Content style={{ padding: 24 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/management/categories" element={<Category />} />
                <Route path="/management/products" element={<Products />} />
                <Route path="/management/suppliers" element={<Suppliers />} />
                <Route path="/management/employees" element={<Employees />} />
                <Route path="/management/customers" element={<Customers />} />
                <Route path="/management/orders" element={<Orders />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default List;
