import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { FaTasks, FaCertificate } from 'react-icons/fa';

function ProgressBar({ pct, color = 'bg-yellow-500' }) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-3 ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ProjectsQuestList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await API.get('/projects');
      setItems(res.data || []);
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FaTasks className="text-pink-600" />
        <h2 className="text-lg font-bold">Quests — Projects & Certifications</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(p => {
          const pct = Math.min(100, Math.max(0, p.progress ?? (p.status === 'Completed' ? 100 : 50)));
          const Icon = p.type === 'Certification' ? FaCertificate : FaTasks;
          
          return (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:scale-[1.01] transition">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={p.type === 'Certification' ? 'text-amber-600' : 'text-indigo-600'} />
                  <h3 className="font-semibold">{p.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold
                  ${p.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {p.status}
                </span>
              </div>
              {p.techStack?.length ? (
                <p className="text-xs text-gray-600 mb-2">Tech: {p.techStack.join(', ')}</p>
              ) : null}
              <ProgressBar pct={pct} color={p.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'} />
              {p.link ? (
                <a className="inline-block mt-3 text-sm text-blue-600 underline" href={p.link} target="_blank">
                  View
                </a>
              ) : null}
            </div>
          );
        })}
        {items.length === 0 && <p className="text-sm text-gray-600">No quests yet. Add a Project/Certification.</p>}
      </div>
    </div>
  );
}
