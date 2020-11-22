const dotenv = require('dotenv');
const { logger } = require('./logger');
dotenv.config();

class Config {
    
    YELP_API_BASE_PATH;
    OPENWEATHER_BASE_PATH;
    OPENWEATHER_API;
    YELP_API;
    HOSTNAME;
    PORT;
    CITIES;

    constructor(){

        this.YELP_API_BASE_PATH = process.env.YELP_API_BASE_PATH;
        this.OPENWEATHER_BASE_PATH = process.env.OPENWEATHER_BASE_PATH;
        this.OPENWEATHER_API = process.env.OPENWEATHER_API;
        this.YELP_API = process.env.YELP_API;
        this.HOSTNAME = process.env.HOSTNAME;
        this.PORT = process.env.PORT;        
        this.CITIES = (process.env.CITIES || "").split("|");
        Object.keys(this).forEach((name) => {
            if(!this[name]){
                logger.fatal(`${name} is not defined in env`);
            }
        })
    }
}

exports.config = new Config();