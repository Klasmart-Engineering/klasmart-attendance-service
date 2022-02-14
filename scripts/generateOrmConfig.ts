#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";
import { connOptions } from "../src/typeormConfig";

const configPath = path.join(__dirname, "../ormConfig.json");

fs.writeFileSync(configPath, JSON.stringify(connOptions, null, 2));

console.log(
  `TypeORM config saved to ${path.relative(process.cwd(), configPath)}`
);
