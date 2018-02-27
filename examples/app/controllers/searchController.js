module.exports = (request) => {
    const { body = {}, params = {} } = request;

    return {
        data: {
            query: body.query || params.query,
            results: [],
        },
    };
};
