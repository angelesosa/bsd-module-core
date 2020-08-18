'use strict';

export default class UtilArray {
	static removeRepeatedItems({ items = [], idName }) {}

	/**
	 * Transformamos y agrupamos los elementos de un array en un objeto con keys unicos de acuerdo a "groupKeyName" enviado.
	 * 
	 * Caso de uso 1:
	 * - Tienes un array de objetos monedas, cada moneda tien una key "country"
	 * Se desea tener un objeto {} donde cada key sea el pais y dentro este el array de monedas
	 * @example
	 * const countryCurrencies = arrToObj({ items: array, groupKeyName: 'countryId', valueBeAnObj: false });
	 * 
	 * Caso de uso 2:
	 * - Tienes un array de 1000 de usuarios backOffice y quieres evitar hacer iteraciones con map() o find() etc 
	 * Se desea que en vez de un array sea un objeto donde cada key del objeto sea el userId
	 * para acceder al contenido de la forma users[userId]
	 * @example
	 * const usersObj = arrToObj({ items: usersArray, groupKeyName: 'userId', valueBeAnObj: true });
	 * 
	 * @param groupKeyName: key del objeto del array, servira para hacer la agrupacion de acuerdo a este valor
	 * @param valueBeAnObj: flag booleano que indica si quieres que el valor de la key del objeto sea un array o un objeto
	 * Debes usar array, cuando el valor "groupKeyName" esta en varios objetos del array, revisar caso de uso 1
	 * Debes usar objeto, cuando el valor "groupKeyName" es unico para cada del array, revisar caso de uso 2  
	 */
	static arrToObj(data) {
		// << ****** Parametros ****** >> //
		let { items, groupKeyName, valueBeAnObj = true } = data || {}; // (*) required

		// << ****** variables ****** >> //
		// funcion donde value = object, estara el ultimo item que coincida con la key
		const valuesObjectFunc = (acc, item) => {
			acc[item[groupKeyName]] = item;
			return acc;
		};
		// funcion donde value = array, estaran todos los items que coincidan con la key
		const valuesArrayFunc = (acc, item) => {
			acc[item[groupKeyName]] = acc[item[groupKeyName]] || [];
			acc[item[groupKeyName]].push(item);
			return acc;
		};

		// << ****** condiciones previas ****** >> //
		if (!items.length) return items;

		//<<****** flujo basico y altenos ******>>//
		const func = valueBeAnObj ? valuesObjectFunc : valuesArrayFunc;
		const result = items.reduce(func, {});
		return result;
	}
}
