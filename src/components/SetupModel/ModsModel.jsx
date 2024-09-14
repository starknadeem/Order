import React, { useState, useEffect } from 'react';
import style from './SetupModel.module.css'; // Make sure to create or update this CSS file
import axios from 'axios';

const ModsModal = ({ isVisible, onClose, mod, fetchMods }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (mod) {
            setName(mod.name);
        } else {
            setName('');
        }
    }, [mod]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mod) {
                // Update existing mod
                await axios.put(`http://127.0.0.1:8000/api/admin/product/updatemod/${mod._id}`, { name });
            } else {
                // Create new mod
                await axios.post('http://127.0.0.1:8000/api/admin/product/mod', { name });
            }
            fetchMods();
            onClose();
        } catch (error) {
            console.error('Error saving mod:', error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <h3>{mod ? 'Edit Mod' : 'Add Mod'}</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Mod Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <button type="submit">{mod ? 'Update' : 'Create'}</button>
                </form>
                <button onClick={onClose} className={style.closeButton}>Close</button>
            </div>
        </div>
    );
};

export default ModsModal;
