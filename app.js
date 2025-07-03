require('dotenv').config();
const express = require('express');
const session = require('express-session');
const msal = require('@azure/msal-node');

const app = express();
const port = 3000;

// Session middleware
app.use(session({
    secret: 'some_random_secret',
    resave: false,
    saveUninitialized: false
}));

// MSAL config
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Info,
        }
    }
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

// Home page
app.get('/', (req, res) => {
    if (req.session.account) {
        res.send(`
      <h1>Hello, ${req.session.account.name} , ${req.session.account}</h1>
      <p><a href="/logout">Logout</a></p>
    `);
    } else {
        res.send('<a href="/login">Login with Microsoft</a>');
    }
});

// Start login
app.get('/login', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["openid", "profile", "email"],
        redirectUri: process.env.REDIRECT_URI
    };

    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

// Handle redirect
app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["openid", "profile", "email"],
        redirectUri: process.env.REDIRECT_URI
    };

    pca.acquireTokenByCode(tokenRequest).then((response) => {
        req.session.account = response.account;
        res.redirect('/');
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error acquiring token');
    });
});


// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000');
    });
});

// Start server
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
