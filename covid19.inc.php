<?php
/**
 * covid19 - API implementation
 *
 * @copyright kongkika.gr 03/2020 - All rights reserved
 */


/**
 * 
 * Covid19 record
 */
Class Covid19Record {

	/**
	 * ID
	 * @var string $id
	 */
	var $id = "";

	/**
	 * Province
	 * @var string $province
	 */
	var $province = "";

	/**
	 * Country
	 * @var string $country
	 */
	var $country = "";

	/**
	 * Timestamp - Last update
	 * @var string $timestamp
	 */
	var $timestamp = "";

	/**
	 * Confirmed - Number of confirmed cases
	 * @var string $confirmed
	 */
	var $confirmed = "";

	/**
	 * Deaths
	 * @var string $deaths
	 */
	var $deaths = "";

	/**
	 * Recovered
	 * @var string $recovered
	 */
	var $recovered = "";

	/**
	 * Fill record
	 * @param array $array fields
	 */
	function fillRecord($array) {

		list(
			$this->id,
			$this->province,
			$this->country,
			$this->timestamp,
			$this->confirmed,
			$this->deaths,
			$this->recovered
			) = $array;

	}

}


/**
 * Covid19 class
 * Get covid19 data / information using the https://covid-api.quintessential.gr/data/
 * 
 */
Class Covid19 extends Covid19Record {

	/**
	 * Debug mode
	 * @var boolean debug mode
	 */
	var $debug = true;

	/**
	 * Debug log
	 * @var array Debug log
	 */
	var $debugLog = array();

	/**
	 * Url to cURL
	 * @var string $url API URL
	 */
	var $url = "https://covid-api.quintessential.gr/data/";

	/**
	 * NOT USED
	 * API Host
	 * @var string $host api host
	 */
	var $apihost = "";

	/**
	 * NOT USED
	 * API key
	 * @var string $apikey API key
	 */
	var $apikey = "";

	/**
	 * Province
	 * @var string $country
	 */
	var $province = "";

	/**
	 * Country name
	 * @var string $country
	 */
	var $country = "";

	/**
	 * API Response
	 * @var string $response
	 */
	var $response = "";


	/**
	 * Constructor
	 * @param array $CONFIG optional array with keys {'url', 'apikey'}
	 * @param $CONFIG array
	 */
	function __construct($CONFIG=array()) {
		if(isset($CONFIG['apikey']))
			$this->apikey = $CONFIG['apikey'];
	}

	/**
	 * Log error
	 * @param string $func function name error occurred
	 * @param string $desc error description
	 * @return boolean
	 */
	private function _logError($func, $desc="") {

		if($this->debug==true)
			$this->debugLog[] = "[covid19 error on function: '".$func."' ] DESC: ".$desc;
		return true;

	}

	/**
	 * @param string $url
	 * @return boolean
	 */
	private function _APICall($url) {

		// Validate input
		if(filter_var($url, FILTER_VALIDATE_URL)==false) {
			$this->_logError(__FUNCTION__, "Invalid URL");
			return false;
		}

		if($this->debug==true)
			$this->debugLog[] = "[INFO] Request URL: ".$url;

		// Init curl
		$curl = curl_init();

		// Curl options
		$options = array(
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET"
		);

		curl_setopt_array($curl, $options);

		// Transmit data
		$response = curl_exec($curl);

		// Check for errors
		$err = curl_error($curl);
		curl_close($curl);
		if($err) {
			$this->_logError(__FUNCTION__, print_r($err, true));
			return false;
		}

		// Store response
		$this->response = $response;

		return true;

	}

	/**
	 * Get countries array
	 *
	 * @return array
	 */
	public function getCountries() {

		return json_decode(file_get_contents(__DIR__."/countries.json"));

	}

	/**
	 * Get countries and related population
	 *
	 * @return array
	 */
	public function getCountryByPopulation() {

		return json_decode(file_get_contents(__DIR__."/country-by-population.json"), true);

	}

	/**
	 * Get data for specific country
	 * @param $country string Country name
	 * @param $date Date format : MM-DD-YYYY
	 *
	 * @return boolean
	 */
	public function getData($country="", $date="") {

		// Initialize params array
		$params = array();

		if($country!="" && $date!="")
			$params = array("country" => $country, "date" => $date);
		elseif($country!="" && $date=="")
			$params = array("country" => $country);

		$url = "";
		if(sizeof($params)!=0)
			$url = $this->url."custom";

		// Countries array
		$url = $this->buildURL($params, $url);

		$this->_APICall($url);

		// var_dump($this->response);

		return json_decode($this->response, true);

	}

	/**
	 * Build request URL
	 * @param $params GET parameters
	 *
	 * @return string
	 */
	public function buildURL($params=array(), $url="") {

		if($url=="")
			$url = $this->url;

		if(sizeof($params)==0)
			return $url;
		else
			return $url."?".http_build_query($params);

	}

}
