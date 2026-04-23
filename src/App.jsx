import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [editingId, setEditingId] = useState(null)

  // CHANGE THIS TO YOUR RAILWAY URL AFTER DEPLOYMENT
  const API_URL = 'backend-production-088d.up.railway.app/api/items'

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL)
      setItems(res.data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form)
        setEditingId(null)
      } else {
        await axios.post(API_URL, form)
      }
      setForm({ name: '', description: '', price: '' })
      fetchItems()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item._id)
    setForm({ name: item.name, description: item.description, price: item.price })
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchItems()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div className="App">
      <h1>MERN CRUD App</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Item</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '' }) }}>Cancel</button>}
      </form>

      <div className="items-list">
        {items.map(item => (
          <div key={item._id} className="item-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
