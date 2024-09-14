import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SetupModal from '../SetupModel/SetupModel';
import ModsModal from '../SetupModel/ModsModel';
import BrandsModal from '../SetupModel/BrandModel';
import FilterTagsModal from '../SetupModel/FilterTagsModal'; // Import the FilterTagsModal component
import style from './Setup.module.css';

const Setup = () => {
    const [activeTab, setActiveTab] = useState('Option Sets');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModsModalVisible, setIsModsModalVisible] = useState(false);
    const [isBrandsModalVisible, setIsBrandsModalVisible] = useState(false);
    const [isFilterTagsModalVisible, setIsFilterTagsModalVisible] = useState(false); // State for Filter Tags Modal
    const [optionSets, setOptionSets] = useState([]);
    const [mods, setMods] = useState([]);
    const [brands, setBrands] = useState([]);  // State for Brands
    const [filterTags, setFilterTags] = useState([]);  // State for Filter Tags
    const [selectedOptionSet, setSelectedOptionSet] = useState(null);
    const [selectedMod, setSelectedMod] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null); // State for selected Brand
    const [selectedFilterTag, setSelectedFilterTag] = useState(null); // State for selected Filter Tag

    useEffect(() => {
        fetchOptionSets();
        fetchMods();
        fetchBrands();
        fetchFilterTags(); // Fetch filter tags when component mounts
    }, []);

    const fetchOptionSets = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/product/optionset');
            setOptionSets(response.data);
        } catch (error) {
            console.error('Error fetching option sets:', error);
        }
    };

    const fetchMods = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/product/getmod');
            setMods(response.data);
        } catch (error) {
            console.error('Error fetching mods:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/product/getbrand');
            setBrands(response.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchFilterTags = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/product/getfiltertag');
            setFilterTags(response.data);
        } catch (error) {
            console.error('Error fetching filter tags:', error);
        }
    };

    const handleNav = (e) => {
        setActiveTab(e.target.textContent);
    };

    const handleModalOpen = () => {
        setIsModalVisible(true);
    };

    const handleModsModalOpen = () => {
        setIsModsModalVisible(true);
    };

    const handleBrandsModalOpen = () => {
        setIsBrandsModalVisible(true);
    };

    const handleFilterTagsModalOpen = () => {
        setIsFilterTagsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedOptionSet(null);
        fetchOptionSets();
    };

    const handleModsModalClose = () => {
        setIsModsModalVisible(false);
        setSelectedMod(null);
        fetchMods();
    };

    const handleBrandsModalClose = () => {
        setIsBrandsModalVisible(false);
        setSelectedBrand(null);
        fetchBrands();
    };

    const handleFilterTagsModalClose = () => {
        setIsFilterTagsModalVisible(false);
        setSelectedFilterTag(null);
        fetchFilterTags();
    };

    const handleEdit = (optionSet) => {
        setSelectedOptionSet(optionSet);
        handleModalOpen();
    };

    const handleModEdit = (mod) => {
        setSelectedMod(mod);
        handleModsModalOpen();
    };

    const handleBrandEdit = (brand) => {
        setSelectedBrand(brand);
        handleBrandsModalOpen();
    };

    const handleFilterTagEdit = (filterTag) => {
        setSelectedFilterTag(filterTag);
        handleFilterTagsModalOpen();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/product/optionset/${id}`);
            fetchOptionSets();
        } catch (error) {
            console.error('Error deleting option set:', error);
        }
    };

    const handleModDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/product/deletemod/${id}`);
            fetchMods();
        } catch (error) {
            console.error('Error deleting mod:', error);
        }
    };

    const handleBrandDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/product/deletebrand/${id}`);
            fetchBrands();
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    const handleFilterTagDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/product/deletefiltertag/${id}`);
            fetchFilterTags();
        } catch (error) {
            console.error('Error deleting filter tag:', error);
        }
    };

    return (
        <div id={style.mainContainer}>
            <div id={style.header}>
                <ul>
                    <li onClick={handleNav}>Option Sets</li>
                    <li onClick={handleNav}>Attributes</li>
                    <li onClick={handleNav}>Filter-Tags</li>
                    <li onClick={handleNav}>Brands</li>
                    <li onClick={handleNav}>Mods</li>
                </ul>
            </div>

            <div id={style.showContent}>
                {activeTab === 'Option Sets' && 
                <div className={style.container}>
                    <div className={style.search}>
                        <h3>Option Sets</h3>
                        <input type="search" placeholder='Search Option Sets' />
                        <button onClick={handleModalOpen}>Add Option Sets</button>
                    </div>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Option Items</th>
                                <th>Min Qty.</th>
                                <th>Max Qty.</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {optionSets.length > 0 ? (
                                optionSets.map((optionSet) => (
                                    <tr key={optionSet._id}>
                                        <td>{optionSet.name}</td>
                                        <td>{optionSet.optionItems || 'N/A'}</td>
                                        <td>{optionSet.minQuantity}</td>
                                        <td>{optionSet.maxQuantity}</td>
                                        <td>
                                            <button onClick={() => handleEdit(optionSet)}>Edit</button>
                                            <button onClick={() => handleDelete(optionSet._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No Data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>}

                {activeTab === 'Mods' && 
                <div className={style.container}>
                    <div className={style.search}>
                        <h3>Mods</h3>
                        <input type="search" placeholder='Search Mod' />
                        <button onClick={handleModsModalOpen}>Add Mods</button>
                    </div>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mods.length > 0 ? (
                                mods.map((mod) => (
                                    <tr key={mod._id}>
                                        <td>{mod.name}</td>
                                        <td>
                                            <button onClick={() => handleModEdit(mod)}>Edit</button>
                                            <button onClick={() => handleModDelete(mod._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No Data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>}

                {activeTab === 'Brands' && 
                <div className={style.container}>
                    <div className={style.search}>
                        <h3>Brands</h3>
                        <input type="search" placeholder='Search Brand' />
                        <button onClick={handleBrandsModalOpen}>Add Brands</button>
                    </div>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.length > 0 ? (
                                brands.map((brand) => (
                                    <tr key={brand._id}>
                                        <td>{brand.name}</td>
                                        <td>{brand.description}</td>
                                        <td>
                                            <button onClick={() => handleBrandEdit(brand)}>Edit</button>
                                            <button onClick={() => handleBrandDelete(brand._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No Data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>}

                {activeTab === 'Filter-Tags' &&
                <div className={style.container}>
                    <div className={style.search}>
                        <h3>Filter Tags</h3>
                        <input type="search" placeholder='Search Filter Tags' />
                        <button onClick={handleFilterTagsModalOpen}>Add Filter Tag</button>
                    </div>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterTags.length > 0 ? (
                                filterTags.map((filterTag) => (
                                    <tr key={filterTag._id}>
                                        <td>{filterTag.name}</td>
                                        <td>
                                            <button onClick={() => handleFilterTagEdit(filterTag)}>Edit</button>
                                            <button onClick={() => handleFilterTagDelete(filterTag._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No Data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>}

            </div>

            <SetupModal
                isVisible={isModalVisible}
                onClose={handleModalClose}
                optionSet={selectedOptionSet}
                fetchOptionSets={fetchOptionSets}
            />

            <ModsModal
                isVisible={isModsModalVisible}
                onClose={handleModsModalClose}
                mod={selectedMod}
                fetchMods={fetchMods}
            />

            <BrandsModal
                isVisible={isBrandsModalVisible}
                onClose={handleBrandsModalClose}
                brand={selectedBrand}
                fetchBrands={fetchBrands}
            />

            <FilterTagsModal
                isVisible={isFilterTagsModalVisible}
                onClose={handleFilterTagsModalClose}
                filterTag={selectedFilterTag}
                fetchFilterTags={fetchFilterTags}
            />
        </div>
    );
};

export default Setup;


