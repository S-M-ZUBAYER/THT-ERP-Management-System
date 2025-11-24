import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/UserContext';
import UserList from './UserList';

const User = () => {
    const [users, setUsers] = useState([]);

  // Fetch user list from the backend
  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="app">
      <UserList users={users} />
      {/* Other components for conversation view, message input, etc. */}
    </div>
  );
};

export default User;