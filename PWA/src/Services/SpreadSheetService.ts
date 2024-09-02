import { read, utils, write } from "../ExternalLibraries/xlsx.full.min.js";

export class SpreadSheetService {
  static async jsonFromSpreadSheetFile(spreadSheetFile: File): Promise<any> {
    const spreadSheet = await this.firstSheetFromSpreadSheetFile(
      spreadSheetFile
    );
    return utils.sheet_to_json(spreadSheet);
  }

  static async fileFromJson(json: any): Promise<Blob> {
    const ws = utils.json_to_sheet(json);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');

    const file = write(wb, { bookType: 'xlsx', type: 'binary' });
    return new Blob([this.stringToArrayBuffer(file)], {
      type: 'application/octet-stream'
    })
  }

  private static async firstSheetFromSpreadSheetFile(
    spreadSheetFile: File
  ): Promise<any> {
    const workBook = read(await spreadSheetFile.arrayBuffer(), {
      type: "array",
    });
    const spreadSheetNames = workBook.SheetNames;
    const firstSheet = workBook.Sheets[spreadSheetNames[0]];
    return firstSheet;
  }

  private static stringToArrayBuffer(string: string) {
    const buffer = new ArrayBuffer(string.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < string.length; i++) view[i] = string.charCodeAt(i) & 0xff
    return buffer
  }
}