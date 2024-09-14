import React, { useContext } from 'react'
import style from './AdminNav.module.css'

//images imports
import logo from '../images/logo.png'

// Importing Icons 
import { TfiAlignJustify } from "react-icons/tfi";

//link
import { Link } from 'react-router-dom';
import { MyContext } from '../Context/Admincontext';

const AdminNav = () => {
    const {isactive, setIsactive} = useContext(MyContext);

    function tooglesidebar()
    {
        setIsactive(!isactive);
    }

  return (
    <div id={style.nav}>
        <div id={style.logoWrapper}>
            <div id={style.logo}>
               <h2>Admin Panel</h2>
            </div>

            <div id={style.butn}>
                <TfiAlignJustify id={style.navIcon} onClick={tooglesidebar}/>
            </div>
        </div>

        <div id={style.container}>
            <div id={style.showDate}>
                <p>Aug 10 2024 - Aug 10 2024</p>
            </div>

            <div id={style.showBranch}>
                <p>Branch: <strong>Rawalpindi</strong></p>
            </div>
        </div>

        <div id={style.lastContainer}>
        <Link to="/website" style={{ cursor: 'pointer', fontWeight: '600', color: 'blue' }}>Visit Website</Link>
        </div>
    </div>
  )
}

export default AdminNav