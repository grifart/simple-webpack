
import "./scss/something.scss";

// Some random ES6 feature, that needs to be transpiled to older JS
async function testAsync () {
	return new Promise((resolve => {resolve()}));
}

(async function() {
	await testAsync();
	console.log("something");
})();
