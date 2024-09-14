import React, { useState, useEffect } from 'react';
import styles from './AddItemModal.module.css'; // CSS Module

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
                setFormData({ ...initialData, image: null }); // Set formData with the initial data
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
    };

    const validateForm = () => {
        const newErrors = {};
        const { itemName, itemPrice, tax, description, image } = formData;
        if (!itemName) newErrors.itemName = 'Item Name is required';
        if (!itemPrice) newErrors.itemPrice = 'Item Price is required';
        if (!tax) newErrors.tax = 'Tax is required';
        if (!description) newErrors.description = 'Description is required';
        if (!image && !initialData) newErrors.image = 'Image is required'; // If editing, image isn't mandatory

        if (formData.applyDiscount) {
            if (!formData.discountValue) newErrors.discountValue = 'Discount Value is required';
            if (!formData.discountStart) newErrors.discountStart = 'Discount Start Date is required';
            if (!formData.discountExpiry) newErrors.discountExpiry = 'Discount Expiry Date is required';
        }

        if (formData.addRecipe) {
            if (!formData.recipename) newErrors.recipename = 'Recipe Name is required';
            if (!formData.itemWeight) newErrors.itemWeight = 'Item Weight is required';
            if (!formData.weightUnit) newErrors.weightUnit = 'Weight Unit is required';
            if (!formData.productCode) newErrors.productCode = 'Product Code is required';
        }

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
                    ? `http://127.0.0.1:8000/api/admin/product/items/${initialData.id}` 
                    : 'http://127.0.0.1:8000/api/admin/product/items';

                const response = await fetch(url, {
                    method: initialData ? 'PUT' : 'POST', // PUT for editing, POST for adding
                    body: formDataToSubmit,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Form data submitted successfully:', result);
                    onClose(); // Close the modal on success
                } else {
                    const errorData = await response.json();
                    console.error('Error submitting form data:', errorData);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{initialData ? 'Edit Item' : 'Add Item'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Form Part 1: Item Details */}
                    <div className={styles.formSection}>
                        <h3>Item Category</h3>
                        <div className={styles.inputGroup}>
                            <select 
                                name="category" 
                                className={styles.inputField} 
                                value={formData.category} 
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input 
                            type="text" 
                            name="itemName" 
                            placeholder="Item Name" 
                            className={styles.inputField} 
                            value={formData.itemName} 
                            onChange={handleChange} 
                        />
                        {errors.itemName && <p className={styles.error}>{errors.itemName}</p>}
                        <div className={styles.twoInputs}>
                            <input 
                                type="number" 
                                name="itemPrice" 
                                placeholder="Item Price" 
                                className={styles.inputField} 
                                value={formData.itemPrice} 
                                onChange={handleChange} 
                            />
                            {errors.itemPrice && <p className={styles.error}>{errors.itemPrice}</p>}
                            <input 
                                type="number" 
                                name="tax" 
                                placeholder="Tax %" 
                                className={styles.inputField} 
                                value={formData.tax} 
                                onChange={handleChange} 
                            />
                            {errors.tax && <p className={styles.error}>{errors.tax}</p>}
                        </div>
                        <input 
                            type="text" 
                            name="description" 
                            placeholder="Description" 
                            className={styles.inputField} 
                            value={formData.description} 
                            onChange={handleChange} 
                        />
                        {errors.description && <p className={styles.error}>{errors.description}</p>}

                        <div className={styles.formSection}>
                            <h3>Upload Item Image</h3>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.inputField}
                            />
                            {errors.image && <p className={styles.error}>{errors.image}</p>}
                        </div>

                        <div className={styles.switchGroup}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="applyDiscount" 
                                    checked={formData.applyDiscount} 
                                    onChange={handleChange} 
                                />
                                Apply Discount
                            </label>
                            {formData.applyDiscount && (
                                <div>
                                    <input 
                                        type="number" 
                                        name="discountValue" 
                                        placeholder="Discount Value" 
                                        className={styles.inputField} 
                                        value={formData.discountValue} 
                                        onChange={handleChange} 
                                    />
                                    {errors.discountValue && <p className={styles.error}>{errors.discountValue}</p>}
                                    <div className={styles.twoInputs}>
                                        <input 
                                            type="date" 
                                            name="discountStart" 
                                            placeholder="Discount Start" 
                                            className={styles.inputField} 
                                            value={formData.discountStart} 
                                            onChange={handleChange} 
                                        />
                                        {errors.discountStart && <p className={styles.error}>{errors.discountStart}</p>}
                                        <input 
                                            type="date" 
                                            name="discountExpiry" 
                                            placeholder="Discount Expiry" 
                                            className={styles.inputField} 
                                            value={formData.discountExpiry} 
                                            onChange={handleChange} 
                                        />
                                        {errors.discountExpiry && <p className={styles.error}>{errors.discountExpiry}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.switchGroup}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="addRecipe" 
                                    checked={formData.addRecipe} 
                                    onChange={handleChange} 
                                />
                                Add Recipe
                            </label>
                            {formData.addRecipe && (
                                <div>
                                    <input 
                                        type="text" 
                                        name="recipename" 
                                        placeholder="Recipe Name" 
                                        className={styles.inputField} 
                                        value={formData.recipename} 
                                        onChange={handleChange} 
                                    />
                                    {errors.recipename && <p className={styles.error}>{errors.recipename}</p>}
                                    <div className={styles.twoInputs}>
                                        <input 
                                            type="number" 
                                            name="itemWeight" 
                                            placeholder="Item Weight" 
                                            className={styles.inputField} 
                                            value={formData.itemWeight} 
                                            onChange={handleChange} 
                                        />
                                        {errors.itemWeight && <p className={styles.error}>{errors.itemWeight}</p>}
                                        <select 
                                            name="weightUnit" 
                                            className={styles.inputField} 
                                            value={formData.weightUnit} 
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Unit</option>
                                            <option value="g">g</option>
                                            <option value="kg">kg</option>
                                            <option value="ml">ml</option>
                                            <option value="l">l</option>
                                        </select>
                                        {errors.weightUnit && <p className={styles.error}>{errors.weightUnit}</p>}
                                    </div>
                                    <input 
                                        type="text" 
                                        name="productCode" 
                                        placeholder="Product Code" 
                                        className={styles.inputField} 
                                        value={formData.productCode} 
                                        onChange={handleChange} 
                                    />
                                    {errors.productCode && <p className={styles.error}>{errors.productCode}</p>}
                                    <div className={styles.twoInputs}>
                                        <input 
                                            type="text" 
                                            name="nutritionName" 
                                            placeholder="Nutrition Name" 
                                            className={styles.inputField} 
                                            value={formData.nutritionName} 
                                            onChange={handleChange} 
                                        />
                                        <input 
                                            type="text" 
                                            name="nutritionValue" 
                                            placeholder="Nutrition Value" 
                                            className={styles.inputField} 
                                            value={formData.nutritionValue} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>
                            {initialData ? 'Update Item' : 'Add Item'}
                        </button>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;



import React, { useState } from 'react';
import style from './Admin.module.css';

// Component imports
import AdminNav from '../Admin Nav/AdminNav';
import SideBar from '../SideBar/SideBar';
import Items from '../Item/Items';
import Category from '../category/Category';
import Setup from '../Setup/Setup'
// Import other components


const Admin = () => {
    const [selectedComponent, setSelectedComponent] = useState("dashboard");

    const renderComponent = () => {
        switch (selectedComponent) {
            case "items":
                return <Items />;
            case "category":
                return <Category />;
            
            case "setup":
                return <Setup />;

            case "dashboard":
            default:
                return <div>Dashboard Content</div>; // Default content for dashboard
        }
    };

    return (
        <div id={style.outerContainer}>
            <div id={style.nav}>
                <AdminNav />
            </div>
            <div id={style.main}>
                <div id={style.sideBar}>
                    <SideBar onSelect={setSelectedComponent} />
                </div>
                <div id={style.dashboardContainer}>
                    <div id={style.showDashboard}>
                        {renderComponent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;




import React from 'react'
import style from './AdminNav.module.css'

//images imports
import logo from '../images/logo.png'

// Importing Icons 
import { TfiAlignJustify } from "react-icons/tfi";

//link
import { Link } from 'react-router-dom';

const AdminNav = () => {
  return (
    <div id={style.nav}>
        <div id={style.logoWrapper}>
            <div id={style.logo}>
                <img src={logo} alt="tossdown" />
            </div>

            <div id={style.butn}>
                <TfiAlignJustify id={style.navIcon}/>
            </div>
        </div>

        <div id={style.container}>
            <div id={style.showDate}>
                <p>Aug 10 2024 - Aug 10 2024</p>
            </div>

            <div id={style.showBranch}>
                <p>Branch: <strong>Rawalpindi</strong></p>
            </div>
        </div>

        <div id={style.lastContainer}>
        <Link to="/website" style={{ cursor: 'pointer', fontWeight: '600', color: 'blue' }}>Visit Website</Link>
        </div>
    </div>
  )
}

export default AdminNav



import React, { useState, useEffect } from 'react';
import styles from './Category.module.css';
import CategoryModel from '../CategoryModel/CategoryModel';

const Category = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/admin/product/getcategories');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                console.log("Fetched Categories:", data); // Debugging line
                setCategories(data);
                setFilteredCategories(data); // Initially display all categories
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const openModal = (category = null) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    const handleDelete = async (categoryId) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/admin/product/categories/${categoryId}`, {
                method: 'DELETE',
            });
            setCategories(categories.filter(category => category._id !== categoryId));
            setFilteredCategories(filteredCategories.filter(category => category._id !== categoryId));
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    const filterItemsByCategory = (categoryName) => {
        console.log("Selected Category:", categoryName); // Debugging line
        setSelectedCategory(categoryName);

        if (categoryName === "All Categories") {
            setFilteredCategories(categories);
        } else {
            setFilteredCategories(categories.filter(category => category.name === categoryName));
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setFilteredCategories(categories); // Reset to all categories if search is cleared
        } else {
            setFilteredCategories(categories.filter(category =>
                category.name.toLowerCase().includes(term)
            ));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.itemsContainer}>
            <div className={styles.header}>
                <h2>Category</h2>
                <input
                    type="text"
                    placeholder="Search Categories"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className={styles.addItemButton} onClick={() => openModal()}>Add Category</button>
            </div>

            <div className={styles.filterBar}>
                <select
                    className={styles.categoryFilter}
                    value={selectedCategory}
                    onChange={(e) => filterItemsByCategory(e.target.value)}
                >
                    <option value="All Categories">All Categories</option>
                    {categories.map(category => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.itemsList}>
                <p>{filteredCategories.length} Category{filteredCategories.length > 1 ? 'ies' : ''}</p>
                <div className={styles.itemHeader}>
                    <div>Category</div>
                    <div>No. of Items</div>
                    <div>Actions</div>
                </div>
                {filteredCategories.length > 0 ? (
                    filteredCategories.map(category => (
                        <div key={category._id} className={styles.itemRow}>
                            <div className={styles.categoryName}>{category.name}</div>
                            <div className={styles.itemCount}>{category.itemCount || 0}</div>
                            <div className={styles.actions}>
                                <button className={styles.editButton} onClick={() => openModal(category)}>Edit</button>
                                <button className={styles.deleteButton} onClick={() => handleDelete(category._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noData}>
                        <img src="path_to_no_data_image" alt="No Data" />
                        <p>No Data</p>
                    </div>
                )}
            </div>

            <CategoryModel
                isOpen={isModalOpen}
                onClose={closeModal}
                category={selectedCategory}
            />
        </div>
    );
};

export default Category;



import React from 'react'

const Dashboard = () => {
  return (
    <div>
      
    </div>
  )
}

export default Dashboard





































































import React, { useState, useEffect } from 'react';
import styles from './Items.module.css'; // Import the corresponding CSS Module
import AddItemModal from '../AddItemModal/AddItemModal'; // Import the AddItemModal component

const Items = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingItem, setEditingItem] = useState(null); // For editing an item

    // Open the modal
    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/product/getcategories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch items based on selected category or fetch all items if no category is selected
    const fetchItems = async (categoryName = '') => {
        setLoading(true);
        try {
            const url = categoryName
                ? `http://127.0.0.1:8000/api/admin/product/items/category/${categoryName}`
                : 'http://127.0.0.1:8000/api/admin/product/items'; // Fetch all items if no category is selected
            const response = await fetch(url);
            const data = await response.json();
            console.log('Fetched items:', data); // Debugging
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories and items on component mount
    useEffect(() => {
        fetchCategories();
        fetchItems(); // Fetch all items by default
    }, []);

    // Fetch items whenever selectedCategory changes
    useEffect(() => {
        fetchItems(selectedCategory);
    }, [selectedCategory]);

    // Handle search input change
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter items based on search query
    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle delete item
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

    // Modal component for adding/editing items
    const handleSave = async (itemData) => {
        try {
            const method = editingItem ? 'PUT' : 'POST';
            const url = editingItem
                ? `http://127.0.0.1:8000/api/admin/product/items/${editingItem._id}`
                : 'http://127.0.0.1:8000/api/admin/product/items';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });

            closeModal();
            fetchItems(); // Refresh items list
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

            {/* AddItemModal Component */}
            <AddItemModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                item={editingItem} // Pass the item to edit (if any)
            />
        </div>
    );
};

export default Items;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SetupModal from '../SetupModel/SetupModel';
import ModsModal from '../SetupModel/ModsModel';
import BrandsModal from '../SetupModel/BrandModel';
import FilterTagsModal from '../SetupModel/FilterTagsModal'; // Import the FilterTagsModal component
import InnerModel from '../SetupModel/InnerModel';
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





    const [searchOptionSets, setSearchOptionSets] = useState('');
    const [searchMods, setSearchMods] = useState('');
    const [searchBrands, setSearchBrands] = useState('');
    const [searchFilterTags, setSearchFilterTags] = useState('');

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



    const filteredOptionSets = optionSets.filter(optionSet =>
        optionSet.name.toLowerCase().includes(searchOptionSets.toLowerCase())
    );

    const filteredMods = mods.filter(mod =>
        mod.name.toLowerCase().includes(searchMods.toLowerCase())
    );

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchBrands.toLowerCase())
    );

    const filteredFilterTags = filterTags.filter(filterTag =>
        filterTag.name.toLowerCase().includes(searchFilterTags.toLowerCase())
    );

    return (
        <div id={style.mainContainer}>
            <div id={style.header}>
                <ul>
                    <li onClick={handleNav}>Option Sets</li>
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
                        <input 
                            type="search" 
                            placeholder='Search Option Sets' 
                            value={searchOptionSets}
                            onChange={(e) => setSearchOptionSets(e.target.value)}
                        />
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
                            {filteredOptionSets.length > 0 ? (
                                filteredOptionSets.map((optionSet) => (
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
                        <input 
                            type="search" 
                            placeholder='Search Mod' 
                            value={searchMods}
                            onChange={(e) => setSearchMods(e.target.value)}
                        />
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
                            {filteredMods.length > 0 ? (
                                filteredMods.map((mod) => (
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
                        <input 
                            type="search" 
                            placeholder='Search Brand' 
                            value={searchBrands}
                            onChange={(e) => setSearchBrands(e.target.value)}
                        />
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
                            {filteredBrands.length > 0 ? (
                                filteredBrands.map((brand) => (
                                    <tr key={brand._id}>
                                        <td>{brand.name}</td>
                                        <td>{brand.description || 'N/A'}</td>
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
                        <input 
                            type="search" 
                            placeholder='Search Filter Tags' 
                            value={searchFilterTags}
                            onChange={(e) => setSearchFilterTags(e.target.value)}
                        />
                        <button onClick={handleFilterTagsModalOpen}>Add Filter Tag</button>
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
                            {filteredFilterTags.length > 0 ? (
                                filteredFilterTags.map((filterTag) => (
                                    <tr key={filterTag._id}>
                                        <td>{filterTag.name}</td>
                                        <td>{filterTag.description || 'N/A'}</td>
                                        <td>
                                            <button onClick={() => handleFilterTagEdit(filterTag)}>Edit</button>
                                            <button onClick={() => handleFilterTagDelete(filterTag._id)}>Delete</button>
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