
import Papa from 'papaparse';

export interface CSVParseOptions {
  header: boolean;
  skipEmptyLines: boolean;
  transform?: (value: string, field: string | number) => any;
}

export const parseCSV = <T>(file: File, options: CSVParseOptions = { header: true, skipEmptyLines: true }): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      ...options,
      complete: (results) => {
        if (results.errors.length) {
          reject(results.errors);
          return;
        }
        resolve(results.data as T[]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
