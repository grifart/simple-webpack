
import "./scss/something.scss";
import {test} from "./test/testModule";
import './assets/test.csv';

// Some random ES6 feature, that needs to be transpiled to older JS
async function testAsync () {
	return new Promise((resolve => {resolve(true)}));
}

class TypeScriptTest {
	private test: TypeScriptTest|null = null;
	protected protected() {}

	public static run(): boolean {return true;}
	public run(): boolean {return false;}
}

(async function() {
	await testAsync();
	test();

	const instance: TypeScriptTest = new TypeScriptTest();
	instance.run();
	TypeScriptTest.run();

	console.log("something");
})();
