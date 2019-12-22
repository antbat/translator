module.exports = async json => {

    return `it's a report of JSON translation`
};

async function addItem(items) {
    if (!items || items.length < 1) {
        return;
    }
    for (let i = 0, max = items.length; i < max; i++) {
        const item = items[i];
    }
}
