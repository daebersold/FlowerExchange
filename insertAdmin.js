// Run by using:
// mongo < insertAdmin.js
// Be sure to set your TOKEN below to something private when going live.
use flower-exchange

db.accounts.insert({
    "username":"bobjohnson1414",
    "token": "asecretprivatetoken",
    "resetToken": "",
    "resetTokenDate": ISODate("2016-11-16T05:17:40.370Z"),
    "resetTokenTimeout": "",
    "active": true,
    "isSuperUser": true,
    "loc": {
        "coordinates": [-118.4003563,
            34.0736204
        ],
        "type": "Point"
    },
    "geoCode": [{
        "provider": "google",
        "countryCode": "US",
        "country": "United States",
        "city": "Beverly Hills",
        "administrativeLevels": {
            "level1short": "CA",
            "level1long": "California",
            "level2short": "Los Angeles County",
            "level2long": "Los Angeles County"
        },
        "extra": {
            "establishment": null,
            "neighborhood": null,
            "subpremise": null,
            "premise": null,
            "confidence": 0.5,
            "googlePlaceId": "ChIJq0fR1gS8woAR0R4I_XnDx9Y"
        },
        "longitude": -118.4003563,
        "latitude": 34.0736204,
        "formattedAddress": "Beverly Hills, CA, USA"
    }],
    "name": "John Doe",
    "address1": "1000 Rodeo Dr.",
    "address2": "Suite F",
    "city": "Beverly Hills",
    "state": "CA",
    "zip": "90210",
    "contactEmail": "YourEmail@dalogics.com",
    "contactPhone": "5555555555",
    "autoAcceptIfMoreThan": 90,
    "autoRejectIfLessThan": 50,
    "minimumOrderAmount": 50,
    "defaultMileRadiusForAutoAcceptReject": 125,
    "dateModified": ISODate("2016-11-16T05:17:40.370Z"),
    "dateCreated": ISODate("2016-11-16T05:17:40.370Z"),
    "__v": 0
});