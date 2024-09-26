import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const name = req.body.name;
  const phone = req.body.phone;

  const dataWasWritten = await writeInfoIntoGoogleSheet(name, phone);

  if (dataWasWritten) {
    res.status(200).end();
  } else {
    res.status(500).end();
  }
};

async function writeInfoIntoGoogleSheet(name, phone) {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_DOCUMENT_ID_PHONES);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    sheet.addRow({ name, phone });
    return true;
  } catch (e) {
    console.log('Google Sheet error');
    console.error(e);
    return false;
  }
}
