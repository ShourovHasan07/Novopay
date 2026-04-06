export const logger = (message: string, meta?: any) => {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, message, ...meta }));
};