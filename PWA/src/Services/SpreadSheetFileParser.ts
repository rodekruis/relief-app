import { read, utils } from "../ExternalLibraries/xlsx.full.min.js";

export class SpreadSheetFileParser {
  static async firstSheetFromSpreadSheetFile(
    spreadSheetFile: File
  ): Promise<any> {
    const workBook = read(await spreadSheetFile.arrayBuffer(), {
      type: "array",
    });
    const spreadSheetNames = workBook.SheetNames;
    const firstSheet = workBook.Sheets[spreadSheetNames[0]];
    return firstSheet;
  }

  static async jsonFromSpreadSheetFile(spreadSheetFile: File): Promise<any> {
    const spreadSheet = await this.firstSheetFromSpreadSheetFile(
      spreadSheetFile
    );
    return utils.sheet_to_json(spreadSheet);
  }
}
