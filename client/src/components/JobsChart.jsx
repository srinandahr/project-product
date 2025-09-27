import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/api';

const JobsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await API.get('/jobs');
        // Count jobs by status
        const statusCount = {};
        jobs.data.forEach(job => {
          statusCount[job.status] = (statusCount[job.status] || 0) + 1;
        });
        const chartData = Object.keys(statusCount).map(status => ({
          name: status,
          value: statusCount[status],
        }));
        setData(chartData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#d0ed57'];

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Job Applications</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JobsChart;
