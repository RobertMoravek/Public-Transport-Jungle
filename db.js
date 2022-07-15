const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/robert");

module.exports.getActors = () => {
    return db.query(`SELECT * FROM actors`)
}

module.exports.addActor = (name, age) => {
    return db.query(`
        INSERT INTO actors (name, age)
            VALUES ($1, $2)`, [name, age])
}