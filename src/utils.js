export const joinURI = (...items) => items
    .join('/')
    .replace(/[\/]{2,}/g, '/');

export const noop = () => null;