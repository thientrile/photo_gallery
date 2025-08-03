/** @format */
'use strict';
const config=require("../../../config.js")
const mongoose = require('mongoose');
const { schema, user, pass, host,  options } = config.mongodb;

const encodedUser = encodeURIComponent(user);
const encodedPass = encodeURIComponent(pass);

const mongoUri = user && pass ? `${schema}://${encodedUser}:${encodedPass}@${host}/photo_gallery` : `${schema}://${host}/photo_gallery`;
class DatabaseClass {
    constructor() {
        this.connect();
    }

    async connect() {
        mongoose
            .connect(mongoUri,options)
            .then(() => {
                console.log('✅ MongoDB Status: Connected');
                console.log('🔗 MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//*****@'));
                clearTimeout(this.ErrorTimeOut);
            })
            .catch((err) => {
                console.error('❌ MongoDB Connect Error:', err.message);
                console.warn('🔁 Retrying in 5 seconds...');
                this.ErrorTimeOut = setTimeout(() => {
                    this.connect();
                }, 5000);
            });
    }

    static getInstance() {
        if (!DatabaseClass.instance) {
            DatabaseClass.instance = new DatabaseClass();
        }
        return DatabaseClass.instance;
    }
}

const instanceMongoDB = DatabaseClass.getInstance();
module.exports = instanceMongoDB;
