import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { ApiService } from './src/services/api.service.js';
import { CalculationService } from './src/services/calculation.service.js';
import { SpreadsheetService } from './src/services/spreadsheet.service.js';

import credentials from './private-key.json' with { type: "json" };
import sleep from 'atomic-sleep';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
});
const spreadsheet = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, jwt);

const apiService = new ApiService(process.env.TORN_API_KEY)
const calculationService = new CalculationService();
const spreadsheetService = new SpreadsheetService(spreadsheet);

const lastCheckedIdFilePath = path.join(__dirname, 'lastCheckedId.txt');

async function main() {
    await spreadsheet.loadInfo();

    while (true) {
        const data = await fetchProfiles();

        console.log('Writing data to Spreadsheet...');
        await spreadsheetService.write(data);
    }
}

async function fetchProfiles() {
    let profileCount = 0;
    const data = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ]

    let lastCheckedId = fs.existsSync(lastCheckedIdFilePath)
        ? parseInt(fs.readFileSync(lastCheckedIdFilePath))
        : 0;

    while (profileCount < 50) {
        sleep(1000 * 60 / parseInt(process.env.TORN_API_RATE_PER_MINUTE));
        lastCheckedId++;
        
        console.log('Fetching profile with ID: ' + lastCheckedId);
        let profileInfo = await apiService.getProfileInfo(lastCheckedId);

        if (profileInfo === null) continue;
        let score = Math.min(calculationService.calculate(
            profileInfo.rank,
            profileInfo.level,
            profileInfo.personalstats.networth,
            profileInfo.criminalrecord.total
        ), 6);

        data[score].push([
            lastCheckedId,
            profileInfo.name,
            'https://www.torn.com/profiles.php?XID=' + lastCheckedId,
            profileInfo.level,
            profileInfo.awards
        ]);

        profileCount++;
    }

    fs.writeFileSync(lastCheckedIdFilePath, lastCheckedId.toString());

    return data;
}

main();