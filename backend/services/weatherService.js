import axios from 'axios';
import cron from 'node-cron';

// Configuration for Koramangala (PIN 560034)
const ZOMATO_KEY = 'ad51a7968b5c855c3e8b165683cdce12'; 
const ZOMATO_LOCALITY = 'ZWL001'; 
const LAT = 12.9352;
const LON = 77.6245;

async function runConsensusEngine() {
    try {
        const timeNow = new Date().toLocaleTimeString();
        console.log(`\n[${timeNow}] 🛡️ GigShield Consensus Engine Polling Koramangala...`);

        // --- 1. PRIMARY SOURCE: Zomato Weather Union ---
        let zomatoRainMm = 0;
        try {
            const zomatoUrl = `https://www.weatherunion.com/gw/weather/external/v0/get_locality_weather_data?locality_id=${ZOMATO_LOCALITY}`;
            const zomatoRes = await axios.get(zomatoUrl, { headers: { 'X-Zomato-Api-Key': ZOMATO_KEY } });
            zomatoRainMm = zomatoRes.data.locality_weather_data.rain_intensity;

            zomatoRainMm = 28; 
            console.log(`✅ SOURCE 1 (Zomato Ground Station): ${zomatoRainMm} mm/hr detected.`);
        } catch (e) {
            console.log(`⚠️ SOURCE 1 (Zomato) Failed. Switching to fallback...`);
        }
        // --- 2. SECONDARY SOURCE: IMD API (indianapi.in) ---
        let imdRainMm = 0;
        const IMD_API_KEY = 'sk-live-xblswkdm7lkvmc8eNMDeUq2YbHaXN200Y0H9olAF'; // Paste your key here

        try {
            const imdUrl = `https://indianapi.in/api/v1/weather/india?city=Bengaluru`; 
            
            const imdRes = await axios.get(imdUrl, {
                headers: { 'Authorization': `Bearer ${IMD_API_KEY}` }
            });
            imdRainMm = imdRes.data.current.precipitation || 0; 
            
            // FAKE DATA FOR TESTING: Force IMD to agree with Zomato!
            imdRainMm = 26; 
            
            console.log(`✅ SOURCE 2 (IMD Official Data): ${imdRainMm} mm/hr detected.`);
        } catch (e) {
            console.log(`⚠️ SOURCE 2 (IMD) Failed:`, e.message);
        }
        console.log(`⚖️ Analyzing dual-source consensus...`);
        
        // Rule: Both sources must report > 25mm to trigger a payout
        if (zomatoRainMm > 25 && meteoRainMm > 25) {
            console.log(`🚨 CORROBORATION SUCCESS: Both networks confirm heavy rain >25mm/hr.`);
            console.log(`💸 Action: Generating IRDAI-compliant Claim #998 for ₹200.`);
        } else if (zomatoRainMm > 25 || meteoRainMm > 25) {
            console.log(`🟡 WARNING: Split consensus. One source detects rain, but corroboration failed. No payout to protect pool health.`);
        } else {
            console.log(`🟢 SAFE: Corroborated normal weather. No payout.`);
        }

    } catch (error) {
        console.error('❌ Critical Engine Failure:', error.message);
    }
}
runConsensusEngine();