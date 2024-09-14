import React from 'react'
import style from './Orders.module.css';
import { FiSearch } from "react-icons/fi"; // Search icon

const Abandonedcarts = () => {
    return (
        <div className={style.ordersContainer}>
          <div className={style.header}>
            <h3> Abandoned Carts</h3>
            <div className={style.searchBar}>
              {/* <FiSearch className={style.searchIcon} /> */}
              <input
                type="text"
                className={style.searchInput}
                placeholder="Search Order"
              />
            </div>
            <div className={style.controls}>
              <button className={style.exportButton}>Export Carts</button>
            </div>
          </div>
    
          <table className={style.ordersTable}>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Order #</th>
                <th>Date & time</th>
                <th>Email</th>
                <th>Phone#</th>
                <th>Order Type</th>
                <th>Total</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="10" className={style.noData}>
                  <img
                    src="/no-data-icon.png" // Replace with the correct icon path
                    alt="No data"
                    className={style.noDataIcon}
                  />
                  <span>No Data</span>
                </td>
              </tr>
            </tbody>
          </table>
    
    
        </div>
      );
}

export default Abandonedcarts
