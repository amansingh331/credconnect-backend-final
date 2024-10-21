import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import connt from './tempDBconfi.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CredConnect',
    port: 3306,
    ssl: { ca: fs.readFileSync(path.resolve(__dirname, 'DigiCertGlobalRootCA.crt.pem')) }
};

const conn = mysql.createPool(config);

export default connt;
