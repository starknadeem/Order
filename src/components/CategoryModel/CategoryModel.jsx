import React, { useState, useEffect } from 'react';
import styles from './CategoryModel.module.css';

const CategoryModel = ({ isOpen, onClose, category }) => {
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (category) {
            setCategoryName(category.name);
            setDescription(category.description);
        } else {
            setCategoryName('');
            setDescription('');
        }
    }, [category]);

    const handleSave = async () => {
        const method = category ? 'PUT' : 'POST';
        const url = category
            ? `http://127.0.0.1:8000/api/admin/product/categories/${category._id}`
            : 'http://127.0.0.1:8000/api/admin/product/categories';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryName, description }),
            });
            const data = await response.json();
            console.log('Category saved:', data);
            onClose();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{category ? 'Edit' : 'Add'} Category</h2>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>
                <div className={styles.formSection}>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className={styles.inputField}
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.textAreaField}
                    />
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.saveButton} onClick={handleSave}>Save</button>
                    <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModel;
