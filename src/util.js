'use strict';
import { uuid } from 'uuidv4';

export default class Util {

	/**
	 * @deprecated
	 * Usar la clase UtilHapiApi
	 * @param {*} param0 
	 */
	static remoteIpAddress({ req }) {
		throw Error('deprecated');
		const xFF = req.headers['x-forwarded-for'];
		const ip = xFF ? xFF.split(',')[0] : req.info.remoteAddress;
		return ip;
	}

	/**
	 * Retorna un codigo aleatorio unico para ser usado como trace.
	 * @returns {string}
	 */
	static trace() {
		return uuid(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
	}

	/**
	 * Redondea el valo de [value] al numero de decimales indicado en [decimals].
	 * @param {Object} data { value, decimals }
	 * @returns {number}
	 */
	static round(data) {
		return Number(Math.round(data.value + 'e' + data.decimals) + 'e-' + data.decimals);
	}

	/**
	 * Para obtener el nombre de una variable
	 * @param {Object} obj - objeto con una varible, si tiene mas de una solo se tomara la primera
	 * @example
	 * 		const someVar = 42
	 * 		const displayName = varToString({ someVar })
	 * 		console.log(displayName) // someVar
	 */
	static varToString(obj) {
		return Object.keys(obj)[0];
	}

	/**
	 *  para obtener un valor aleatorio de una propiedad
	 * @param {*} obj 
	 */
	static randomProperty(obj) {
		const keys = Object.keys(obj);
		const index = keys.length * Math.random() << 0;
		return obj[keys[index]];
	}
}
