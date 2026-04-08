"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (message, meta) => {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ timestamp, message, ...meta }));
};
exports.logger = logger;
