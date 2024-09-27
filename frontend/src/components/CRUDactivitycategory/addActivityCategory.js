import React, { useState } from 'react'; 
import axios from 'axios'; 

const AddActivityCategory = () => {
    const [category, setCategory] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [isActive, setIsActive] = useState(true); 
    const [message, setMessage] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
          
            const response = await axios.post("/add-activityCategory", {
                category,
                description,
                isActive
            });

            setMessage(response.data.message);
            setCategory('');
            setDescription('');
            setIsActive(true); 
        } catch (error) {
         
            const errorMessage = error.response?.data?.message || 'Error adding category';
            setMessage(errorMessage); 
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}> 
                    <label>Add Category:</label>
                    <input
                        type="text"
                        value={category}
                        placeholder="Enter category name" 
                        onChange={(e) => setCategory(e.target.value)} 
                        required 
                    />
                    <textarea
                        value={description}
                        placeholder='description'
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    
                <button type="submit">Add Category</button> 
            </form>
            {message && <p>{message}</p>} 
        </div>
    );
};

export default AddActivityCategory; 