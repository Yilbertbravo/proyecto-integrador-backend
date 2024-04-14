const { getCollection, generateId } = require("../connectionDB.js");

const { HEADER_CONTENT_TYPE } = require("../constants/headers.js");
const { ERROR_SERVER } = require("../constants/messages.js");

const { getDateTimeAsString } = require("../helpers/datetime.helper.js");

const normalizeValue = (value) => {
    return value
        .toUpperCase()
        .trim()
        .replace("Á", "A")
        .replace("É", "E")
        .replace("Í", "I")
        .replace("Ó", "O")
        .replace("Ú", "U");
};

const createSchema = (values) => {
    const { id, fullname, email, total } = values;

    return {
        id: Number(id),
        datetime: getDateTimeAsString(),
        fullname: normalizeValue(fullname),
        email,
        total,
    };
};

const getAll = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const collection = await getCollection("shopping_carts");
        const shoppingCarts = await collection.find({}).hint("idx_id").toArray();

        res.status(200).send({ success: true, data: shoppingCarts });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

const create = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const collection = await getCollection("shopping_carts");
        const id = await generateId(collection);
        const shoppingcart = createSchema({ id, ...req.body });
        await collection.insertOne(shoppingcart);

        res.status(201).send({ success: true, data: shoppingcart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

module.exports = { getAll, create };