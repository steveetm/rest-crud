NodeJS, Express, MySQL example

## Installation

* Install NodeJS 6 LTS
* Install a MySQL server
* Install a minimal webserver(lighttpd, ngninx)

    
    cd server
    npm install
    

## Configuration (database)


Adjust for your needs: `server/config/default.json`

        host: 'localhost',
        user: 'root',
        password : 'root',
        port : 3306, //port mysql
        database:'test'	

	
You're gonna need to create a DB named 'test' or whatever you name it,  import t_user.sql


## Webserver

Set your webserver's root to `client` directory

## Open your Browser

Navigate to your webserver's address and open `user.html`



