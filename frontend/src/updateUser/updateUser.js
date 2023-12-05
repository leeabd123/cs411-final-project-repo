import React, { useState } from 'react';
import './updateUser.css';

const UpdateUser = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userId, setUserId] = useState(null); // Keep user ID in state but don't show it in the form
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to fetch user ID by username
    const fetchUserId = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/by-username/${username}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user: ${response.status}`);
            }
            const data = await response.json();
            setUserId(data.userId);
        } catch (error) {
            console.error('Fetch user error:', error);
            setError('Failed to fetch user. Please try again.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        // Fetch user ID by username before updating
        await fetchUserId();

        if (!userId) {
            setError('User not found.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword }),
            });

            if (!response.ok) {
                throw new Error(`Update failed: ${response.status}`);
            }

            setSuccess('Credentials updated successfully.');
        } catch (error) {
            console.error('Update error:', error);
            setError('Failed to update credentials. Please try again.');
        }
    };

    const handleDelete = async () => {
        // Fetch user ID by username before deleting
        await fetchUserId();

        if (!userId) {
            setError('User not found.');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete this user?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Deletion failed: ${response.status}`);
            }

            setSuccess('User deleted successfully.');
        } catch (error) {
            console.error('Delete error:', error);
            setError('Failed to delete user. Please try again.');
        }
    };

    return (
        <div>
            <h2>Update/Delete User</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                <button type="submit">Update</button>
                <button type="button" onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
            </form>
        </div>
    );
};

export default UpdateUser;
