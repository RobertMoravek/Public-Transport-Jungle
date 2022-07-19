const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/robert");
const bcrypt = require("bcryptjs");

module.exports.getNumOfSigners = () => {
    return db.query(`SELECT COUNT(*) FROM signatures`)
}

module.exports.insertUser = (firstName, lastName, email, password) => {
    return hashPassword(password)
        .then((result) => {
            return db.query(
                `
                INSERT INTO users (first, last, email, password)
                    VALUES ($1, $2, $3, $4) RETURNING id`,
                [firstName, lastName, email, result]
            )
                .then((result) => {
                    // console.log('result.rows[0]', result.rows[0].id);
                    return result.rows[0].id;
                });

        });
}

module.exports.loginUser = (email, password) => {
    let temp = null;
    return db.query(
                `
                SELECT * FROM users WHERE email = $1`,
                [email]
            )
                .then((result) => {
                    temp = result;
                    // console.log("result", result)
                    return comparePasswords(password, result.rows[0].password)
                })
                .then((result) => {
                    console.log("result2", result);
                    if(result){
                        console.log("result.rows[0].id", temp.rows[0].id);
                        return temp.rows[0].id;
                    } else {
                        return null;
                    }
                })
}

module.exports.addSignature = (id, signature) => {
    return db.query(
                `
                INSERT INTO signatures (id, signature)
                    VALUES ($1, $2)`,
                [id, signature]
            );
};

module.exports.checkSignature = (id) => {
    return db.query(
            `
            SELECT signature FROM signatures WHERE id = $1 
            `, [id]
    ).then((result) => {
        if (result.rowCount == 1) {
            return true;
        } else {
            return false;
        }
    })
}

module.exports.showSigner = (id) => {
    let tempResult;
    return db.query(
        `
        SELECT * FROM users
            WHERE id = $1`, [id]
    )
        .then((result) => {
            tempResult = result.rows[0];
            return (db.query(
        `
        SELECT * FROM signatures
            WHERE id = $1`, [id]))

        })
        .then ((result) => {
            // console.log("result1, result2", tempResult, result.rows[0]);

            return [tempResult, result.rows[0]];
        })
};  

module.exports.showSupporters = function () {
    return db.query(
        `SELECT * FROM users`
    ).then((results) => {
        return results.rows;
    })
}


function hashPassword(password) {
    return bcrypt
        .genSalt()
        .then((salt) => {
            return bcrypt.hash(password, salt);
        })
        .then((result) => {
            // `result` will be the hashed password (if nothing went wrong)
            // console.log(result);
            return result;
        });

}

function comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
    .then((result) => {
        console.log(result);
        return result
    })
}