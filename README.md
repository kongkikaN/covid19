# Covid19

covid19.inc.php is a php class to get information on the new coronavirus - covid-19.
This - quick and dirty - project uses the 'covid-19' API developed by [quintessential.gr](https://covid-api.quintessential.gr/data/)
In no way is this used to gain any profit. This is just a project that was created by me in my free time in order to get more familiar with the p5.js library. You can visit / view the full project at [https://covid-19.kongkika.gr](https://covid-19.kongkika.gr/)


## Usage

It is fairly easy to get information about coronavirus for a country. Use the 'countries.json' file to select a country and call the 'getData' function. E.g:

```php
$c19 = new Covid19();
$countries = $c19->getCountries();
$c19->getData($countries[0]);
var_dump($c19);
```

## Covid-19 Simulation

In this project you will also find a simulation on how the virus ( maybe it would be better to say 'a' virus ) spreads. For the simulation I am using the p5.js library and displaing the results using the chart.js library. You can run a simulation at [https://covid-19.kongkika.gr](https://covid-19.kongkika.gr/?action=simulation) 

## License

This project goes under the [MIT](https://choosealicense.com/licenses/mit/) license
