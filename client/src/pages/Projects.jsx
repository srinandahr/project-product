import React, { useEffect, useState } from 'react';
import API from '../api/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ type: 'Project', name: '', techStack: '', status: 'Ongoing', progress: 0, link: '', notes: '' });

  const fetchProjects = async () => {
    const res = await API.get('/projects');
    setProjects(res.data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { ...form, techStack: form.techStack.split(',').map(t => t.trim()), progress: Number(form.progress) };
    await API.post('/projects', payload);
    setForm({ type: 'Project', name: '', techStack: '', status: 'Ongoing', link: '', notes: '' });
    fetchProjects();
  };

  const handleDelete = async id => {
    await API.delete(`/projects/${id}`);
    fetchProjects();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-purple-800">Projects & Certifications</h1>

      <form className="bg-white p-4 rounded-lg shadow-md mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="p-2 border rounded" name="type" value={form.type} onChange={handleChange}>
            <option>Project</option>
            <option>Certification</option>
          </select>
          <input className="p-2 border rounded" placeholder="Name" name="name" value={form.name} onChange={handleChange} required />
          <input className="p-2 border rounded" placeholder="Tech Stack (comma separated)" name="techStack" value={form.techStack} onChange={handleChange} />
          <input className="p-2 border rounded" type="number" min="0" max="100" placeholder="Progress (0-100)" name="progress" value={form.progress} onChange={handleChange} />

          <select className="p-2 border rounded" name="status" value={form.status} onChange={handleChange}>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
          <input className="p-2 border rounded" placeholder="Link" name="link" value={form.link} onChange={handleChange} />
          <input className="p-2 border rounded" placeholder="Notes" name="notes" value={form.notes} onChange={handleChange} />
        </div>
        <button className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">Add Project</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(proj => (
          <div key={proj.id} className="bg-white p-4 rounded-lg shadow hover:scale-105 transition-transform">
            <h2 className="font-bold text-lg">{proj.name}</h2>
            <p className="text-sm">{proj.type}</p>
            <p className="text-sm">Tech: {proj.techStack.join(', ')}</p>
            <p className="text-sm">Status: <span className={`font-semibold ${proj.status==='Completed'?'text-green-800':'text-yellow-800'}`}>{proj.status}</span></p>
            <a href={proj.link} target="_blank" className="text-blue-500 underline text-sm">Link</a>
            <p className="text-sm">{proj.notes}</p>
            <button onClick={() => handleDelete(proj.id)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
