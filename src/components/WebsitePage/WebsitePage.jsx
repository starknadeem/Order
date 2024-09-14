import React, { useState, useEffect } from 'react';
import styles from './WebsitePage.module.css'; // Import the corresponding CSS Module

const WebsitePage = () => {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/product/getcategories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchItemsByCategory = async (categoryName) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/product/items/category/${categoryName}`);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchItemsByCategory(selectedCategory);
        }
    }, [selectedCategory]);

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1>Welcome to Our Restaurant</h1>
                <p>Discover our delightful dishes by browsing through categories below!</p>
            </header>

            <div className={styles.categorySelector}>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Select a Category</option>
                    {categories.map(category => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.itemsGrid}>
                {items.length > 0 ? (
                    items.map(item => (
                        <div key={item._id} className={styles.itemCard}>
                            <img
                                src={`http://127.0.0.1:8000/api/admin/product/${item.image}` || 'path_to_default_image'}
                                alt={item.itemName}
                                className={styles.itemImage}
                            />
                            <h2 className={styles.itemName}>{item.itemName}</h2>
                            <p className={styles.itemDescription}>{item.description}</p>
                            <p className={styles.itemPrice}>${item.itemPrice.toFixed(2)}</p>
                        </div>
                    ))
                ) : (
                    <p>No items available for this category.</p>
                )}
            </div>
        </div>
    );
};

export default WebsitePage;
