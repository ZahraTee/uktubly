import * as fs from "fs";
import { parse } from "csv-parse";
import path from "path";

export type FileRow = string[];

export function inputFileNameToPath(fileName: string) {
  return path.resolve(__dirname, fileName);
}

export function readCSV(fileName: string): Promise<FileRow[]> {
  return new Promise((resolve, reject) => {
    const data: FileRow[] = [];

    const filePath = inputFileNameToPath(fileName);

    fs.createReadStream(filePath, "utf8")
      .pipe(parse({ delimiter: "," }))
      .on("data", function (row) {
        data.push(row);
      })
      .on("error", function (error) {
        reject(error);
      })
      .on("end", function () {
        resolve(data);
      });
  });
}
