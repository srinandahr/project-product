// src/components/JobsByLocation.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function JobsByLocation() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await API.get('/jobs');
      const map = {};
      (res.data || []).forEach(j => {
        const loc = j.location || 'Unknown';
        map[loc] = (map[loc] || 0) + 1;
      });
      const chartData = Object.entries(map).map(([location, count]) => ({ location, count }));
      setData(chartData);
    })();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h3 className="font-semibold mb-2">Jobs by Location</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
