"use strict";

const csvParser    = require('csv-parser'),
      fs           = require('fs'),
      fsp          = fs.promises,
      moment       = require('moment');

process.chdir('..');

const outStream = fs.createWriteStream('csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global-normalized.json').on('error', (err) => console.error(err));

fs.createReadStream('csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
    .on('error', (err) => {
        console.error(err)
    })
    .pipe(csvParser())
    .on('data', (data) => {
        const provState     = data['Province/State'],
              countryRegion = data['Country/Region'];

        const timeSeriesData = Object.keys(data)
            .filter(fieldName => fieldName.match(/\d{1,2}\/\d{1,2}\/\d{1,2}/))
            .map(dateFieldName => ({
                date : moment(dateFieldName, 'M/D/YY').format('YYYY-MM-DD'),
                count: data[dateFieldName]
            }));

        timeSeriesData.forEach(dataPoint => {
            outStream.write(JSON.stringify({
                provState,
                countryRegion,
                ...dataPoint
            }) + '\n')
        })

    });