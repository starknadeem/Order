import React, { useState, useEffect } from 'react';
import styles from './AddItemModal.module.css';

const AddItemModal = ({ isOpen, onClose, initialData }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category: '',
        itemName: '',
        itemPrice: '',
        tax: '',
        description: '',
        image: null,
        applyDiscount: false,
        discountValue: '',
        discountStart: '',
        discountExpiry: '',
        addRecipe: false,
        recipename: '',
        itemWeight: '',
        weightUnit: '',
        productCode: '',
        nutritionName: '',
        nutritionValue: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (initialData) {
                setFormData({ ...initialData, image: null });
            } else {
                setFormData({
                    category: '',
                    itemName: '',
                    itemPrice: '',
                    tax: '',
                    description: '',
                    image: null,
                    applyDiscount: false,
                    discountValue: '',
                    discountStart: '',
                    discountExpiry: '',
                    addRecipe: false,
                    recipename: '',
                    itemWeight: '',
                    weightUnit: '',
                    productCode: '',
                    nutritionName: '',
                    nutritionValue: ''
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/product/getcategories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width === 600 && img.height === 600) {
                    setFormData({ ...formData, image: file });
                    setErrors({ ...errors, image: null });
                } else {
                    setErrors({ ...errors, image: 'Image must be exactly 600x600 pixels' });
                }
            };
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const { itemName, itemPrice, tax, description, image } = formData;
        if (!itemName) newErrors.itemName = 'Item name is required';
        if (!itemPrice || isNaN(itemPrice)) newErrors.itemPrice = 'Valid item price is required';
        if (!tax || isNaN(tax)) newErrors.tax = 'Valid tax percentage is required';
        if (!description) newErrors.description = 'Description is required';
        if (!image) newErrors.image = 'Image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validateForm()) {
            const formDataToSubmit = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    formDataToSubmit.append(key, formData[key]);
                }
            });
    
            try {
                const url = initialData
                    ? `http://127.0.0.1:8000/api/admin/product/items/${initialData._id}`
                    : 'http://127.0.0.1:8000/api/admin/product/items';
    
                const response = await fetch(url, {
                    method: initialData ? 'PUT' : 'POST',
                    body: formDataToSubmit,
                });
    
                const responseData = await response.json();
    
                if (response.ok) {
                    console.log('Success:', responseData);
                    onClose();
                } else {
                    console.error('Error submitting form data:', responseData);
                    alert('An error occurred while updating the item. Check console for details.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An unexpected error occurred.');
            }
        }
    };
    

    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>{initialData ? 'Edit Item' : 'Add New Item'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className={styles.error}>{errors.category}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="itemName">Item Name</label>
                        <input
                            type="text"
                            id="itemName"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            required
                        />
                        {errors.itemName && <p className={styles.error}>{errors.itemName}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="itemPrice">Item Price</label>
                        <input
                            type="number"
                            id="itemPrice"
                            name="itemPrice"
                            value={formData.itemPrice}
                            onChange={handleChange}
                            required
                        />
                        {errors.itemPrice && <p className={styles.error}>{errors.itemPrice}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="tax">Tax (%)</label>
                        <input
                            type="number"
                            id="tax"
                            name="tax"
                            value={formData.tax}
                            onChange={handleChange}
                            required
                        />
                        {errors.tax && <p className={styles.error}>{errors.tax}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                        {errors.description && <p className={styles.error}>{errors.description}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="image">Image (600x600px)</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {errors.image && <p className={styles.error}>{errors.image}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="applyDiscount">
                            <input
                                type="checkbox"
                                id="applyDiscount"
                                name="applyDiscount"
                                checked={formData.applyDiscount}
                                onChange={handleChange}
                            />
                            Apply Discount
                        </label>
                        {formData.applyDiscount && (
                            <>
                                <div>
                                    <label htmlFor="discountValue">Discount Value (%)</label>
                                    <input
                                        type="number"
                                        id="discountValue"
                                        name="discountValue"
                                        value={formData.discountValue}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="discountStart">Discount Start Date</label>
                                    <input
                                        type="date"
                                        id="discountStart"
                                        name="discountStart"
                                        value={formData.discountStart}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="discountExpiry">Discount Expiry Date</label>
                                    <input
                                        type="date"
                                        id="discountExpiry"
                                        name="discountExpiry"
                                        value={formData.discountExpiry}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="addRecipe">
                            <input
                                type="checkbox"
                                id="addRecipe"
                                name="addRecipe"
                                checked={formData.addRecipe}
                                onChange={handleChange}
                            />
                            Add Recipe
                        </label>
                        {formData.addRecipe && (
                            <>
                                <div>
                                    <label htmlFor="recipename">Recipe Name</label>
                                    <input
                                        type="text"
                                        id="recipename"
                                        name="recipename"
                                        value={formData.recipename}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemWeight">Item Weight</label>
                                    <input
                                        type="number"
                                        id="itemWeight"
                                        name="itemWeight"
                                        value={formData.itemWeight}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="weightUnit">Weight Unit</label>
                                    <input
                                        type="text"
                                        id="weightUnit"
                                        name="weightUnit"
                                        value={formData.weightUnit}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="productCode">Product Code</label>
                                    <input
                                        type="text"
                                        id="productCode"
                                        name="productCode"
                                        value={formData.productCode}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nutritionName">Nutrition Name</label>
                                    <input
                                        type="text"
                                        id="nutritionName"
                                        name="nutritionName"
                                        value={formData.nutritionName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nutritionValue">Nutrition Value</label>
                                    <input
                                        type="text"
                                        id="nutritionValue"
                                        name="nutritionValue"
                                        value={formData.nutritionValue}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" className={styles.submitButton}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
