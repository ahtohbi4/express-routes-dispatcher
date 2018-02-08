export default (...items) => items
    .join('/')
    .replace(/[\/]{2,}/g, '/');
