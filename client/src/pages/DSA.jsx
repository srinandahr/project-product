import React, { useEffect, useState } from 'react';
import API from '../api/api';

const DSA = () => {
  const [dsa, setDsa] = useState([]);
  const [form, setForm] = useState({ topic: '', problem: '', platform: '', status: 'Not Started' });

  const fetchDSA = async () => {
    const res = await API.get('/dsas');
    setDsa(res.data);
  };

  useEffect(() => { fetchDSA(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/dsas', form);
    setForm({ topic: '', problem: '', platform: '', status: 'Not Started' });
    fetchDSA();
  };

  const handleDelete = async id => {
    await API.delete(`/dsas/${id}`);
    fetchDSA();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-purple-800">DSA Tracker</h1>

      <form className="bg-white p-4 rounded-lg shadow-md mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-2 border rounded" placeholder="Topic" name="topic" value={form.topic} onChange={handleChange} required />
          <input className="p-2 border rounded" placeholder="Problem" name="problem" value={form.problem} onChange={handleChange} />
          <input className="p-2 border rounded" placeholder="Platform" name="platform" value={form.platform} onChange={handleChange} />
          <select className="p-2 border rounded" name="status" value={form.status} onChange={handleChange}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <button className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">Add Problem</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dsa.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow hover:scale-105 transition-transform">
            <h2 className="font-bold text-lg">{item.topic}</h2>
            <p className="text-sm">{item.problem}</p>
            <p className="text-sm">{item.platform}</p>
            <p className="text-sm">Status: <span className="font-semibold">{item.status}</span></p>
            <button onClick={() => handleDelete(item.id)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSA;
