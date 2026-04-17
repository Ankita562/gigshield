import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { API_BASE } from "../../config";

// --- ENTERPRISE TYPESCRIPT INTERFACES ---

interface FraudAlert {
  claimId: string;
  score: number;
  status: string;
  reasons: string[];
}

interface ZoneRisk {
  name: string;
  risk: string; // E.g., 'High', 'Medium', 'Low'
  policies: number;
}

interface ClaimsSummary {
  triggered: number;
  paid: number;
  approved: number;
  flagged: number;
}

interface WeeklyDataPoint {
  name: string;
  claims: number;
}

interface DashboardData {
  activePolicies: number;
  premiumPool: number;
  maxExposure: number;
  lossRatio: number;
  weeklyData: WeeklyDataPoint[];
  claimsSummary: ClaimsSummary;
  zoneRisk: ZoneRisk[];
  fraudAlerts: FraudAlert[];
}

function AdminDashboard() {
  const [engineStatus, setEngineStatus] = useState('Standby... Awaiting manual trigger.');
  const [payoutTriggered, setPayoutTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simMode, setSimMode] = useState('live');

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    activePolicies: 0,
    premiumPool: 0,
    maxExposure: 0,
    lossRatio: 0,
    weeklyData: [],
    claimsSummary: { triggered: 0, paid: 0, approved: 0, flagged: 0 },
    zoneRisk: [],
    fraudAlerts: [] 
  });

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const runActuarialCheck = async () => {
    setIsLoading(true);
    setEngineStatus('Polling Triple-Threat Consensus Engine...');
    
    try {
      const response = await fetch(`${API_BASE}/api/weather/check?mode=${simMode}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const timeNow = new Date().toLocaleTimeString();

      if (data.payout === true) {
        // Dynamically pull the number of affected workers
        const affectedWorkers = dashboardData.activePolicies || "all active";
        
        setEngineStatus(`🚨 MAJORITY CONSENSUS SUCCESS: 2/3 Nodes confirmed heavy rain.\nMass Payout Event Triggered: Auto-executing smart contracts for ${affectedWorkers} workers based on their plan tiers. — ${timeNow}\nAudit Log: ZWL004645 + IMD-BLR + OpenMeteo confirmed`);
        setPayoutTriggered(true);
      } else {
        setEngineStatus(`🟢 SAFE: Corroborated normal weather. Payout blocked.\nAudit Log: ZWL004645 + IMD-BLR + OpenMeteo confirmed — ${timeNow}`);
        setPayoutTriggered(false);
      }
      
      // Refresh the dashboard stats after a successful check to show the chart move!
      await fetchDashboardData(); 
      
    } catch (error) {
      setEngineStatus('⚠️ Engine connection failed. Is the Node.js server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* Header */}
      <header className="mb-8 border-b pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🛡️ GigKavach Admin & Actuarial Inspector</h1>
          <p className="text-gray-500">Live system monitoring and algorithmic compliance dashboard.</p>
        </div>
        
        {/* NEW: Weather Control Panel */}
        <div className="flex items-center gap-3 bg-white p-2 rounded shadow border border-gray-200">
          <span className="text-sm font-bold text-gray-600">Simulate:</span>
          <select 
            value={simMode} 
            onChange={(e) => setSimMode(e.target.value)}
            className="border-gray-300 rounded text-sm p-1 cursor-pointer bg-gray-50"
          >
            <option value="live">📡 Live Network (Fetch Real APIs)</option>
            <option value="rain">⛈️ Force Simulation: Heavy Rain</option>
            <option value="clear">☀️ Force Simulation: Clear Skies</option>
          </select>
          <button 
            onClick={runActuarialCheck}
            disabled={isLoading}
            className={`${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded font-bold transition-all text-sm`}
          >
            {isLoading ? 'Running...' : 'Run Engine'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* SECTION 1: Actuarial Pool Health + Graph */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-4">📊 Actuarial Pool Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Active Policies</span>
              <span className="font-bold text-gray-800">{(dashboardData.activePolicies || 0)} Workers</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Weekly Premium Pool</span>
              <span className="font-bold text-green-600">₹{(dashboardData.premiumPool || 0).toLocaleString()}</span>
            </div>
            <div className="border-b pb-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Max Actuarial Exposure</span>
                <span className="font-bold text-red-600">₹{(dashboardData.maxExposure || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="pt-2 relative group">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 font-semibold">Current Loss Ratio</span>
                <span className="font-bold text-blue-600">{dashboardData.lossRatio}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div className={`h-2.5 rounded-full transition-all duration-500 ${Number(dashboardData.lossRatio) > 60 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(Number(dashboardData.lossRatio), 100)}%` }}></div>
              </div>
              <p className={`text-xs font-bold mt-1 ${Number(dashboardData.lossRatio) <= 60 ? 'text-green-600' : Number(dashboardData.lossRatio) <= 100 ? 'text-orange-500' : 'text-red-600 animate-pulse'}`}>{Number(dashboardData.lossRatio) <= 60 ? '[HEALTHY] Industry safe zone: <60%' : Number(dashboardData.lossRatio) <= 100 ? '[WARNING] Approaching maximum exposure!' : '[CRITICAL] Fund Depleted - Insolvency Risk!'}</p>
            </div>

            {/* LIVE RECHARTS GRAPH */}
            <div className="pt-4 mt-2 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-2">Claim Frequency (Last 7 Days)</p>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.weeklyData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="3 3" />
                    <Bar dataKey="claims" fill={payoutTriggered ? "#ef4444" : "#3b82f6"} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Live Engine Feed */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 lg:col-span-2 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📡 Live Engine Feed & Audit Trail</h2>
          <div className="bg-gray-900 p-4 rounded font-mono text-sm flex-grow flex flex-col justify-start border border-gray-700">
            <p className="text-gray-500 mb-2">// Zomato Weather Union (ZWL004645) ... [Active]</p>
            <p className="text-gray-500 mb-2">// IMD IRDAI Node (IMD-BLR) ... [Active]</p>
            <p className="text-gray-500 mb-4">// Open-Meteo Satellite (12.93, 77.62) ... [Active]</p>
            <pre className={`whitespace-pre-wrap ${payoutTriggered ? "text-red-400 font-bold" : "text-green-400"}`}>
               {engineStatus}
            </pre>
          </div>
        </div>
      </div>

      {/* Bottom Row: Dynamic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Claims Summary */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Claims This Week</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-gray-600">Claims Triggered:</span> <span className="font-bold">{dashboardData.claimsSummary.triggered}</span></li>
            <li className="flex justify-between"><span className="text-gray-600">Total Paid Out:</span> <span className="font-bold text-red-600">₹{(dashboardData.claimsSummary.paid || 0).toLocaleString()}</span></li>
            <li className="flex justify-between"><span className="text-gray-600">Auto-Approved:</span> <span className="font-bold text-green-600">{dashboardData.claimsSummary.approved}</span></li>
            <li className="flex justify-between pt-2 border-t"><span className="text-gray-600">Fraud Flagged:</span> <span className="font-bold text-orange-500">{dashboardData.claimsSummary.flagged} (under review)</span></li>
          </ul>
        </div>

        {/* NEW: Live Fraud Engine Decisions (Replaces static compliance) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🚨 Live Fraud Engine</h2>
          <div className="space-y-3 overflow-y-auto h-40 pr-2">
            {dashboardData.fraudAlerts.map((alert, idx) => (
              <div key={idx} className={`p-3 rounded border-l-4 text-xs ${alert.score > 80 ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{alert.claimId}</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full ${alert.score > 80 ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>Score: {alert.score}</span>
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-gray-500">Signals: </span>
                  {alert.reasons.join(" • ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Risk Heat */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📍 Zone Risk Heat</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="pb-2">Zone</th>
                <th className="pb-2">Risk</th>
                <th className="pb-2 text-right">Policies</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.zoneRisk.map((zone, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-2">{zone.name}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                      ${zone.risk === 'High' ? 'bg-red-100 text-red-800' : 
                        zone.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {zone.risk}
                    </span>
                  </td>
                  <td className="py-2 text-right font-bold">{zone.policies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;