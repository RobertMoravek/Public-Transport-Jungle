const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/robert");

module.exports.getNumOfSigners = () => {
    return db.query(`SELECT COUNT(*) FROM signatures`)
}

module.exports.addSupporter = (firstName, lastName, signatureURL) => {
    return db.query(
        `
        INSERT INTO signatures (first, last, signature)
            VALUES ($1, $2, $3) RETURNING id`,
        [firstName, lastName, signatureURL]
    )
        .then((result) => {
            return result.rows[0].id;
        });
}

module.exports.showSigner = (id) => {
    return db.query(
        `
        SELECT * FROM signatures
            WHERE id = $1`,
        [id]
    )
        .then((result) => {
            // console.log(result.rows[0]);
            return result.rows[0];
        });
};

module.exports.showSupporters = function () {
    return db.query(
        `SELECT * FROM signatures`
    ).then((results) => {
        return results.rows;
    })
}

