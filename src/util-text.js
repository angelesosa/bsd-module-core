'use strict';

export default class Utiltext {

	/**
	 * Eliminar acentos / diacríticos en una cadena
	 * @param {*} data
	 * https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/5084774#5084774
	 */
	static normalize({ text = '', convertCase }) {
		let result = '';
		switch (convertCase) {
			case 'l':
				result = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
				break;
			case 'u':
				result = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
				break;
			default:
				result = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
				break;
		}
		return result;
	}

	static removeApostrophes({ text = '' }) {
		return text.replace(new RegExp(`'`, 'g'), ``);
	}

}
