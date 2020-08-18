'use strict';
import moment from 'moment';
import { internalServerError } from './exceptions';
import lang from '../config/lang';
import Util from './util';

export default class UtilDate {

	// TODO: revisar y mejorar
	/**
	 * Retorna la fecha recibida [date] con el formato 'YYYY-MM-DD'.
	 * Si [date] no se define o no es fecha, se retorna la fecha actual con formato 'YYYY-MM-DD'.
	 * @param {Object} data { date }
	 * @returns {Object} { success, originalDate, usedDate, date, message }
	 */
	static date(data = {}) {
		try {
			let checked = { success: false, message: 'Wrong date info' };
			let date = moment();
			if (data.date) {
				if (moment(new Date(data.date)).isValid()) {
					checked.success = true;
					if (data.format) {
						date = moment(data.date, data.format);
					} else {
						date = moment(data.date);
					}
				}
			}
			let toReturn = {
				success: true,
				originalDate: data.date,
				usedDate: (checked.success ? moment(new Date(data.date)) : moment()).format('YYYY-MM-DD'),
				date: date.format('YYYY-MM-DD')
			};
			if (!checked.success) {
				toReturn.message = checked.message;
			}
			return toReturn;
		} catch (e) {
			internalServerError({ data: e }).throw();
		}
	}

	// TODO: revisar y mejorar
	/**
	 * Retorna la fecha recibida [date] con el formato 'YYYY-MM-DD HH:mm:ss'.
	 * Si [date] no se define o no es fecha, se retorna la fecha actual con formato 'YYYY-MM-DD HH:mm:ss'.
	 * @param {Object} data { date }
	 * @returns {Object} { success, originalDate, usedDate, date, message }
	 */
	static datetime(data = {}) {
		try {
			let checked = { success: false, message: 'Wrong date info' };
			let date = moment();
			if (data.date) {
				if (moment(new Date(data.date)).isValid()) {
					checked.success = true;
					if (data.format) {
						date = moment(data.date, data.format);
					} else {
						date = moment(data.date);
					}
				}
			}
			let toReturn = {
				success: true,
				originalDate: data.date,
				usedDate: (checked.success ? moment(new Date(data.date)) : moment()).format('YYYY-MM-DD HH:mm:ss'),
				date: date.format('YYYY-MM-DD HH:mm:ss')
			};
			if (!checked.success) {
				toReturn.message = checked.message;
			}
			return toReturn;
		} catch (e) {
			internalServerError({ data: e }).throw();
		}
	}

	// TODO: revisar y mejorar
	/**
	 * Retorna un numero preciso del actual microsegundo.
	 * @returns {number}
	 */
	static specialNow() {
		const { performance } = require('perf_hooks');
		return performance.now();
	}

	// TODO: revisar y mejorar
	/**
	 * Retorna un objeto JSON con la informacion al iniciar un proceso.
	 * @returns {Object} { startedDate, startedDatetime, started }
	 */
	static startedTimes() {
		return {
			startedDate: this.date().date,
			startedDatetime: this.datetime().date,
			started: this.specialNow()
		};
	}

	static currentTime() {
		const { performance } = require('perf_hooks');
		let date = moment();
		return {
			date: date.utc().format('YYYY-MM-DD'),
			datetime: date.utc().format('YYYY-MM-DD HH:mm:ss'),
			timestamp: parseInt(`${date.utc().valueOf()}`.slice(0, -3)), // epoch o utc sin los milisegundos
			longTimestamp: date.utc().valueOf(), // epoch o utc con los milisegundos
			performance: performance.now(),
		};
	}

	/**
	 * Retorna un JSON con la informacion de la duracion de un proceso.
	 * @param {Object} data {
   *    startedDatetime,
   *    started
   * }
	 * @returns {Object} { started, ended, duration, durationLabel }
	 */
	static execTimeLapse({ startedDatetime, started, msg, usrLang = 'en' }) {
		// let startedDatetime = data.startedDatetime;
		let endedDatetime = this.datetime();
		let time = ((this.specialNow() - started) / 1000);
		return {
			started: startedDatetime,
			ended: endedDatetime.date,
			duration: Util.round({ value: time, decimals: 4 }),
			// durationLabel: this.setMessage({ message: data.durationLabel }).message // Lang.common.time.seconds['en'] => data.durationLabel
			durationLabel: msg || lang.common.time.seconds[usrLang] // Lang.common.time.seconds['en'] => data.durationLabel
		};
	}

	static add({ date, amount = 0, unit }) {

		// validamos la fecha
		!moment(date).isValid() && internalServerError({ msg: `Date invalid`, data: { date } }).throw();

		return {
			original: date,
			amount,
			date: moment(date).add(amount, unit).format('YYYY-MM-DD'),
			dateTime: moment(date).add(amount, unit).format('YYYY-MM-DD HH:mm:ss'),
			unix: 0, // TODO: programar resultado unix - timeStamp
		};

	}

	static addMinutes({ date, amount }) {
		return this.add({ date, amount, unit: 'minute' });
	}

	static addHours({ date, amount }) {
		return this.add({ date, amount, unit: 'hour' });
	}

	static addDays({ date, amount }) {
		return this.add({ date, amount, unit: 'days' });
	}

	static addMonths({ date, amount }) {
		return this.add({ date, amount, unit: 'month' });
	}

	static week({ date }) {

		// validamos la fecha
		!moment(date).isValid() && internalServerError({ msg: `Date invalid`, data: { date } }).throw();

		return {
			original: date,
			week: moment(date).isoWeek(),
		};
	}

	/**
   * Retorna la Fecha y Tiempo actuales incluyendo Milisegundos
   * Si recibe una fecha como parametro, la retorna 
   * en un formato que incluye milisegundos
   * @param {Object} data { puede ser vacio
   *    date(string), La fecha que se desea formatear
   *    trace(string), El trace perteneciente al presente proceso
   * }
   * @returns {Object} { 
   *    success, 
   *    originalDate, 
   *    usedDate, 
   *    date, 
   *    message
   * }
   */
	static formatMilliseconds(data) {
		let {
			date, // no requerido, si deseas la fecha actual no enviar este dato, enviar undefined
		} = data || {};
		return this.format({ date, format: 'YYYY-MM-DD HH:mm:ss.SSS' });
	}

	/**
	 * Metodo para dar formato a las fechas
	 * @param {*} data 
	 */
	static format(data) {
		let {
			date, // no requerido, si deseas la fecha actual no enviar este dato, enviar undefined
			format = 'YYYY-MM-DD HH:mm:ss.SSS',
		} = data || {};
		const originalDate = date;
		return {
			originalDate,
			date: moment(date).format(format),
		}
	}

}
