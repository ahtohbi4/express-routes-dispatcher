export default function createMetaObject(schema) {
    return class MetaObject {
        constructor(params) {
            Object.keys(params)
                .forEach((name) => {
                    const value = params[name];

                    this[name] = value;
                });

            Object.keys(schema)
                .forEach((name) => {
                    const value = params[name];

                    if (value === undefined) {
                        throw new Error(`Parameter ${name} was missed.`);
                    }
                });
        }
    }
}
