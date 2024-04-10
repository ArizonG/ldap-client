import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendAPIExample = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [movedUsers, setMovedUsers] = useState([]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const handleAuthenticate = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/auth?username=${email}&password=${password}`);
            const auth = response.data;
            if (auth.auth) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                alert('Authentication failed');
            }
        } catch (error) {
            console.error('Error authenticating:', error);
            alert('Error authenticating');
        }
    };

    const handleFetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/fetch-users');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching users');
        }
    };

    const handleSearch = (query) => {
        if (!query) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.email.toLowerCase().includes(query.toLowerCase()) ||
                user.EmpID.toString().toLowerCase().includes(query.toLowerCase()) ||
                user.firstName.toLowerCase().includes(query.toLowerCase()) ||
                user.lastName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const handleCheckboxChange = (user) => {
        const selectedIndex = selectedUsers.findIndex(selectedUser => selectedUser.email === user.email);
        if (selectedIndex === -1) {
            setSelectedUsers([...selectedUsers, user]);
        } else {
            const newSelectedUsers = [...selectedUsers];
            newSelectedUsers.splice(selectedIndex, 1);
            setSelectedUsers(newSelectedUsers);
        }
    };

    const handleMoveRight = () => {
        // // Move selected users to the right container
        // setMovedUsers([...movedUsers, ...selectedUsers]);
        // setSelectedUsers([]);
        // Check if the selected users are already present in the movedUsers list
        const newMovedUsers = selectedUsers.filter(user =>
            !movedUsers.some(movedUser => movedUser.email === user.email)
        );
        // Add only those users who are not already present
        setMovedUsers([...movedUsers, ...newMovedUsers]);
        setSelectedUsers([]);
    };

    const handleRemoveUser = (userToRemove) => {
        const updatedMovedUsers = movedUsers.filter(user => user.email !== userToRemove.email);
        setMovedUsers(updatedMovedUsers);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#333' }}>Add new users to CMS</h2>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ marginRight: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginLeft: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>
            </div>
            <button style={{ marginBottom: '20px', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }} onClick={handleAuthenticate}>Authenticate</button>
            {authenticated && (
                <div>
                    <button style={{ marginBottom: '20px', backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }} onClick={handleFetchUsers}>Fetch Users</button>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginRight: '20px', backgroundColor: '#f8f9fa', minWidth: '300px', textAlign: 'left' }}>
                    <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px', color: '#333' }}>Available Users</h2>
                    <input type="text" placeholder="Search..." onChange={(e) => handleSearch(e.target.value)} style={{ marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Email</th>
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Emp ID</th>
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>First Name</th>
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Last Name</th>
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.email}>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.email}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.EmpID}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.firstName}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.lastName}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.some(selectedUser => selectedUser.email === user.email)}
                                            onChange={() => handleCheckboxChange(user)}
                                            style={{ marginRight: '10px' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button style={{ fontSize: '24px', cursor: 'pointer', marginBottom: '10px' }} onClick={handleMoveRight}>➡️</button>
                    <button style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => handleRemoveUser(selectedUsers)}>➖</button>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginLeft: '20px', backgroundColor: '#f8f9fa', minWidth: '300px', textAlign: 'left' }}>
                    <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px', color: '#333' }}>Selected Users</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Email</th>
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Emp ID</th>
                                {/* <th style={{ padding: '10px', border: '1px solid #ccc' }}>Last Name</th> */}
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movedUsers.map(user => (
                                <tr key={user.email}>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.email}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.EmpID}</td>
                                    {/* <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.lastName}</td> */}
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                        <button style={{ cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '5px' }} onClick={() => handleRemoveUser(user)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {movedUsers && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', alignItems: 'center' }}>
                    <button style={{ fontSize: '18px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>Import Selected Users</button>
                </div>
            )}
        </div>
    );
};

export default BackendAPIExample;
