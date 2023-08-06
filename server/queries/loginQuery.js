'use strict';
const config = require('../config');
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const {SECRET_KEY} = process.env;

const userAccess = async (code) => {
    try {
        let pool = await sql.connect(config.sql);
        const userCode = await pool.request()
        .query`
            SELECT
            DeptCode,
            CategoryCode,
            Rights
            FROM Access WHERE UserCode=${code}
        `;
        return userCode.recordset;
    } catch (error) {
        return error;
    }
}

const verifyAccess = async (code, password) => {
    try {
        let pool = await sql.connect(config.sql);
        const userPass = await pool.request().query`
        SELECT CODE, PASS
        FROM Users
        WHERE CODE=${code}
        AND PASS=${password}
        AND IS_ACTIVE = 1
        AND Deleted = 0`;
        return userPass.recordset;
    } catch (error) {
        return error;
    }
}

const createToken = (user) => {
    return jwt.sign({ user }, SECRET_KEY, { expiresIn: '1d' });
};

module.exports = {
    userAccess,
    verifyAccess,
    createToken,
}