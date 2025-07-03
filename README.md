# Simple node app which authenticate using Microsoft Entra ID (SC-300)  
Create a .env file and put the below information (info are secret, don't commit)

# .env File
CLIENT_ID=0a392cc8-6743-9acc-4710-e94dde455432
CLIENT_SECRET=QCG8Q~Nggasdhdvjdvove3yVF19fAWUiNaGJKqdzi
TENANT_ID=a5f2fe7a-77b5-4874-9651-1fdkjvev75a
REDIRECT_URI=http://localhost:3000/redirect  

# Run the app

node app.js

# You need to register the app on Entra ID
make sure the redirect URI matches here
