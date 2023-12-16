import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import dayjs from 'dayjs';
import {v4 as uuid} from 'uuid';

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

const calendar = google.calendar({
    version: 'v3',
    auth:process.env.API_KEY
});

const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

router.get('/' , (req,res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type : 'offline',
        scope : scopes
    })

res.redirect(url);
});

router.get('/google', async (req,res) => {
    const code = req.query.code;
    const { tokens }  = await oauth2Client.getToken(code as any) as any;
    oauth2Client.setCredentials(tokens);

    res.send({
        msg:'You have successfully logged in'
    });
});

router.get('/schedule-videoCall', async (req,res) =>{
    await calendar.events.insert({
        calendarId : 'primary',
        auth:oauth2Client,
        conferenceDataVersion: 1,
        requestBody: {
            summary:'Reserved video call',
            description: 'chat with your doctor via Google meet',
            start:{
                dateTime : dayjs(new Date()).add(1,'minute').toISOString(),
                timeZone:'Etc/GMT+2'
            },
            end:{
                dateTime : dayjs(new Date()).add(1,'minute').add(10,'minutes').toISOString(),
                timeZone:'Etc/GMT+2' 
            },
            conferenceData:{
                createRequest:{
                    requestId: uuid()
                }
            },
            attendees:[{
                email: 'aelwahussein@gmail.com'
            },
            {
                email: 'abdoad941@gmail.com'
            }]
        }
    });
    res.send({
        msg:'Done'
    })
});


export default router;


