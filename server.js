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


// USING and GETTING


app.use(express.static("./public"));



// Register

app.get("/register", (req, res) => {
    if (!req.session.userId) {
        console.log("trying to render registration page");
        res.render("register", {
            register: true,
            url: req.url,
            title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
            loggedin: req.session.userId
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
                    db.checkSignature(result)
                    .then((result) => {
                            console.log(result);
                            req.session.signed = result;
                            res.redirect("/profile");
                            return;
                    });
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
                        loggedin: req.session.userId,
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
                loggedin: req.session.userId
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
                        db.checkSignature(result)
                            .then((result) => {
                                req.session.signed = result;
                                res.redirect("/petition");
                                return;
                            })
                    } else {
                        res.render("login", {
                            loginFailed: true,
                            email,
                            password,
                            url: req.url,
                            title:
                                req.url.slice(1, 2).toUpperCase() +
                                req.url.slice(2),
                            loggedin: req.session.userId,
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
                        loggedin: req.session.userId,
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
                loggedin: req.session.userId
            });
            return;
        }
    } else {
        res.redirect("/thanks");
    }
});


// Profile Page

app.get("/profile", (req, res) => {
    console.log("trying to render profile page");
    if (req.session.userId) {
        res.render("profile", {
            url: req.url,
            title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
            loggedin: req.session.userId,
        });
        return;
    }

    res.redirect("/register");
    return;
});

app.post("/profile", (req, res) => {
    if (req.session.userId) {
        let { age, city, userUrl } = req.body;
        if (age == ""){
            age = undefined;
        }
        
        
        function deleteSpacesFromBeginning(input) {
            if (input.startsWith(" ")) {
                console.log("if");
                input = input.slice(1);
                console.log("input after slice", input);
                deleteSpacesFromBeginning(input);
                return input;
            } else {
                console.log("else", input);
                city = input;
            }
        }
        deleteSpacesFromBeginning(city);
        deleteSpacesFromBeginning(userUrl);
        
        if (!userUrl.startsWith("http://") || !userUrl.startsWith("https://")) {
            userUrl = "https://" + userUrl;
        };

        city = city.toLowerCase();
        db.insertProfile(req.session.userId, age, city, userUrl)
            .then(() => {
                console.log('redirecting to petition');
                res.redirect("/petition");
                
            })
            .catch((err) => {
                console.log("insert Error", err);
                res.redirect("/petition");
                return;
            });
        
        
    } else {
        res.redirect("/login");
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
            // console.log('result of checkSignature', result);
            if (result) {
                res.redirect("/thanks");
                return;
            } else {
                console.log("trying to render petition");
                res.render("petition", {
                            url: req.url,
                            title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                            loggedin: req.session.userId
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
                loggedin: req.session.userId
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
                        loggedin: req.session.userId
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
        let supporters = db.showSupporters()
            .then((supporters) => {
                // console.log("Supporters: ",supporters)
                for (let item of supporters) {
                    if (item.city){
                        item.cityLink = item.city.split(" ").join("-");
                        console.log(item.city);
                        item.city = item.city.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join(" ");

                    }
                };
                
                res.render("supporters", {
                    supporters,
                    url: req.url,
                    title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                    loggedin: req.session.userId
                });
            });
    } else {
        res.redirect("/register");
    }
    
})

app.get("/logout", (req, res) => {
    req.session = undefined;
    
    res.redirect("../login");
    
})

app.get("/supporters/:city", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/login");
        return;
    } else {
        req.params.city = req.params.city.split("-").join(" ");
        console.log(req.params.city);
        db.showSupportersCity(req.params.city)
            .then((supporters) => {
                for (let item of supporters) {
                item.cityLink = item.city.split(" ").join("-");
                item.city = item.city.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join(" ");
            };
                res.render("supporterscity", {
                    supporters,
                    url:  "/supporters",
                    title: "Supporters from " + req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                    loggedin: req.session.userId,
        });
            })
        

    }

});

app.listen(8080, () => {console.log('Petition Server is listening on 8080');})