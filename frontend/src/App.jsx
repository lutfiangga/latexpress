import React, { useState, useEffect } from 'react'

const App = () => {
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/users')
      const data = await response.json()
      setUsers(data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      })
      const data = await response.json()
      setUsers([...users, data.data])
      setUsername('')
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const editUser = async id => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      })
      const data = await response.json()
      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, username: data.data.username } : user
      )
      setUsers(updatedUsers)
      setUsername('')
      setEditingId(null)
    } catch (error) {
      console.error('Error editing user:', error)
    }
  }

  const deleteUser = async id => {
    try {
      await fetch(`http://localhost:3001/api/v1/users/${id}`, {
        method: 'DELETE'
      })
      const filteredUsers = users.filter(user => user.id !== id)
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <div>
      <h1>USER LIST</h1>
      <input
        type='text'
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={() => (editingId ? editUser(editingId) : addUser())}>
        {editingId ? 'Edit User' : 'Add User'}
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingId === user.id ? (
                  <input
                    type='text'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <button onClick={() => editUser(user.id)}>Save</button>
                ) : (
                  <button onClick={() => setEditingId(user.id)}>Edit</button>
                )}
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
