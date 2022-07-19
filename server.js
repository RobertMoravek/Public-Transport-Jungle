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



// -> DB
const db = require("./db.js");


let loggedin;

app.use("/*", (req, res, next) => {
    if (req.session.userId) {
        loggedin = true;
    } else {
        loggedin = false;
    }
    console.log("loged in", loggedin);
    next();

})


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



// Register

app.get("/register", (req, res) => {
    if (!req.session.userId) {
        console.log("trying to render registration page");
        res.render("register", {
            register: true,
            url: req.url,
            title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
            loggedin
        });
        return;
    }

    res.redirect("/thanks");
    return;
});

app.post("/register", (req, res) => {
    if (!req.session.signatureId) {
        let { firstName, lastName, email, password } = req.body;

        if (firstName && lastName && email && password.length > 7) {
            db.insertUser(firstName, lastName, email, password)
                .then((result) => {
                    req.session.userId = result;
                    res.redirect("/petition");
                    return;
                })
                .catch((err) => {
                    console.log("Error on database query:", err);
                    res.render("register", {
                        registrationFailed: true,
                        firstName,
                        lastName,
                        email,
                        password,
                        url: req.url,
                        title:
                            req.url.slice(1, 2).toUpperCase() +
                            req.url.slice(2),
                        loggedin,
                    });
                    return;
                });
        } else {
            res.render("register", {
                registrationFailed: true,
                firstName,
                lastName,
                email,
                password,
                url: req.url,
                title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                loggedin
            });
            return;
        }
    } else {
        res.redirect("/thanks");
    }
});



// Login

app.get("/login", (req, res) => {
    if (!req.session.userId){
        res.render("login", {
            url: req.url,
            title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
        });
        return
    } else {
        res.redirect("/thanks");
        return
    }
})


app.post("/login", (req, res) => {
    if (!req.session.signatureId) {
        let { email, password } = req.body;

        if (email && password) {
            db.loginUser(email, password)
                .then((result) => {
                    console.log("result in then of loginUser in server", result);
                    if(result){
                        req.session.userId = result;
                        res.redirect("/petition");
                        return;
                    } else {
                        res.render("login", {
                            loginFailed: true,
                            email,
                            password,
                            url: req.url,
                            title:
                                req.url.slice(1, 2).toUpperCase() +
                                req.url.slice(2),
                            loggedin,
                        });
                        return;
                    }
                })
                .catch((err) => {
                    console.log("Error on database query:", err);
                    res.render("login", {
                        loginFailed: true,
                        email,
                        password,
                        url: req.url,
                        title:
                            req.url.slice(1, 2).toUpperCase() +
                            req.url.slice(2),
                        loggedin,
                    });
                    return;
                });
        } else {
            res.render("login", {
                loginFailed: true,
                email,
                password,
                url: req.url,
                title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                loggedin
            });
            return;
        }
    } else {
        res.redirect("/thanks");
    }
});


// Home Directory Redirects to Petition

app.get("/", (req, res) => {
    // res.sendStatus(301);
    res.redirect("/petition");
    return; 
})

// Petition page

app.get("/petition", (req, res) => {
    

    if (req.session.userId) {
        
        db.checkSignature(req.session.userId)
        .then((result) => {
            if (result) {
                res.redirect("/thanks");
                return;
            } else {
                console.log("trying to render petition");
                res.render("petition", {
                            url: req.url,
                            title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                            loggedin
                        });
                        // Show petition sign page
                return;
            }
        });

        
    } else {
        res.redirect("/register");
        return;
        
    }

})

app.post("/petition", (req, res) => {
    if (req.session.userId) {
        let { signatureURL } = req.body;
        // console.log(req.body);
        // console.log(firstName, lastName, signatureURL);
        if ( signatureURL) {
            db.addSignature(req.session.userId, signatureURL)
                .then(() => {
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
                signatureURL,
                url: req.url,
                title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                loggedin
            });
            return;
        }
    } else {
        res.redirect("/register");
    };
});


// Thanks Page

app.get("/thanks", (req, res) => {
    if (req.session.userId) {
        db.showSigner(req.session.userId).then(
            ([resultUser, resultSignature]) => {
                console.log('resultUser, resultSignature', resultUser, resultSignature);
                db.getNumOfSigners().then((result) => {
                    res.render("thanks", {
                        first: resultUser.first,
                        last: resultUser.last,
                        signature: resultSignature.signature,
                        url: req.url,
                        title:
                            req.url.slice(1, 2).toUpperCase() +
                            req.url.slice(2),
                        numOfSigners: result.rows[0].count,
                        loggedin
                    });
                });
            }
        );
    } else {
        res.redirect("/register");
    }
    

    

});

// Supporters Page

app.get("/supporters", (req, res) => {
    if (req.session.userId) {
        let supporters = db.showSupporters().then((supporters) => {
            res.render("supporters", {
                supporters,
                url: req.url,
                title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                loggedin
            });
        });
    } else {
        res.redirect("/register");
    }
    
})

app.get("/logout", (req, res) => {
    req.session.userId = undefined;
    loggedin = false;
    res.redirect("/login");
    
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