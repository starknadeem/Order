// Dashboard.js
import React, { useState } from 'react';
import Items from './components/Items/Items';
import Setup from './components/Setup/Setup';
import Category from './components/Category/Category';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('items');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>Dashboard</h2>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li
                            className={activeTab === 'items' ? styles.active : ''}
                            onClick={() => handleTabChange('items')}
                        >
                            Items
                        </li>
                        <li
                            className={activeTab === 'optionSets' ? styles.active : ''}
                            onClick={() => handleTabChange('optionSets')}
                        >
                            Option Sets
                        </li>
                        <li
                            className={activeTab === 'mods' ? styles.active : ''}
                            onClick={() => handleTabChange('mods')}
                        >
                            Mods
                        </li>
                        <li
                            className={activeTab === 'brands' ? styles.active : ''}
                            onClick={() => handleTabChange('brands')}
                        >
                            Brands
                        </li>
                        <li
                            className={activeTab === 'filterTags' ? styles.active : ''}
                            onClick={() => handleTabChange('filterTags')}
                        >
                            Filter Tags
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Dashboard</h1>
                </header>
                <div className={styles.content}>
                    {activeTab === 'items' && <Items />}
                    {activeTab === 'optionSets' && <Setup activeTab="Option Sets" />}
                    {activeTab === 'mods' && <Setup activeTab="Mods" />}
                    {activeTab === 'brands' && <Setup activeTab="Brands" />}
                    {activeTab === 'filterTags' && <Setup activeTab="Filter Tags" />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
