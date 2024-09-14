import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttributesModal = ({ onClose, attribute, onUpdate }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        if (attribute) {
            setName(attribute.name);
            setCategory(attribute.categoryId);
        }
    }, [attribute]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/product/getcategories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSave = async () => {
        try {
            if (attribute) {
                await axios.put(`http://127.0.0.1:8000/api/admin/product/updateattribute/${attribute._id}`, {
                    name,
                    categoryId: category,
                });
            } else {
                await axios.post('http://127.0.0.1:8000/api/admin/product/addattribute', {
                    name,
                    categoryId: category,
                });
            }
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error saving attribute:', error);
        }
    };

    return (
        <div className="modal">
            <h2>{attribute ? 'Edit Attribute' : 'Add Attribute'}</h2>
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Category:
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default AttributesModal;
