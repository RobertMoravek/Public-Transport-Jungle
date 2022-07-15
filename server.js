// Requires and Apps

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const hb = require("express-handlebars");


//Handlebars config
app.engine("handlebars", hb.engine());
app.set("view engine", "handlebars");
//END Handlebars config

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

app.get("/", (req, res) => {
    // res.sendStatus(301);
    res.redirect("/petition");
    return; 
})

app.get("/petition", (req, res) => {
    if (!req.cookies.petitionSigned) {
        console.log('trying to render petition');
        res.render("petition");
        // Show petition sign page
        return;
    }

    res.redirect("/thanks");
    return;
})

app.post("/petition", (req, res) => {
    if (!req.cookies.petitionSigned) {
        // IF inputs are valid -> save to db, set cookie and redirect to /thanks
        // if (inputs are valid) {
        //     res.cookie("petitionSigned", true)
        //     //save to DB
        //     // .then redirect to /thanks
        //     return;
        // }

        // ELSE reload petition with Error message
        return;
    };
});


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