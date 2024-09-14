import React, { useContext, useState } from 'react';
import style from './Admin.module.css';

// Component imports
import AdminNav from '../Admin Nav/AdminNav';
import SideBar from '../SideBar/SideBar';
import Items from '../Item/Items';
import Category from '../category/Category';
import Setup from '../Setup/Setup'

import Orders from '../Orders/Orders';
import Futureorders from '../Orders/Futureorders';
import Abandonedcarts from '../Orders/Abandonedcarts';
import { MyContext } from '../Context/Admincontext';
// Import other components


const Admin = () => {
    const [selectedComponent, setSelectedComponent] = useState("dashboard");
    const {isactive} = useContext(MyContext);
    const renderComponent = () => {
        switch (selectedComponent) {
            case "items":
                return <Items />;
            case "category":
                return <Category />;
            
            case "setup":
                return <Setup />;

            case "dashboard":

            case "orders":
                return <Orders />;

            case "futureOrders":
                return <Futureorders />;

            case "abandonedCarts":
                return <Abandonedcarts />;
            default:
                return <div>Dashboard Content</div>; // Default content for dashboard
        }
    };

    return (
        <div id={style.outerContainer}>
            <div id={style.nav}>
                <AdminNav />
            </div>
            <div id={style.main}>
                <div id={style.sideBar}
                style={{display: isactive ? 'block' : 'none'}}
                >
                    <SideBar onSelect={setSelectedComponent} />
                </div>
                <div id={style.dashboardContainer}>
                    <div id={style.showDashboard}>
                        {renderComponent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
