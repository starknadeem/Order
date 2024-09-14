import React, { useState, useEffect } from 'react';
import styles from './Items.module.css';
import AddItemModal from '../AddItemModal/AddItemModal';

const Items = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/product/getcategories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchItems = async (categoryName = '') => {
        setLoading(true);
        try {
            const url = categoryName
                ? `http://127.0.0.1:8000/api/admin/product/items/category/${categoryName}`
                : 'http://127.0.0.1:8000/api/admin/product/items';
            const response = await fetch(url);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchItems();
    }, []);

    useEffect(() => {
        fetchItems(selectedCategory);
    }, [selectedCategory]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/admin/product/items/${id}`, {
                method: 'DELETE',
            });
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleSave = async (itemData) => {
        try {
            const method = editingItem ? 'PUT' : 'POST';
            const url = editingItem
                ? `http://127.0.0.1:8000/api/admin/product/items/${editingItem._id}`
                : 'http://127.0.0.1:8000/api/admin/product/items';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });

            if (response.ok) {
                closeModal();
                fetchItems(); // Refresh items list
            } else {
                console.error('Error saving item:', await response.json());
            }
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.itemsContainer}>
            <div className={styles.header}>
                <h2>Items</h2>
                <input
                    type="text"
                    placeholder="Search Items"
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <div className={styles.options}>
                    <button className={styles.addItemButton} onClick={() => openModal()}>+ Add Item</button>
                </div>
            </div>

            <div className={styles.filterBar}>
                <select
                    className={styles.categoryFilter}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.itemsList}>
                {filteredItems.length > 0 ? (
                    <>
                        <p>{filteredItems.length} Item(s)</p>
                        <div className={styles.itemHeader}>
                            <div><input type="checkbox" /></div>
                            <div>Image</div>
                            <div>Name</div>
                            <div>Category</div>
                            <div>Price</div>
                            <div>Discount</div>
                            <div>Tax %</div>
                            <div>Actions</div>
                        </div>
                        {filteredItems.map(item => (
                            <div key={item._id} className={styles.itemRow}>
                                <div><input type="checkbox" /></div>
                                <div>
                                    <img
                                        src={`http://127.0.0.1:8000/api/admin/product/${item.image}` || 'path_to_default_image'}
                                        alt={item.itemName}
                                        className={styles.itemImage}
                                    />
                                </div>
                                <div>{item.itemName}</div>
                                <div>{item.category ? item.category.name : 'No Category'}</div>
                                <div>${item.itemPrice.toFixed(2)}</div>
                                <div>
                                    {item.applyDiscount ? `${item.discountValue.toFixed(2)}%` : 'None'}
                                </div>
                                <div>{item.tax.toFixed(2)}%</div>
                                <div className={styles.itemActions}>
                                    <button className={styles.editButton} onClick={() => openModal(item)}>Edit</button>
                                    <button className={styles.deleteButton} onClick={() => handleDelete(item._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className={styles.noData}>
                        <img src="path_to_no_data_image" alt="No Data" />
                        <p>No Data</p>
                    </div>
                )}
            </div>

            <AddItemModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                initialData={editingItem}
            />
        </div>
    );
};

export default Items;
