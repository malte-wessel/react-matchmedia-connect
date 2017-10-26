export default function pick(object, ...props) {
    if (!props.length) return {};
    return props.reduce((acc, prop) => {
        if (object.hasOwnProperty(prop)) {
            acc[prop] = object[prop];
        }
        return acc;
    }, {});
}
