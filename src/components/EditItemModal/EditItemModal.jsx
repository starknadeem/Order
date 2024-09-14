import React, { useState, useEffect } from 'react';
import styles from './EditItemModal.module.css';

const EditItemModal = ({ isOpen, onClose, onSave, item }) => {
    const [formData, setFormData] = useState({
        itemName: '',
        itemPrice: '',
        category: '',
        applyDiscount: false,
        discountValue: '',
        tax: '',
        image: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                itemName: item.itemName,
                itemPrice: item.itemPrice,
                category: item.category ? item.category.name : '',
                applyDiscount: item.applyDiscount,
                discountValue: item.discountValue || '',
                tax: item.tax,
                image: item.image || ''
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Edit Item</h2>
                <label>
                    Name:
                    <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="number"
                        name="itemPrice"
                        value={formData.itemPrice}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Category:
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Apply Discount:
                    <input
                        type="checkbox"
                        name="applyDiscount"
                        checked={formData.applyDiscount}
                        onChange={handleChange}
                    />
                </label>
                {formData.applyDiscount && (
                    <label>
                        Discount Value:
                        <input
                            type="number"
                            name="discountValue"
                            value={formData.discountValue}
                            onChange={handleChange}
                        />
                    </label>
                )}
                <label>
                    Tax:
                    <input
                        type="number"
                        name="tax"
                        value={formData.tax}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Image:
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    />
                </label>
                <button onClick={handleSubmit}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default EditItemModal;
