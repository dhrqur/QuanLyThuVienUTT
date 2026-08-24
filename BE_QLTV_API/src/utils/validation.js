function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data || {}).some(field => !allowedFields.includes(field));
}

function trimText(value) {
    return String(value ?? "").trim();
}

function normalizeEmail(value) {
    return trimText(value).toLowerCase();
}

function normalizeOptionalText(value) {
    return trimText(value) || null;
}

function normalizeText(value) {
    return trimText(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

module.exports = {
    hasUnexpectedFields,
    isEmpty,
    normalizeEmail,
    normalizeOptionalText,
    normalizeText,
    trimText
};
