## Getting started

1. Add the following variables to your `.env`: 

        # mandatory
        DB_URI = URI to mongodb 
        ID_SALT = salt for encryption 
        
        # optional 
        SKILL_R = radius for skill node
        USER_R = radius for user node

2. Install dependencies

        npm install

3. Run the development server

        npm run dev