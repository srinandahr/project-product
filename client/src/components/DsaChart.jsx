import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/api';

const DsaChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDSA = async () => {
      try {
        const res = await API.get('/dsas');
        // Group by topic
        const topicMap = {};
        res.data.forEach(item => {
          if (!topicMap[item.topic]) topicMap[item.topic] = { Completed: 0, Pending: 0 };
          if (item.status === 'Completed') topicMap[item.topic].Completed += 1;
          else topicMap[item.topic].Pending += 1;
        });
        const chartData = Object.keys(topicMap).map(topic => ({
          name: topic,
          ...topicMap[topic],
        }));
        setData(chartData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDSA();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">DSA Progress</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Completed" fill="#82ca9d" />
          <Bar dataKey="Pending" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DsaChart;
