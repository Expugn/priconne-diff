const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const https = require('https');
const path = require('path');

if (process.argv.length < 4) {
    console.log("not enough args");
    return;
}
const input = process.argv[2]; // e.g. "master_jp.db"
const output = process.argv[3]; // e.g. "./JP"

download(input).then(() => {
    check_directory(output);
    check_directory(`${output}/csv`, output.includes("JP"));
    check_directory(`${output}/table`, output.includes("JP"));
    check_directory(`${output}/json`, output.includes("JP"));

    // get tables
    const db = new sqlite3.Database(input);
    db.serialize(() => {
        db.each("SELECT name FROM sqlite_master WHERE type='table'", (e, { name }) => {
            parse(db, name);
        });
    });
});

function parse(db, table_name) {
    db.all(`SELECT * FROM ${table_name}`, (e, rows) => {
        const csv = [];
        const table = [];
        const json = [];
        // get column names
        db.all(`PRAGMA table_info(${table_name})`, (err, rows2) => {
            if (err) {
                return;
            }
            const columns = rows2.map(row => row.name);

            // headers ====================================
            // csv
            csv.push(columns.join(","));

            // table
            table.push(`|${columns.join("|")}|`);
            let table_pipe = "|";
            columns.forEach((_) => {
                table_pipe += " --- |";
            });
            table.push(table_pipe);

            // body =======================================
            for (const r of rows) {
                // csv
                const csv_modified_values = Object.values(r);
                csv_modified_values.forEach((part, index, arr) => {
                    if (`${part}`.includes('"')) {
                        // swap single " with ""
                        arr[index] = `${part}`.replaceAll('"', '""');
                    }
                });
                csv.push(`"${csv_modified_values.join('","')}"`);

                // table
                table.push(`|${Object.values(r).join('|')}|`);

                // json
                json.push(`        ${JSON.stringify(r)}`);
            }

            // write .csv file to output directory
            fs.writeFileSync(`${output}/csv/${table_name}.csv`, csv.join((columns.length > 1) ? '\n' : ",\n"), "utf8");
            fs.writeFileSync(`${output}/table/${table_name}.md`, table.join('\n'), "utf8");
            fs.writeFileSync(`${output}/json/${table_name}.json`, `{\n    "${table_name}": [\n${json.join(',\n')}\n    ]\n}`, "utf8");
        });
    });
}

function download(file_name) {
    return new Promise(async (resolve) => {
        const file = fs.createWriteStream(file_name);
        const url = `https://raw.githubusercontent.com/Expugn/priconne-database/master/${file_name}`;

        https.get(url, (res) => {
            const stream = res.pipe(file);
            stream.on('finish', () => {
                console.log(`downloaded ${file_name} from ${url}`);
                resolve();
            });
        });
    });
}

function check_directory(directory, do_clean = false) {
    if (!directory) {
        return;
    }
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    if (do_clean) {
        clean(directory);
    }

    function clean(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                clean(path.join(dir, file));
                fs.rmdirSync(path.join(dir, file));
            }
            else {
                fs.unlinkSync(path.join(dir, file));
            }
        }
    }
}