const http = require('http');
const axios = require("axios");
const axiosYelp = require("axios");
const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors')
const {
	logger
} = require("./logger");

const {
	httpClient
} = require("./httpClient");
const {
	config
} = require("./config");

var app = express();
app.use(cors())

var cityToParse = config.CITIES;

dotenv.config();

const validateCity = (req, res, next) => {
	const city = req.params.city;

	if (cityToParse.find(f => f.toLocaleLowerCase() === city.toLocaleLowerCase()) === undefined) {
		res.status(404).send({
			msg: 'city not found',
			code: 404
		});
		logger.error(`error 404 for ${req.params.city}`);
	} else {
		next();
	}
}

app.get('/cities/:city', validateCity, async (req, res) => {
	logger.info(`start getting data for ${req.params.city}`);
	try {
		const response = await asyncFunc(req.params.city);
		logger.info(`retrieved data for ${req.params.city}`);
		res.status(200).send(response);
	} catch (ex) {
		logger.error(`error gettign data for ${req.params.city}`);
		logger.error(`${ex}`);
	}
});

app.get('/v2.0/cities/:city', validateCity, async (req, res) => {
	logger.info(`start getting data for ${req.params.city}`);
	try {
		const cityName = req.params.city;

		const yelp = await httpClient.processYelp(cityName);
		const openWeather = await httpClient.processOpenWeather(cityName);

		const response = {
			...openWeather.data,
			...yelp.data
		}

		res.status(200).send(response);
		logger.info(`retrieved data for ${req.params.city}`);
	} catch (ex) {
		logger.error(`error gettign data for ${req.params.city}`);
		logger.error(`${ex}`);
	}
});

app.get('/', async function (req, res) {
	logger.info(`start getting data for ${req.params.city}`);

	const result = {};

	for (const cityName of cityToParse) {
		try {
			logger.info(`start getting data for ${cityName}`);

			const yelp = await httpClient.processYelp(cityName);
			const openWeather = await httpClient.processOpenWeather(cityName);

			const response = {
				openWeather: openWeather.data,
				yelp: yelp.data
			}

			result[cityName] = response;
			logger.info(`retrieved data for ${cityName}`);

		} catch (e) {
			logger.error(`error gettign data for ${cityName}`);
			logger.error(`${ex}`);
		}

	}

	res.status(200).send(result);
});

app.listen(config.PORT, config.HOSTNAME, function () {
	console.log(`http://${config.HOSTNAME}:${config.PORT}`);
});


async function asyncFunc(city) {

	let yelpREST = axiosYelp.create({
		baseURL: "https://api.yelp.com/v3/",
		headers: {
			Authorization: `Bearer ${process.env.YELP_API}`,
			"Content-type": "application/json",
		},
	});

	try {
		const openWeatherResponse = await axios.get(`${process.env.OPENWEATHER_BASE_PATH}weather?q=${city}&APPID=${process.env.OPENWEATHER_API}`);
		const yelpResponse = await yelpREST("businesses/search", {
			params: {
				"location": `${city}`
			}
		});

		return {
			...openWeatherResponse.data,
			...yelpResponse.data
		};
	} catch (e) {
		console.log(e);
	}
}
