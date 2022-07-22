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


// USE HTTPS





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

    res.redirect("/petition");
    return;
});

app.post("/register", (req, res) => {
    if (!req.session.userId) {
        let { firstName, lastName, email, password } = req.body;

        if (firstName && lastName && email && password.length > 7) {
            
            [firstName, lastName, email] = trim([firstName, lastName, email]);
            
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
        return;
    } else {
        res.redirect("/petition");
        return;
    }
});


app.post("/login", (req, res) => {
    if (!req.session.userId) {
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
                            });
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

        [city, userUrl] = trim([city, userUrl]);
        console.log('city in post profile', city);
        
        if(userUrl != ""){
            if (!userUrl.startsWith("http://") || !userUrl.startsWith("https://")) {
                userUrl = "https://" + userUrl;
            }
        }
            

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


// Profile EDIT Page

app.get("/edit-profile", (req, res) => {
    console.log("trying to render edit profile page");
    if (req.session.userId) {
        db.getProfile(req.session.userId)
            .then((result) => {
                let {first, last, email} = result[0].rows[0];
                let {age, city, userurl} = result[1].rows[0];
                // console.log(result[1]);
                city = city.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join(" ");
                console.log(first, last, email, age, city, userurl);
                res.render("edit-profile", {
                    updateFailed: true,
                    first,
                    last,
                    email,
                    age,
                    city,
                    userurl,
                    url: req.url,
                    title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                    loggedin: req.session.userId,
                });
            });
        return;
    }

    res.redirect("/login");
    return;
});

app.post("/edit-profile", (req, res) => {
    if (req.session.userId) {
        let { firstName, lastName, email, password, age, city, userUrl } = req.body;
        if (age == ""){
            age = undefined;
        }
        
        [firstName, lastName, email, city, userUrl] = trim([firstName, lastName, email, city, userUrl]);
        city = city.toLowerCase();
        
        if(userUrl != ""){
            if (!userUrl.startsWith("http://") && !userUrl.startsWith("https://")) {
                userUrl = "https://" + userUrl;
            }
        }
        console.log(req.session.userId, firstName, lastName, email, age, city, userUrl, password);
        
        db.updateProfile(req.session.userId, firstName, lastName, email, age, city, userUrl, password)
            .then(() => {
                console.log('redirecting to petition');
                res.redirect("/petition");
                return;
            })
            .catch((err) => {
                console.log(err);
                res.render("edit-profile", {
                    uupdateFailed: true,
                    firstName,
                    lastName,
                    email,
                    password,
                    age,
                    city,
                    url: req.url,
                    title:
                            req.url.slice(1, 2).toUpperCase() +
                            req.url.slice(2),
                    loggedin: req.session.userId,
                });


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
});

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

});

app.post("/petition", (req, res) => {
    if (req.session.userId && !req.session.signed) {
        let { signatureURL } = req.body;
        // console.log(req.body);
        // console.log(firstName, lastName, signatureURL);
        if ( signatureURL) {
            db.addSignature(req.session.userId, signatureURL)
                .then(() => {
                    req.session.signed = true;
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
        res.redirect("/thanks");
    }
});


// Thanks Page

app.get("/thanks", (req, res) => {
    if (req.session.signed) {
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
        res.redirect("/petition");
    }
});


// Supporters Page

app.get("/supporters", (req, res) => {
    if (req.session.signed) {
        let supporters = db.showSupporters()
            .then((supporters) => {
                // console.log("Supporters: ",supporters)
                for (let item of supporters) {
                    if (item.city){
                        item.cityLink = item.city.split(" ").join("-");
                        console.log(item.city);
                        item.city = item.city.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join(" ");

                    }
                }
                
                res.render("supporters", {
                    supporters,
                    url: req.url,
                    title: req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                    loggedin: req.session.userId
                });
            });
    } else {
        res.redirect("/petition");
    }
    
});

app.get("/logout", (req, res) => {
    req.session = undefined;
    
    res.redirect("../login");
    
});

app.get("/supporters/:city", (req, res) => {
    if (!req.session.signed) {
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
                }
                res.render("supporterscity", {
                    supporters,
                    url:  "/supporters",
                    title: "Supporters from " + req.url.slice(1, 2).toUpperCase() + req.url.slice(2),
                    loggedin: req.session.userId,
                });
            });
    }
});

app.post("/delete-signature", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/login");
        return;
    } else {
        db.deleteSignature(req.session.userId)
            .then(() => {
                req.session.signed = false;
                res.redirect("/petition");
                return;
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

app.post("/delete-account", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/login");
        return;
    } else {
        db.deleteAccount(req.session.userId)
            .then(() => {
                req.session = undefined;
                res.redirect("/petition");
                return;
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

function trim(input) {
    console.log('I am trimming');
    for (let i = 0; i < input.length; i++) {
        input[i] = input[i].trim();
    }
    console.log(input);
    return input;
}


if (require.main == module) {
    app.listen(process.env.PORT || 8080);
}

module.exports = app;