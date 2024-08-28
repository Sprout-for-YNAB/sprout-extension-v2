const TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60000;

export const todaysDate = new Date(Date.now() - TIMEZONE_OFFSET).toISOString().split("T")[0];
