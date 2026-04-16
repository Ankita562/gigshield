const express = require('express');
const router = express.Router();

router.get('/forecast/:userId', async (req, res) => {
  const forecast = [
    { day: 'Mon', date: 'Mar 17', rainfall: 15, temp: 28, aqi: 120, risk: 'low' },
    { day: 'Tue', date: 'Mar 18', rainfall: 22, temp: 29, aqi: 180, risk: 'medium' },
    { day: 'Wed', date: 'Mar 19', rainfall: 10, temp: 30, aqi: 90,  risk: 'low' },
    { day: 'Thu', date: 'Mar 20', rainfall: 48, temp: 27, aqi: 140, risk: 'high' },
    { day: 'Fri', date: 'Mar 21', rainfall: 35, temp: 28, aqi: 210, risk: 'medium' },
    { day: 'Sat', date: 'Mar 22', rainfall: 5,  temp: 31, aqi: 80,  risk: 'low' },
    { day: 'Sun', date: 'Mar 23', rainfall: 12, temp: 30, aqi: 100, risk: 'low' },
  ];
  res.json(forecast);
});

module.exports = router;