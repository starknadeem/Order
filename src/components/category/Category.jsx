import React, { useState, useEffect } from 'react';
import styles from './Category.module.css';
import CategoryModel from '../CategoryModel/CategoryModel';

const Category = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/admin/product/getcategories');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                console.log("Fetched Categories:", data); // Debugging line
                setCategories(data);
                setFilteredCategories(data); // Initially display all categories
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const openModal = (category = null) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    const handleDelete = async (categoryId) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/admin/product/categories/${categoryId}`, {
                method: 'DELETE',
            });
            setCategories(categories.filter(category => category._id !== categoryId));
            setFilteredCategories(filteredCategories.filter(category => category._id !== categoryId));
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    const filterItemsByCategory = (categoryName) => {
        console.log("Selected Category:", categoryName); // Debugging line
        setSelectedCategory(categoryName);

        if (categoryName === "All Categories") {
            setFilteredCategories(categories);
        } else {
            setFilteredCategories(categories.filter(category => category.name === categoryName));
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setFilteredCategories(categories); // Reset to all categories if search is cleared
        } else {
            setFilteredCategories(categories.filter(category =>
                category.name.toLowerCase().includes(term)
            ));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.itemsContainer}>
            <div className={styles.header}>
                <h2>Category</h2>
                <input
                    type="text"
                    placeholder="Search Categories"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className={styles.addItemButton} onClick={() => openModal()}>Add Category</button>
            </div>

            <div className={styles.filterBar}>
                <select
                    className={styles.categoryFilter}
                    value={selectedCategory}
                    onChange={(e) => filterItemsByCategory(e.target.value)}
                >
                    <option value="All Categories">All Categories</option>
                    {categories.map(category => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.itemsList}>
                <p>{filteredCategories.length} Category{filteredCategories.length > 1 ? 'ies' : ''}</p>
                <div className={styles.itemHeader}>
                    <div>Category</div>
                    <div>No. of Items</div>
                    <div>Actions</div>
                </div>
                {filteredCategories.length > 0 ? (
                    filteredCategories.map(category => (
                        <div key={category._id} className={styles.itemRow}>
                            <div className={styles.categoryName}>{category.name}</div>
                            <div className={styles.itemCount}>{category.itemCount || 0}</div>
                            <div className={styles.actions}>
                                <button className={styles.editButton} onClick={() => openModal(category)}>Edit</button>
                                <button className={styles.deleteButton} onClick={() => handleDelete(category._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noData}>
                        <img src="path_to_no_data_image" alt="No Data" />
                        <p>No Data</p>
                    </div>
                )}
            </div>

            <CategoryModel
                isOpen={isModalOpen}
                onClose={closeModal}
                category={selectedCategory}
            />
        </div>
    );
};

export default Category;
