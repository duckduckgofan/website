import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const port = 3001;

// --- IMPORTANT ---
// Replace this with your actual AbuseIPDB API key.
// You can get a free key from your AbuseIPDB account dashboard.
const ABUSEIPDB_API_KEY = '6d189f5c6b623def5bbd6ce047f5834ce4adc329eea88e981a70251af0a892757a3db319652bbf41';

app.get('/api/lookup/:ip', async (req: Request, res: Response) => {
    const { ip } = req.params;
    if (!ip) {
        return res.status(400).json({ error: 'IP address is required.' });
    }

    try {
        // 1. Get Geolocation and ISP info from ipinfo.io
        const ipinfoUrl = `https://ipinfo.io/${ip}/json`;
        const ipinfoResponse = await axios.get(ipinfoUrl);
        const ipinfo = ipinfoResponse.data;

        // 2. Get abuse reports from AbuseIPDB
        const abuseApiUrl = 'https://api.abuseipdb.com/api/v2/check';
        const abuseApiResponse = await axios.get(abuseApiUrl, {
            params: {
                ipAddress: ip,
                maxAgeInDays: '90',
                verbose: true
            },
            headers: {
                'Key': ABUSEIPDB_API_KEY,
                'Accept': 'application/json'
            }
        });

        const abuseData = abuseApiResponse.data.data;

        // 4. Process reports for the weekly chart
        const reports = abuseData.reports || [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const past7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - i);
            return {
                day: days[d.getDay()],
                date: d.toISOString().split('T')[0],
                count: 0
            };
        }).reverse();
        reports.forEach((report: any) => {
            const reportDate = new Date(report.reportedAt).toISOString().split('T')[0];
            const dayData = past7Days.find(d => d.date === reportDate);
            if (dayData) {
                dayData.count++;
            }
        });
        const reportsThisWeek = past7Days.map(({ day, count }) => ({ name: day, reports: count }));

        const combinedData = {
            ipAddress: ipinfo.ip,
            location: ipinfo.loc,
            country: ipinfo.country,
            countryCode: ipinfo.country,
            city: ipinfo.city,
            region: ipinfo.region,
            isp: ipinfo.org,
            hostname: ipinfo.hostname,
            abuseConfidenceScore: abuseData.abuseConfidenceScore,
            totalReports: abuseData.totalReports,
            numDistinctUsers: abuseData.numDistinctUsers,
            isWhitelisted: abuseData.isWhitelisted,
            usageType: abuseData.usageType,
            domain: abuseData.domain,
            hostnames: abuseData.hostnames,
            lastReportedAt: abuseData.lastReportedAt,
            reports: abuseData.reports,
            reportsThisWeek: reportsThisWeek,
        };
        res.json(combinedData);

    } catch (error: any) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response && error.response.data && error.response.data.errors 
            ? error.response.data.errors[0].detail 
            : 'An internal server error occurred.';
        res.status(status).json({ error: message });
    }
});

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
}); 