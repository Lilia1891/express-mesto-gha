// eslint-disable-next-line no-useless-escape
const urlRegExp = /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/;

module.exports = urlRegExp;
