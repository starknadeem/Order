import React, { useState, useEffect } from 'react';
import style from './SetupModel.module.css';
import axios from 'axios';

const InnerModel = ({ isVisible, onClose, optionSet, fetchOptionSets }) => {
    const [name, setName] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState('');

    useEffect(() => {
        if (optionSet) {
            setName(optionSet.name);
            setMinQuantity(optionSet.minQuantity);
            setMaxQuantity(optionSet.maxQuantity);
        }
    }, [optionSet]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (optionSet) {
                // Update existing option set
                await axios.put(`http://127.0.0.1:8000/api/admin/product/optionset/${optionSet._id}`, {
                    name,
                    minQuantity,
                    maxQuantity
                });
            } else {
                // Create new option set
                await axios.post('http://127.0.0.1:8000/api/admin/product/optionset', {
                    name,
                    minQuantity,
                    maxQuantity
                });
            }
            fetchOptionSets();
            onClose();
        } catch (error) {
            console.error('Error saving option set:', error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <h3>{optionSet ? 'Edit Option Set' : 'Add Option Set'}</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Min Quantity" 
                        value={minQuantity} 
                        onChange={(e) => setMinQuantity(e.target.value)} 
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Max Quantity" 
                        value={maxQuantity} 
                        onChange={(e) => setMaxQuantity(e.target.value)} 
                        required 
                    />
                    <button type="submit">{optionSet ? 'Update' : 'Create'}</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default InnerModel
