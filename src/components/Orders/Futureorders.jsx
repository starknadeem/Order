import React from 'react'
import style from './Orders.module.css';
import { FiSearch } from "react-icons/fi"; // Search icon

const Futureorders = () => {
    return (
        <div className={style.ordersContainer}>
          <div className={style.header}>
            <h3>Future Order</h3>
            <div className={style.searchBar}>
              
              <input
                type="text"
                className={style.searchInput}
                placeholder="Search Order"
              />
            </div>
            <div className={style.controls}>
              <label className={style.toggleLabel}>
                <input type="checkbox" className={style.checkbox} />
                <span className={style.toggleText}>FPO</span>
              </label>
              <button className={style.bulkPrintButton} disabled>Bulk Print</button>
              <button className={style.exportButton}>Export Orders</button>
            </div>
          </div>
    
          <div className={style.filters}>
            <select className={style.filterDropdown}>
              <option>Rawalpindi</option>
            </select>
            <select className={style.filterDropdown}>
              <option>All Order Types</option>
            </select>
            <select className={style.filterDropdown}>
              <option>All Statuses</option>
            </select>
          </div>
    
          <table className={style.ordersTable}>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Order #</th>
                <th>Delivery Date</th>
                <th>Customer Name</th>
                <th>City</th>
                <th>Area</th>
                <th>Location</th>
                <th>Status</th>
                <th>Grand Total</th>
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

export default Futureorders
