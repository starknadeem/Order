import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './BrandsModal.module.css';  // Import the CSS module

const BrandsModal = ({ isVisible, onClose, brand, fetchBrands }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (brand) {
            setName(brand.name);
            setDescription(brand.description);
        } else {
            setName('');
            setDescription('');
        }
    }, [brand]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (brand) {
                await axios.put(`http://localhost:8000/api/admin/product/updatebrand/${brand._id}`, {
                    name,
                    description,
                });
            } else {
                await axios.post('http://localhost:8000/api/admin/product/addbrand', {
                    name,
                    description,
                });
            }
            fetchBrands();
            onClose();
        } catch (error) {
            console.error('Error saving brand:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/product/deletebrand/${brand._id}`);
            fetchBrands();
            onClose();
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{brand ? 'Edit Brand' : 'Add Brand'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </label>
                    <label>
                        Description:
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </label>
                    <button type="submit">Save</button>
                    {brand && (
                        <button 
                            type="button" 
                            className={styles.deleteButton} 
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    )}
                </form>
                <button 
                    className={styles.closeButton} 
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default BrandsModal;
