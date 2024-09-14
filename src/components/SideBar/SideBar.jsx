import React, { useState } from 'react';
import style from './Sidebar.module.css';
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi"; // Import icons

const SideBar = ({ onSelect }) => {
  const [activeMenu, setActiveMenu] = useState(""); // Tracks the active menu

  const toggleMenu = (menu) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? "" : menu));
  };

  return (
    <div id={style.main}>
        <ul>
            <li onClick={() => onSelect("dashboard")}>Dashboard</li>

            {/* Order Section */}
            <li onClick={() => toggleMenu("orders")}>
                Order
                {activeMenu === "orders" ? <TfiAngleUp className={style.arrow} /> : <TfiAngleDown className={style.arrow} />}
            </li>
            {activeMenu === "orders" && (
                <ul className={style.subMenu}>
                    <li onClick={() => onSelect("orders")}>Orders</li>
                    <li onClick={() => onSelect("futureOrders")}>Future Orders</li>
                    <li onClick={() => onSelect("abandonedCarts")}>Abandoned Carts</li>
                </ul>
            )}

            {/* Products Section */}
            <li onClick={() => toggleMenu("products")}>
                Products
                {activeMenu === "products" ? <TfiAngleUp className={style.arrow} /> : <TfiAngleDown className={style.arrow} />}
            </li>
            {activeMenu === "products" && (
                <ul className={style.subMenu}>
                    <li onClick={() => onSelect("items")}>Item</li>
                    <li onClick={() => onSelect("category")}>Category</li>
                    <li onClick={() => onSelect("setup")}>Setup</li>
                </ul>
            )}
        </ul>
    </div>
  );
};

export default SideBar;
