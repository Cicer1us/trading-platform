import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const name = req.body.name;
  const email = req.body.email;

  const dataWasWritten = await writeInfoIntoGoogleSheet(name, email);

  if (dataWasWritten) {
    res.status(200).end();
  } else {
    res.status(500).end();
  }
};

async function writeInfoIntoGoogleSheet(name, email) {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_DOCUMENT_ID, serviceAccountAuth);

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    sheet.addRow({ name, email });
    return true;
  } catch (e) {
    console.log('Google Sheet error');
    return false;
  }
}
