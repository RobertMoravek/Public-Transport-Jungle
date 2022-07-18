// Requires and Apps

// -> Express
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));

// -> Cookie Stuff
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: `Better run through the jungle!`,
        maxAge: undefined,
    })
);


// -> Handlebars config
const hb = require("express-handlebars");
app.engine("handlebars", hb.engine());
app.set("view engine", "handlebars");
//END Handlebars config


// -> Helmet

const helmet = require("helmet");
app.use(helmet());

// -> DB
const db = require("./db.js");




// USING and GETTING

app.use(express.static("./public"));

// app.use((req, res, next) => {
//     if (!req.cookies.petitionSigned) {
//         res.sendStatus(301);
//         res.redirect("/petition");
//         return; 
//     }
//     next();
// })


// Home Directory Redirects to Petition

app.get("/", (req, res) => {
    // res.sendStatus(301);
    res.redirect("/petition");
    return; 
})

// Petition page

app.get("/petition", (req, res) => {
    if (!req.session.signatureId) {
        console.log("trying to render petition");
        res.render("petition", {
            url: req.url,
            title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
        });
        // Show petition sign page
        return;
    }

    res.redirect("/thanks");
    return;
})

app.post("/petition", (req, res) => {
    if (!req.session.signatureId) {
        let { firstName, lastName, signatureURL } = req.body;
        // console.log(req.body);
        // console.log(firstName, lastName, signatureURL);
        if (firstName && lastName && signatureURL) {
            db.addSupporter(firstName, lastName, signatureURL)
                .then((result) => {
                    req.session.signatureId = result;
                    res.redirect("/thanks");
                    return;
                })
                .catch((err) => {
                    console.log("Error on database query:", err);
                    return;
                });
        } else {
            res.render("petition", {
                signingFailed: true,
                firstName,
                lastName,
                signatureURL,
                url: req.url,
                title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
            });
            return;
        }
    } else {
        res.redirect("/thanks");
    };
});


// Thanks Page

app.get("/thanks", (req, res) => {
    if (req.session.signatureId) {
        db.showSigner(req.session.signatureId).then(
            ({ id, first, last, signature }) => {
                db.getNumOfSigners().then((result) => {
                    res.render("thanks", {
                        first,
                        last,
                        signature,
                        url: req.url,
                        title:
                            req.url.slice(1, 2).toUpperCase() +
                            req.url.slice(2),
                        numOfSigners: result.rows[0].count,
                    });
                });
            }
        );
    } else {
        res.redirect("/petition");
    }
    

    

});

// Supporters Page

app.get("/supporters", (req, res) => {
    if (req.session.signatureId) {
        let supporters = db.showSupporters().then((supporters) => {
            res.render("supporters", {
                supporters,
                url: req.url,
                title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
            });
        });
    } else {
        res.redirect("/petition");
    }
    
})


// Other pages

// app.get("/actors", (req, res) => {
//     db.getActors().
//         then((results) => {
//             console.log("results from getActors", results.rows);
//         })
//         .catch((err) => {
//             console.log('Error in actors');
//         })
// });

// app.post("/add-city", (req, res) => {
//     db.addActor("Michael Fassbender", 46)
// })
//     .then(() => {
//         console.log('it worked');
//     })
//     .catch(() => {
//         console.log('failure');
//     })



app.listen(8080, () => {console.log('Petition Server is listening on 8080');})