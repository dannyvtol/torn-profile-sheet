import sleep from 'atomic-sleep';

export class SpreadsheetService {
    constructor(spreadsheet) {
        this._SPREADSHEET = spreadsheet;
    }

    async write(data) {
        for (let index = 0; index < data.length; index++) {
            sleep(1500);

            const sheet = this._SPREADSHEET.sheetsByIndex[index];
            await sheet.addRows(data[index]);
        }
    }
}