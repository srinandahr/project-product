import React, { useEffect, useState } from 'react';
import API from '../api/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    companyName: '',
    jobLink: '',
    role: '',
    location: '',
    status: 'Applied',
    notes: ''
  });

  const fetchJobs = async () => {
    const res = await API.get('/jobs');
    setJobs(res.data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/jobs', form);
    setForm({ companyName: '', jobLink: '', role: '', location: '', status: 'Applied', notes: '' });
    fetchJobs();
  };

  const handleDelete = async id => {
    await API.delete(`/jobs/${id}`);
    fetchJobs();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-purple-800">Jobs Tracker</h1>

      {/* Form to add job */}
      <form className="bg-white p-4 rounded-lg shadow-md mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-2 border rounded" placeholder="Company Name" name="companyName" value={form.companyName} onChange={handleChange} required />
          <input className="p-2 border rounded" placeholder="Job Role" name="role" value={form.role} onChange={handleChange} />
          <input className="p-2 border rounded" placeholder="Job Link" name="jobLink" value={form.jobLink} onChange={handleChange} />
          <input className="p-2 border rounded" placeholder="Location" name="location" value={form.location} onChange={handleChange} />
          <select className="p-2 border rounded" name="status" value={form.status} onChange={handleChange}>
            <option>Applied</option>
            <option>Callback</option>
            <option>Interviewed</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <input className="p-2 border rounded" placeholder="Notes" name="notes" value={form.notes} onChange={handleChange} />
        </div>
        <button className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">Add Job</button>
      </form>

      {/* Jobs list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-4 rounded-lg shadow hover:scale-105 transition-transform">
            <h2 className="font-bold text-lg">{job.companyName}</h2>
            <p className="text-sm">{job.role}</p>
            <p className="text-sm">{job.location}</p>
            <p className="text-sm">Status: <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
  job.status === 'Applied' ? 'bg-blue-200 text-blue-800' :
  job.status === 'Callback' ? 'bg-purple-200 text-purple-800' :
  job.status === 'Interviewed' ? 'bg-yellow-200 text-yellow-800' :
  job.status === 'Offer' ? 'bg-green-200 text-green-800' :
  'bg-red-200 text-red-800'
}`}>
  {job.status}
</span>
</p>
            <p className="text-sm">{job.notes}</p>
            <a href={job.jobLink} target="_blank" className="text-blue-500 underline text-sm">Link</a>
            <button onClick={() => handleDelete(job.id)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
