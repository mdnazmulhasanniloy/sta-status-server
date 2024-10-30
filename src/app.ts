/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express'; 
import crypto from 'node:crypto'; 
import { google } from 'googleapis';

if (!globalThis.crypto) {
  //@ts-ignore
  globalThis.crypto = crypto;
}
const app: Application = express();
app.use(express.static('public'));

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);
 

app.get('/server', async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'learnwithredwan-dbcdf7eeee3b.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    //create client instence
    const client = await auth.getClient();

    //instance of google sheets api
    //@ts-ignore
    const googleSheets = google.sheets({
      version: 'v4',
      auth: client,
    });
    // spark-tech@learnwithredwan.iam.gserviceaccount.com
    //sheet id
    //docs.google.com/spreadsheets/d/1dxq9wxpu8b3vqxo2qh_GufyOXFIuV96XZLqa894Dmbo/edit?usp=sharing
    const spreadsheetId = '1dxq9wxpu8b3vqxo2qh_GufyOXFIuV96XZLqa894Dmbo';
    //get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });

    //read row from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      // range: 'October 2024 WIP',
      range: 'October 2024 WIP',
    });
    const values: any = getRows?.data?.values;
    const output = [];

    for (let i = 0; i < values?.length; i++) {
      const row: {
        teamName: string;
        totalDelivered: string;
        deliveryTarget: string;
      } = {
        teamName: '',
        totalDelivered: '',
        deliveryTarget: '',
      };

      row['teamName'] = values[i][6];
      row['totalDelivered'] = values[i][9];
      row['deliveryTarget'] = values[i][10];
      if ((row?.totalDelivered || row?.teamName) && row?.teamName?.length) {
        output.push(row);
      }
    }
   
    const title = output.slice(0, 1);
    const totalTarget = output.sort().slice(0, 1);
   


    const sortedOutput = output.sort((a: any, b: any) => {
      const totalA = parseFloat(
        a.totalDelivered.replace('$', '').replace(/,/g, ''),
      );
      const totalB = parseFloat(
        b.totalDelivered.replace('$', '').replace(/,/g, ''),
      );
      return totalB - totalA;
    });

   
  
    res.send(sortedOutput);
    
  } catch (error) {
    console.log(error);
  }
 
});

app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});
 

export default app;
