import axios from 'axios';
import cron from 'node-cron';
import 'dotenv/config';
import Policy from "../models/Policy.js";
import User from "../models/User.js";
const API_BASE = process.env.RENDER_EXTERNAL_URL || `http://127.0.0.1:${process.env.PORT || 5000}`;

const ZOMATO_KEY = process.env.ZOMATO_KEY; 
const IMD_API_KEY = process.env.IMD_API_KEY;

export async function runConsensusEngine(mode = 'live') {
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

        // --- NODE 4: AQICN (Severe Pollution Tracker) ---
        let actualAqi = 0;
        try {
            // Using the 'demo' token for hackathon speed
            const aqiToken = process.env.AQICN_TOKEN || "demo"; 
            const lat = 12.9337;
            const lon = 77.6258;
            const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${aqiToken}`;
            const aqiRes = await axios.get(aqiUrl);
            actualAqi = aqiRes.data.data.aqi || 0;
            console.log(`✅ NODE 4 (AQICN LIVE): AQI ${actualAqi}`);
        } catch (e) {
            console.log(`⚠️ NODE 4 (AQICN) Failed: ${e.message}`);
            // DEMO OVERRIDE: Generates a normal AQI around 80. 
            // Change this to 315 when recording your demo video to force a payout!
            actualAqi = 80; 
            console.log(`   -> 🛠️ OVERRIDE: Injecting live sim data: AQI ${actualAqi}`);
        }

        if (mode === 'rain') {
            console.log("⛈️ SIMULATION OVERRIDE: Forcing massive storm data!");
            zomatoRainMm = 45.2;
            imdRainMm = 42.1;
            meteoRainMm = 44.0;
        } else if (mode === 'clear') {
            console.log("☀️ SIMULATION OVERRIDE: Forcing clear skies!");
            zomatoRainMm = 0;
            imdRainMm = 0;
            meteoRainMm = 0;
        }
        
        // --- ⚖️ THE ACTUARIAL DECISION LOGIC ---
        console.log(`\n⚖️ Analyzing Triple-Node Consensus...`);
        
        let rainVotes = 0;
        if (zomatoRainMm > 25) rainVotes++;
        if (imdRainMm > 25) rainVotes++;
        if (meteoRainMm > 25) rainVotes++;

        console.log(`📊 Votes for Payout: ${rainVotes}/3`);
        const nodes = {
            zomato: zomatoRainMm,
            imd: imdRainMm,
            meteo: meteoRainMm
        };
        const isToxicAir = actualAqi > 300; 

        if (rainVotes >= 2 || isToxicAir) {
            console.log(isToxicAir ? `🚨 SEVERE POLLUTION DETECTED!` : `🚨 HEAVY RAIN DETECTED!`);

            // 1. Only find users who actually HAVE an active policy
            // We "populate" userId to get the full user object if needed
            const activePolicies = await Policy.find({ status: 'active' }).populate('userId');
            
            console.log(`📡 Found ${activePolicies.length} active policies in this zone. Executing...`);

            for (const policy of activePolicies) {
                if (!policy.userId) continue; // Skip if the user account was deleted

                try {
                    // 2. IMPORTANT: Use the field name your route expects (userId)
                    const res = await axios.post(`${API_BASE}/api/trigger-claim`, {
                        workerId: policy.userId._id, // Match the backend 'userId'
                        amountInr: policy.payoutAmount || 200, // Dynamic amount based on plan
                        
                        claimType: isToxicAir ? 'poor_aqi' : 'rain_damage',
                        actualRainfallMm: Math.max(zomatoRainMm, imdRainMm, meteoRainMm), 
                        actualAqi: actualAqi 
                    });
                    
                    console.log(`✅ Payout Successful: ₹${policy.payoutAmount || 200} -> ${policy.userId.name || policy.userId._id}`);
                }  catch(err) {
                    const errorMsg = err.response?.data?.error || err.message;
                    console.log(`❌ Payout Failed: ${errorMsg}`);
                   }
            }
            return { payout: true, votes: rainVotes, aqiTrigger: isToxicAir, nodes };

        } else {
            console.log(`🟢 SAFE: No payout triggered.`);
            return { payout: false, votes: rainVotes, aqiTrigger: false, nodes };
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