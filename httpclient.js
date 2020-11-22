const {
    config
} = require("./config");

const axios = require("axios");

class HttpClient {

    yelpClient;

    constructor(config) {
        this.config = config;

        this.yelpClient = axios.create({
            baseURL: this.config.YELP_API_BASE_PATH,
            headers: {
                Authorization: `Bearer ${this.config.YELP_API}`,
                "Content-type": "application/json",
            },
        });
    }

    processYelp(cityName) {
        return this.yelpClient("businesses/search", {
			params: {
				"location": `${cityName}`
			}
		});
    }

    processOpenWeather(cityName) {
        return axios.get(`${process.env.OPENWEATHER_BASE_PATH}weather?q=${cityName}&APPID=${process.env.OPENWEATHER_API}`);
    }

}

exports.httpClient = new HttpClient(config)