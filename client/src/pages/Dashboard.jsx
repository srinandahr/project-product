// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import API from '../api/api';
import XPHeader from '../components/XPHeader';
import JobsFlipCard from '../components/JobsFlipCard';
import DsaProgressGrid from '../components/DsaProgressGrid';
import ProjectsQuestList from '../components/ProjectsQuestList';
import JobsByLocation from '../components/JobsByLocation';
import { computeStreak } from '../utils/activityStreak';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [dsa, setDsa] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      const [j, d, p] = await Promise.all([
        API.get('/jobs'),
        API.get('/dsas'),
        API.get('/projects')
      ]);
      setJobs(j.data || []);
      setDsa(d.data || []);
      setProjects(p.data || []);
    })();
  }, []);

  // XP weights: Jobs = 50%, DSA = 25%, Projects = 25%
  const totalXP = useMemo(() => {
    // base scoring (same as earlier but raw points)
    const jobRaw = jobs.reduce((acc, j) => acc +
      (j.status === 'Applied' ? 5 :
       j.status === 'Callback' ? 15 :
       j.status === 'Interviewed' ? 25 :
       j.status === 'Offer' ? 60 :
       0), 0);

    const dsaRaw = dsa.reduce((acc, i) => acc + (i.status === 'Completed' ? 2 : 0), 0);
    const projRaw = projects.reduce((acc, p) => acc + (p.status === 'Completed' ? 20 : 5), 0);

    // Normalize raw scores to weighted final XP:
    // We compute proportions then apply weights.
    const totalRaw = jobRaw + dsaRaw + projRaw || 1;
    const jobScore = (jobRaw / totalRaw) * 100; // relative 0-100 scale
    const dsaScore = (dsaRaw / totalRaw) * 100;
    const projScore = (projRaw / totalRaw) * 100;

    // Apply weights: Jobs 50%, dsa 25%, proj 25%
    const weighted = jobScore * 0.5 + dsaScore * 0.25 + projScore * 0.25;

    // Scale weighted to XP points (e.g., multiply by 10 to let levels accumulate)
    return Math.round(weighted * 10);
  }, [jobs, dsa, projects]);

  // Compute streak from activity dates: collect dateApplied, dateCompleted, projects.updatedAt/createdAt
  const streakDays = useMemo(() => {
    const dates = [];
    jobs.forEach(j => j.dateApplied && dates.push(j.dateApplied));
    dsa.forEach(d => d.dateCompleted && dates.push(d.dateCompleted));
    projects.forEach(p => p.updatedAt && dates.push(p.updatedAt));
    projects.forEach(p => p.createdAt && dates.push(p.createdAt));
    return computeStreak(dates);
  }, [jobs, dsa, projects]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <XPHeader totalXP={totalXP} streakDays={streakDays} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1"><JobsFlipCard /></div>
          <div className="col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <DsaProgressGrid />
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <ProjectsQuestList />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <JobsByLocation />
          {/* you can add another chart or activity feed here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
            <span className="font-semibold">Applications Sent</span>
            <span className="text-purple-700 font-extrabold text-xl">{jobs.length}</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
            <span className="font-semibold">DSA Completed</span>
            <span className="text-emerald-700 font-extrabold text-xl">
              {dsa.filter(i => i.status === 'Completed').length}
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
            <span className="font-semibold">Quests Done</span>
            <span className="text-amber-700 font-extrabold text-xl">
              {projects.filter(p => p.status === 'Completed').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
