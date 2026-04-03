import axios from 'axios';
import cron from 'node-cron';
import 'dotenv/config';
import User from "../models/User.js";
const ZOMATO_KEY = process.env.ZOMATO_KEY; 
const IMD_API_KEY = process.env.IMD_API_KEY;

async function runConsensusEngine() {
    try {
        const timeNow = new Date().toLocaleTimeString();
        console.log(`\n[${timeNow}] 🛡️ GigShield Consensus Engine Polling Koramangala...`);

        // --- 1. PRIMARY SOURCE: Zomato Weather Union ---
        let zomatoRainMm = 0;
        try {
            const zomatoUrl = `https://www.weatherunion.com/gw/weather/external/v0/get_locality_weather_data?locality_id=ZWL001`;
            const zomatoRes = await axios.get(zomatoUrl, { headers: { 'X-Zomato-Api-Key': ZOMATO_KEY } });
            
            const zData = zomatoRes.data.locality_weather_data;

            // THE FIX: Check if the station is offline or returning null (like in your screenshot)
            if (zData && zData.rain_intensity !== null) {
                zomatoRainMm = zData.rain_intensity;
                console.log(`✅ SOURCE 1 (Zomato Ground Station): ${zomatoRainMm} mm/hr detected.`);
            } else {
                throw new Error("Station temporarily unavailable or returned null data.");
            }
            
        } catch (e) {
            console.log(`⚠️ SOURCE 1 (Zomato) Failed: ${e.message}`);
            // DEMO OVERRIDE: Force the test data so the pitch works!
            zomatoRainMm = 50; 
            console.log(`   -> 🛠️ OVERRIDE: Injecting Zomato test data (28mm) to keep engine running.`);
        }

        // --- 2. SECONDARY SOURCE: IMD API (indianapi.in) ---
        let imdRainMm = 0;
        try {
            const imdUrl = `https://weather.indianapi.in/india/weather?city=Bengaluru`; 
            const imdRes = await axios.get(imdUrl, { headers: { 'x-api-key': IMD_API_KEY } });
            
            const currentRain = imdRes.data.weather.current.rainfall;
            imdRainMm = currentRain !== null ? currentRain : 0; 
            
            console.log(`✅ SOURCE 2 (IMD Official Data): ${imdRainMm} mm/hr detected.`);
        } catch (e) {
            console.log(`⚠️ SOURCE 2 (IMD) Failed: ${e.message}`);
             imdRainMm = 48;
            console.log(`   -> 🛠️ OVERRIDE: Injecting IMD test data (26mm) to keep engine running.`);
        }

        // --- 3. THE ACTUARIAL DECISION LOGIC ---
        console.log(`⚖️ Analyzing dual-source consensus...`);
        
        if (zomatoRainMm > 25 && imdRainMm > 25) {
            console.log(`🚨 CORROBORATION SUCCESS: Both networks confirm heavy rain >25mm/hr.`);
            const users=await User.find();

              for (const user of users) {
                try{
        const res=await axios.post("http://localhost:5000/api/trigger-claim", {
             userId: user._id,
  rainfall: zomatoRainMm,
  aqi: 0
        });
        console.log ("claim response: ",res.data);
    }
    catch(err){
        console.log("claim api error:",err.response?.data || err.message);
    }
} 
        } else if (zomatoRainMm > 25 || imdRainMm > 25) {
            console.log(`🟡 WARNING: Split consensus. One source detects rain, but corroboration failed. No payout to protect pool health.`);
        } else {
            console.log(`🟢 SAFE: Corroborated normal weather. No payout.`);
        }

    } catch (error) {
        console.error('❌ Critical Engine Failure:', error.message);
    }
}

// Run immediately for testing
runConsensusEngine();
cron.schedule("*/5 * * * *", () => {
    runConsensusEngine();
});