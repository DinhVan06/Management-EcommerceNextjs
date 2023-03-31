import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Button } from "antd";
import MenuMain from "../components/MenuMain";
import HeaderMenu from "../components/HeaderMenu";
import Home from "./Home";
import Category from "./Management/Categories";
import Products from "./Management/Products";
import Suppliers from "./Management/Suppiler";
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
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default List;
