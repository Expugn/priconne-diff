const https = require('https');
const fs = require('fs');
const { exec } = require('child_process');
// const core = require('@actions/core');

run();

async function run() {
    // core.setOutput("success", false);
    exec(`echo "success=false" >> $GITHUB_OUTPUT`);
    const latest = await get_latest_version();
    const has_updates = await check_for_updates(latest);
    if (!has_updates) {
        return;
    }
    write_file(`./version.json`, latest);
    for (const region in latest) {
        if (region === "TW") {
            latest[region].version = `${latest[region].version}`.padStart(8, '0');
        }
        //core.setOutput(region, latest[region].version);
        exec(`echo "${region}=${latest[region].version}" >> $GITHUB_OUTPUT`);
    }
    // core.setOutput("success", true);
    exec(`echo "success=true" >> $GITHUB_OUTPUT`);
}

function get_latest_version() {
    return new Promise(async (resolve) => {
        let latest = "";
        https.get('https://raw.githubusercontent.com/Expugn/priconne-database/master/version.json', (res) => {
            res.on('data', (chunk) => {
                latest += Buffer.from(chunk).toString();
            });
            res.on('end', () => {
                resolve(JSON.parse(latest));
            });
        });
    });
}

function check_for_updates(latest) {
    return new Promise(async (resolve) => {
        const version_file = `./version.json`;
        if (fs.existsSync(version_file)) {
            const current = fs.readFileSync(version_file, 'utf8');
            console.log('[check_for_updates] EXISTING VERSION FILE FOUND!', current);
            if (current !== JSON.stringify(latest)) {
                console.log('[check_for_updates] UPDATES AVAILABLE!');
                resolve(true);
            } else {
                console.log('[check_for_updates] NO UPDATES AVAILABLE!');
                resolve(false);
            }
            return;
        }
        resolve(true);
    });
}

function write_file(path, data, readable = false) {
    fs.writeFile(path, JSON.stringify(data, null, readable ? 4 : 0), async function (err) {
        if (err) throw err;
    });
}
