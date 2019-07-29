
import "./scss/something.scss";

// Some random ES6 feature, that needs to be transpiled to older JS
async function testAsync () {
	return new Promise((resolve => {resolve()}));
}

class TypeScriptTest {
	private test: TypeScriptTest;
	protected protected() {}

	public static run(): boolean {return true;}
	public run(): boolean {return false;}
}

(async function() {
	await testAsync();

	const instance: TypeScriptTest = new TypeScriptTest();
	instance.run();
	TypeScriptTest.run();

	console.log("something");
})();
