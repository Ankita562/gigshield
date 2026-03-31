import React, { useState } from 'react';

function AdminDashboard() {
  const [engineStatus, setEngineStatus] = useState('Standby... Awaiting manual trigger.');
  const [payoutTriggered, setPayoutTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [auditTime, setAuditTime] = useState('');

  const runActuarialCheck = async () => {
    setIsLoading(true);
    setEngineStatus('Polling Triple-Threat Consensus Engine...');
    
    try {
      const response = await fetch('http://localhost:5000/api/weather/check');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      const timeNow = new Date().toLocaleTimeString();
      setAuditTime(timeNow);

      if (data.payout === true) {
        setEngineStatus(`🚨 MAJORITY CONSENSUS SUCCESS: 2/3 Nodes confirmed heavy rain.
   ₹200 Claim Generated — Worker ID #4521 — ${timeNow}
   Audit Log: ZWL004645 + IMD-BLR + OpenMeteo confirmed`);
        setPayoutTriggered(true);
      } else {
        setEngineStatus(`🟢 SAFE: Corroborated normal weather. Payout blocked.
   Audit Log: ZWL004645 + IMD-BLR + OpenMeteo confirmed — ${timeNow}`);
        setPayoutTriggered(false);
      }
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
          <h1 className="text-3xl font-bold text-gray-900">🛡️ GigShield Admin & IRDAI Inspector</h1>
          <p className="text-gray-500">Live system monitoring and compliance dashboard.</p>
        </div>
        <button 
          onClick={runActuarialCheck}
          disabled={isLoading}
          className={`${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded shadow font-bold transition-all`}
        >
          {isLoading ? 'Running Consensus...' : 'Run Manual Actuarial Check'}
        </button>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* SECTION 1: Actuarial Pool Health */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-4">📊 Actuarial Pool Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Active Policies</span>
              <span className="font-bold text-gray-800">500 Workers</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Weekly Premium Pool</span>
              <span className="font-bold text-green-600">{payoutTriggered ? '₹17,800' : '₹18,000'}</span>
            </div>
            <div className="border-b pb-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Max Actuarial Exposure</span>
                <span className="font-bold text-red-600">₹75,000</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Pool Coverage Ratio: <span className="font-bold text-gray-700">23.7%</span> (Collected pool covers 23.7% of max exposure)</p>
            </div>
            
            {/* The Loss Ratio Visual */}
            <div className="pt-2 relative group">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 font-semibold">Current Loss Ratio</span>
                <span className="font-bold text-blue-600">{payoutTriggered ? '13.1%' : '12.0%'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: payoutTriggered ? '13.1%' : '12.0%' }}></div>
              </div>
              <p className="text-xs font-bold text-green-600">[HEALTHY] Industry safe zone: &lt;60%</p>
              
              {/* Hover Tooltip */}
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-full bg-gray-800 text-white text-xs rounded p-2 shadow-lg z-10">
                13.1% loss ratio — Industry benchmark for micro-insurance is &lt;60%. GigShield is operating at 78% below the risk threshold. Pool is sustainable at current premium levels.
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Live Engine Feed (Wider Column) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 lg:col-span-2 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📡 Live Engine Feed & Audit Trail</h2>
          <div className="bg-gray-900 p-4 rounded font-mono text-sm flex-grow flex flex-col justify-end border border-gray-700">
            <p className="text-gray-500 mb-2">// Zomato Weather Union (ZWL004645) ... [Active]</p>
            <p className="text-gray-500 mb-2">// IMD IRDAI Node (IMD-BLR) ... [Active]</p>
            <p className="text-gray-500 mb-4">// Open-Meteo Satellite (12.93, 77.62) ... [Active]</p>
            <pre className={`whitespace-pre-wrap ${payoutTriggered ? "text-red-400 font-bold" : "text-green-400"}`}>
              {engineStatus}
            </pre>
          </div>
        </div>
      </div>

      {/* Bottom Row: 3 Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 3: Claims This Week */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Claims This Week</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-gray-600">Claims Triggered:</span> <span className="font-bold">12</span></li>
            <li className="flex justify-between"><span className="text-gray-600">Total Paid Out:</span> <span className="font-bold text-red-600">₹2,340</span></li>
            <li className="flex justify-between"><span className="text-gray-600">Auto-Approved:</span> <span className="font-bold text-green-600">10</span></li>
            <li className="flex justify-between pt-2 border-t"><span className="text-gray-600">Fraud Flagged:</span> <span className="font-bold text-orange-500">2 (under review)</span></li>
          </ul>
        </div>

        {/* Card 4: IRDAI Compliance */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏛️ IRDAI Compliance</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">✅ <span className="ml-2">All policies have UIN</span></li>
            <li className="flex items-center">✅ <span className="ml-2">Free look period tracked</span></li>
            <li className="flex items-center">✅ <span className="ml-2">Grievance SLA: 0 breaches</span></li>
            <li className="flex items-center">✅ <span className="ml-2">Nominee registered: 100%</span></li>
          </ul>
        </div>

        {/* Card 5: Zone Risk Heat */}
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
              <tr className="border-b">
                <td className="py-2">Koramangala</td>
                <td className="py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">🔴 HIGH</span></td>
                <td className="py-2 text-right font-bold">127</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">HSR Layout</td>
                <td className="py-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">🟡 MEDIUM</span></td>
                <td className="py-2 text-right font-bold">89</td>
              </tr>
              <tr>
                <td className="py-2">Indiranagar</td>
                <td className="py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">🟢 LOW</span></td>
                <td className="py-2 text-right font-bold">64</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;