// src/components/CRUDActivityTags/DeleteActivityTag.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteActivityTag = () => {
    const [id, setId] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/activity-tags/delete/${id}`);
            setMessage('Tag deleted successfully!');
        } catch (error) {
            setMessage('Error deleting tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Delete Activity Tag</h2>
            <input 
                type="text" 
                value={id} 
                onChange={(e) => setId(e.target.value)} 
                placeholder="Enter Tag ID" 
            />
            <button onClick={handleDelete}>Delete Tag</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteActivityTag;