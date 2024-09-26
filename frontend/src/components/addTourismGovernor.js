import React, { useState } from 'react';
import axios from 'axios';

const AddTourismGovernor = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleAddGovernor = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post('/addTourismGovernor', { username, password });
      setMessage(response.data.message); 
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage('Error adding Tourism Governor: ' + error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div>
      <form onSubmit={handleAddGovernor}>
        <input 
          type="text" 
          placeholder="Enter username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Enter password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Add Governor</button>
      </form>
      {message && <p>{message}</p>} {/* Display message if it exists */}
    </div>
  );
};

export default AddTourismGovernor; // Export the component

