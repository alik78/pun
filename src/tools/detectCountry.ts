let map = {
	"Kiev": "UA",
	"Uzhgorod": "UA",
	"Zaporozhye": "UA",
	"Wake": "US",
	"New_York": "US",
	"Detroit": "US",
	"Louisville": "US",
	"Monticello": "US",
	"Indianapolis": "US",
	"Vincennes": "US",
	"Winamac": "US",
	"Marengo": "US",
	"Petersburg": "US",
	"Vevay": "US",
	"Chicago": "US",
	"Tell_City": "US",
	"Knox": "US",
	"Menominee": "US",
	"Center": "US",
	"New_Salem": "US",
	"Beulah": "US",
	"Denver": "US",
	"Boise": "US",
	"Phoenix": "US",
	"Los_Angeles": "US",
	"Anchorage": "US",
	"Juneau": "US",
	"Sitka": "US",
	"Metlakatla": "US",
	"Yakutat": "US",
	"Nome": "US",
	"Adak": "US",
	"Honolulu": "US",
	"Midway": "US",
	"St_Thomas": "US",
}

 export default () => {
	if (typeof window === 'undefined') return

	// override country with the query parameter for testing
	if (location?.search) {
		let query = location.search.slice(1)
		let params = Object.fromEntries(query.split('&').map(x => x.split('=')))
		if (params.country) {
			// console.log('country overrided', params.country)
			return params.country
		}
	}

	let tz = Intl?.DateTimeFormat().resolvedOptions().timeZone || ''
	let a = tz.split('/')
	let city = a[a.length - 1]
	let country = map[city] || 'other'
	// console.log('country detected', country)
	return country
}