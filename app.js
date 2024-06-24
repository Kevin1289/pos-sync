import 'dotenv/config'
import express from 'express';
import axios from 'axios';
import winston from 'winston';
import { client } from './database.js';
import { validateMenuData } from './validateDataModels.js';

export const app = express();

// Logger configuration
const logger = winston.createLogger({
level: 'info',
format: winston.format.combine(
    winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
),
transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
],
});

// Fetch menu from POS API
export const fetchMenu = async (location_id, res) => {
    if (isNaN(location_id)) {
        logger.error(`Invalid location_id: ${location_id}`);
        res.status(400).send(`Invalid location_id: ${location_id}`);
        return;
    }

    try {
        const response = await axios.get(`https://bite-test-pos-production.herokuapp.com/locations/${location_id}/menu`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching menu for location_id: ${location_id}: ${error.message}`);
        res.status(500).send(`Error fetching menu for location_id: ${location_id}`);
        return undefined;
    }
};

const validateData = (menuData, res) => {
    const validation = validateMenuData(menuData)
    if (validation.error) {
        console.log("VALIDATE DATA ERROR", validation.msg)
        logger.error(`Invalid menu data for location_id (${location_id}): ${validation.msg}`);
        console.log(`Invalid menu data for location_id (${location_id}): ${validation.msg}`)
        res.status(400).send(`Invalid menu data for location_id (${location_id}): ${validation.msg}`);
        return false;
    }
    return true;
};

// Sync menu data into the mongo database
const syncMenuData = (menuData, location_id, res) => {
    const databaseName = process.env.MONGODB_DATABASE_NAME;

    if (!databaseName) {
        logger.error('Missing MongoDB database name');
        res.status(500).send('Missing MongoDB database name');
    }

    const database = client.db(databaseName);

    database.collection('menu').updateOne(
        { _id: location_id },
        { $set: { menu: menuData } },
        { upsert: true },
    ).then(() => {
        logger.info(`Menu data synced successfully for location_id: ${location_id}`);
        res.status(200).send(`Menu data synced successfully for location_id: ${location_id}`);
    }).catch((error) => {
        logger.error(`Error syncing menu data for location_id: ${location_id}: ${error.message}`);
        res.status(500).send(`Error syncing menu data for location_id: ${location_id}`);
    }  
    )
};

app.get('/trigger-sync', async (req, res) => {
    const locationId = req.query.location_id;
    if (!locationId) {
        return res.status(400).send('Location ID is required');
    }

    logger.info(`Syncing menu data for location_id: ${locationId}`);

    try {
        const menuData = await fetchMenu(locationId, res);
        if (!menuData) {
            return;
        }
        if (!validateData(menuData)) {
            return;
        }
        syncMenuData(menuData, locationId, res);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


