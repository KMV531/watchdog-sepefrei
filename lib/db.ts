import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "data.json");

export const readDB = () => {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
};

export const writeDB = (data: string) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
