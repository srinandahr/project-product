import React, { useEffect, useState } from 'react';
import API from '../api/api';

const ProjectsOverview = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Projects & Certifications</h2>
      <ul className="space-y-2">
        {projects.map((proj, index) => (
          <li key={index} className="flex justify-between items-center p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 shadow-sm">
            <span className="font-medium">{proj.name}</span>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
              proj.status === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
            }`}>
              {proj.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
    
  );
};

export default ProjectsOverview;
