import express, { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/api/lookup/:ip', async (req: Request, res: Response) => {
    const { ip } = req.params;
    if (!ip) {
        return res.status(400).json({ error: 'IP address is required.' });
    }

    try {
        const url = `https://www.abuseipdb.com/check/${ip}`;
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(html);

        const getCardValue = (title: string): string => {
            return $(`th:contains("${title}")`).next('td').text().trim() || 'N/A';
        };

        const abuseConfidenceScoreText = $('.well h1').text().match(/(\d+)%/);
        const abuseConfidenceScore = abuseConfidenceScoreText ? parseInt(abuseConfidenceScoreText[1], 10) : 0;
        
        const reports: any[] = [];
        $('table#check-report tbody tr').each((_, row) => {
            const cells = $(row).find('td');
            reports.push({
                reportedAt: $(cells[0]).text().trim(),
                comment: $(cells[2]).text().trim(),
                categories: $(cells[3]).text().trim().split(',').map(c => c.trim()),
                reporterId: parseInt($(cells[1]).find('a').text().trim() || '0', 10),
                reporterCountryCode: $(cells[1]).find('img').attr('src')?.split('/').pop()?.split('.')[0].toUpperCase(),
                reporterCountryName: $(cells[1]).find('img').attr('title'),
            });
        });
        
        const result = {
            ipAddress: getCardValue('IP Address'),
            abuseConfidenceScore: abuseConfidenceScore,
            countryName: getCardValue('Country'),
            usageType: getCardValue('Usage Type'),
            isp: getCardValue('ISP'),
            domain: getCardValue('Domain Name'),
            totalReports: reports.length,
            numDistinctUsers: new Set(reports.map(r => r.reporterId)).size,
            reports,
            isPublic: true,
            ipVersion: 4,
            isWhitelisted: false,
            countryCode: getCardValue('Country'),
            hostnames: [getCardValue('Domain Name')],
            lastReportedAt: reports.length > 0 ? reports[0].reportedAt : new Date().toISOString(),
        };

        // --- Scamalytics scraping ---
        let scamalytics: any = null;
        try {
            const scamUrl = `https://scamalytics.com/ip/${ip}`;
            const { data: scamHtml } = await axios.get(scamUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $s = cheerio.load(scamHtml);
            // Extract score
            const scoreText = $s('.score_bar .score').text();
            const score = scoreText.match(/\d+/)?.[0] || null;
            // Extract risk level
            const riskLevel = $s('.panel_title').first().text().trim();
            // Extract ISP
            const scamISP = $s('th:contains("ISP Name")').next('td').text().trim();
            // Extract country
            const scamCountry = $s('th:contains("Country Name")').next('td').text().trim();
            // Extract city
            const scamCity = $s('th:contains("City")').next('td').text().trim();
            // Extract blacklist info
            const blacklist: Record<string, string> = {};
            ['Firehol', 'IP2ProxyLite', 'IPsum', 'Spamhaus', 'X4Bnet Spambot'].forEach((name) => {
                const val = $s(`th:contains(\"${name}\")`).next('td').find('.risk').text().trim();
                if (val) blacklist[name] = val;
            });
            // Extract proxy info
            const proxies: Record<string, string> = {};
            ['Anonymizing VPN', 'Tor Exit Node', 'Server', 'Public Proxy', 'Web Proxy', 'Search Engine Robot'].forEach((name) => {
                const val = $s(`th:contains(\"${name}\")`).next('td').find('.risk').text().trim();
                if (val) proxies[name] = val;
            });
            scamalytics = {
                score,
                riskLevel,
                isp: scamISP,
                country: scamCountry,
                city: scamCity,
                blacklist,
                proxies
            };
        } catch (err) {
            // If Scamalytics fails, just skip it
            scamalytics = null;
        }

        res.json({
            ...result,
            scamalytics
        });

    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ error: 'Failed to scrape AbuseIPDB.' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
}); 