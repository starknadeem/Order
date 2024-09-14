import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './BrandsModal.module.css'; // Import the CSS module

const FilterTagsModal = ({ isVisible, onClose, filterTag, fetchFilterTags }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (filterTag) {
            setName(filterTag.name);
        } else {
            setName('');
        }
    }, [filterTag]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (filterTag) {
                await axios.put(`http://localhost:8000/api/admin/product/updatefiltertag/${filterTag._id}`, {
                    name,
                });
            } else {
                await axios.post('http://localhost:8000/api/admin/product/addfiltertag', {
                    name,
                });
            }
            fetchFilterTags();
            onClose();
        } catch (error) {
            console.error('Error saving filter tag:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/product/deletefiltertag/${filterTag._id}`);
            fetchFilterTags();
            onClose();
        } catch (error) {
            console.error('Error deleting filter tag:', error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h2>{filterTag ? 'Edit Filter Tag' : 'Add Filter Tag'}</h2>
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
                    <button type="submit">Save</button>
                    {filterTag && <button type="button" onClick={handleDelete}>Delete</button>}
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default FilterTagsModal;
