import { read, utils, write } from "../ExternalLibraries/xlsx.full.min.js";
export class SpreadSheetService {
    static async jsonFromSpreadSheetFile(spreadSheetFile) {
        const spreadSheet = await this.firstSheetFromSpreadSheetFile(spreadSheetFile);
        return utils.sheet_to_json(spreadSheet);
    }
    static async fileFromJson(json) {
        const ws = utils.json_to_sheet(json);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        return write(wb, { bookType: 'xlsx', type: 'blob' });
    }
    static async firstSheetFromSpreadSheetFile(spreadSheetFile) {
        const workBook = read(await spreadSheetFile.arrayBuffer(), {
            type: "array",
        });
        const spreadSheetNames = workBook.SheetNames;
        const firstSheet = workBook.Sheets[spreadSheetNames[0]];
        return firstSheet;
    }
}
