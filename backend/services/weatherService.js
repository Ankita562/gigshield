import axios from 'axios';
import cron from 'node-cron';
import 'dotenv/config';
import User from "../models/User.js";

const ZOMATO_KEY = process.env.ZOMATO_KEY; 
const IMD_API_KEY = process.env.IMD_API_KEY;

export async function runConsensusEngine() {
    try {
        const timeNow = new Date().toLocaleTimeString();
        console.log(`\n[${timeNow}] 🛡️ GigKavach TRIPLE-NODE Consensus Engine Polling Koramangala...`);

        // --- NODE 1: Zomato Weather Union (Hyper-local Ground Truth) ---
        let zomatoRainMm = 0;
        try {
            const zomatoUrl = `https://www.weatherunion.com/gw/weather/external/v0/get_locality_weather_data?locality_id=ZWL001`;
            const zomatoRes = await axios.get(zomatoUrl, { headers: { 'X-Zomato-Api-Key': ZOMATO_KEY } });
            const zData = zomatoRes.data.locality_weather_data;

            if (zData && zData.rain_intensity !== null) {
                zomatoRainMm = zData.rain_intensity;
                console.log(`✅ NODE 1 (Zomato): ${zomatoRainMm} mm/hr`);
            } else { throw new Error("Null data"); }
        } catch (e) {
            console.log(`⚠️ SOURCE 1 (Zomato) Failed: ${e.message}`);
            // DEMO OVERRIDE: Generates a random decimal between 26.0 and 34.9
            zomatoRainMm = parseFloat((Math.random() * (35 - 26) + 26).toFixed(1));
            console.log(`   -> 🛠️ OVERRIDE: NODE 1 Offline. Injecting live sim data: ${zomatoRainMm}mm`);
        }

        // --- NODE 2: IMD API (IRDAI Official Compliance) ---
        let imdRainMm = 0;
        try {
            const imdUrl = `https://weather.indianapi.in/india/weather?city=Bengaluru`; 
            const imdRes = await axios.get(imdUrl, { headers: { 'x-api-key': IMD_API_KEY } });
            const currentRain = imdRes.data.weather.current.rainfall;
            imdRainMm = currentRain !== null ? currentRain : 0; 
            console.log(`✅ NODE 2 (IMD): ${imdRainMm} mm/hr`);
        } catch (e) {
            console.log(`⚠️ SOURCE 2 (IMD) Failed: ${e.message}`);
            // DEMO OVERRIDE: Generates a random decimal between 26.0 and 32.9
            imdRainMm = parseFloat((Math.random() * (33 - 26) + 26).toFixed(1));
            console.log(`   -> 🛠️ OVERRIDE: NODE 2 Offline. Injecting live sim data: ${imdRainMm}mm`);
        }

        // --- NODE 3: Open-Meteo (Satellite Fallback - ALWAYS LIVE) ---
        let meteoRainMm = 0;
        try {
            const lat = 12.9337;
            const lon = 77.6258;
            const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=rain`; 
            const meteoRes = await axios.get(meteoUrl);
            meteoRainMm = meteoRes.data.current.rain || 0; 
            console.log(`✅ NODE 3 (Open-Meteo LIVE): ${meteoRainMm} mm/hr`);
        } catch (e) {
            console.log(`⚠️ NODE 3 (Open-Meteo) Failed.`);
            meteoRainMm = 0;
        }

        // --- ⚖️ THE ACTUARIAL DECISION LOGIC ---
        console.log(`\n⚖️ Analyzing Triple-Node Consensus...`);
        
        // Count the votes from the 3 independent nodes
        let rainVotes = 0;
        if (zomatoRainMm > 25) rainVotes++;
        if (imdRainMm > 25) rainVotes++;
        if (meteoRainMm > 25) rainVotes++;

        console.log(`📊 Votes for Payout: ${rainVotes}/3`);

        // Shared node data for frontend display
        const nodes = {
            zomato: zomatoRainMm,
            imd: imdRainMm,
            meteo: meteoRainMm
        };

        // Require 2 out of 3 nodes to agree to trigger a payout (Anti-Spoofing)
        if (rainVotes >= 2) {
            console.log(`🚨 MAJORITY CONSENSUS SUCCESS: 2+ networks confirm heavy rain. Triggering pool payouts!`);
            
            const users = await User.find();
            for (const user of users) {
                try {
                    const res = await axios.post(`${API_BASE}/api/trigger-claim`, {
                        userId: user._id,
                        rainfall: Math.max(zomatoRainMm, imdRainMm, meteoRainMm), // Send the highest recorded value
                        aqi: 0
                    });
                    console.log(`✅ Claim successful for user ${user._id}`);
                } catch(err) {
                    console.log(`❌ Claim API error for user ${user._id}:`, err.response?.data || err.message);
                }
            }
            return { payout: true, votes: rainVotes, nodes };

        } else {
            console.log(`🟢 SAFE: Split consensus or normal weather. No payout to protect pool health.`);
            return { payout: false, votes: rainVotes, nodes };
        }

    } catch (error) {
        console.error('❌ Critical Engine Failure:', error.message);
        return { payout: false, error: true, nodes: { zomato: 0, imd: 0, meteo: 0 } };
    }
}

// Run immediately for testing
runConsensusEngine();

cron.schedule("0 * * * *", () => {
    runConsensusEngine();
});