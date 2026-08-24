const DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh";

function getCurrentDate(timeZone = DEFAULT_TIME_ZONE) {
    const parts = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        timeZone,
        year: "numeric"
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));

    return `${values.year}-${values.month}-${values.day}`;
}

module.exports = { DEFAULT_TIME_ZONE, getCurrentDate };
