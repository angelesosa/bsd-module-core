'use strict';

import { internalServerError } from "./exceptions";
import knexFactory from 'knex';
import etc from "../config/etc";

/**
 * Clase para el manejo de ejecucion de script | queries de base de datos
 * Nota: para su correcto funcionamiento se requiere que en el index se ejecute los string.extension:
 * import { strExtensions } from 'bsd-module-core/src/string.extensions';
 * strExtensions();
 */
export default class UtilDB {

	/**
	 * Lista de patrones para realizar los fitlros en itemsDB
	 * Diseñado para poder soportar las distintas variaciones de un where
	 *
	 * @example
	 	export default class Data {
			static filtersAllowed() {
				return {
					name: {
						column: `name`,
						label: `name`,
						pattern: UtilDB.equalPattern,
						order: `Asc`,
					},
					...
				};
			}
	 */
	static get patterns() {
		return {
			equalPattern: `{column} = '{val}'`,
			likePattern: `{column} Like '%{val}%'`,
			betweenPattern: `{column} between '{val}' And '{val1}'`,
			inPattern: `{column} in ({val})`,
		};
	}

	/**
	 * Reemplaza las comillas simples ' en \' para no tener conflictos de query
	 * @param {*} param0
	 */
	static escapeSingleQuotes({ text = '' }) {
		return text.replace(/'/g, '\\\'');
	}

	static mysqlDB({ empty, host, port, user, password, database, timezone, pool }) {
		// console.log('Connecting to MySQL...');
		if (empty) {
			return knexFactory({
				client: 'mysql'
			});
		} else {
			return knexFactory({
				client: 'mysql',
				connection: {
					host,
					port,
					user,
					password,
					database,
					timezone,
				},
				pool,
			});
		}
	}

	static async runScript({ knex, script, trace }) {
		try {
			let result = await knex.raw(script);

			// si retorna un array es porque el script es un select
			if (Array.isArray(result[0]))
				throw internalServerError({ msg: 'script result is an array, the script must not be a select. Please, use method ** selectScript() **', err: etc.errors.database, trace });

			return {
				success: true,
				affectedRows: result[0].affectedRows,
				message: result[0].message, // Ejm: '(Rows matched: 1  Changed: 1  Warnings: 0'
				changedRows: result[0].changedRows,
				...result[0]
			}
		} catch (err) {
			throw internalServerError({ msg: err.message, err: etc.errors.database, obfuscateMessage: true, trace });
		}
	}

	static async runNoValidationScriptDB({ knex, script, trace }) {
		const result = await this.runScript({ knex, script, trace });
		return result;
	}

	static async selectScript({ knex, script, other, trace }) {
		try {
			if (!script) throw internalServerError({ msg: 'Script is required', err: etc.errors.database });
			let result = await knex.raw(script);
			return { success: true, data: result[0], other };
		} catch (err) {
			// const sqlMessage = err.sqlMessage;
			throw internalServerError({ msg: err.message, err: etc.errors.database, obfuscateMessage: true, trace });
		}
	}

	static async itemDB({ knex, script, trace, throwDuplicateError = true, showLog = false }) {
		let result = await this.selectScript({ knex, script, trace });

		if (showLog) {
			const consoleColor = `\x1b[33m%s\x1b[0m`;
			console.log(consoleColor, '*** itemDB | script  ******|', script);
			console.log(consoleColor, '*** itemDB | result  ******|', result);
		}

		if (result.data.length > 1)
			throwDuplicateError && internalServerError({ msg: [`The script must return 0 or 1 item. ItemsFound: ${result.data.length}`, script].join('\n'), obfuscateMessage: true, err: etc.errors.hanlder }).throw();

		const item = result.data[0] || {}; // item por defecto es un objecto
		return {
			success: result.success,
			itemFound: !!Object.keys(item).length,
			data: { item },
		}
	}


	static async itemsDB({ knex, selectScript, whereScript = '', counterScript = '', filterVals = [], filtersAllowed = {}, defaultOrderBy = '', enablePaging = false, pagingSize = 0, pagingIndex = 0, showLog = false, trace }) {
		const filterScript = this.buildFilter({ filtersAllowed, filterVals });
		const orderFilterScript = this.buildOrder({ filtersAllowed, filterVals });
		const pagingScript = this.buildPaging({ enablePaging, pagingSize, pagingIndex });

		const whereClause = whereScript || filterScript ? 'where' : '';
		const orderScript = orderFilterScript && `Order By ${orderFilterScript}` || defaultOrderBy;

		const mainScript = `
			${selectScript}
			${whereClause}
			${whereScript}
			${whereClause && whereScript && filterScript ? `And ${filterScript}` : filterScript}
			${orderScript}
			${pagingScript.limiting}
		`;

		const counterFilterScript = `
			${counterScript}
			${whereClause}
			${whereScript}
			${whereClause && whereScript && filterScript ? `And ${filterScript}` : filterScript}
		`;

		if (showLog) {
			const consoleColor = `\x1b[33m%s\x1b[0m`;
			console.log(consoleColor, '*** itemsDB | select  ******|', selectScript);
			console.log(consoleColor, '*** itemsDB | where  *******|', whereScript);
			console.log(consoleColor, '*** itemsDB | filter  ******|', filterScript, filterScript.length);
			console.log(consoleColor, '*** itemsDB | order  *******|', orderScript);
			console.log(consoleColor, '*** itemsDB | pagings  *****|', pagingScript);
			console.log(consoleColor, '*** itemsDB | mainScript  **|', mainScript);
			console.log(consoleColor, '*** itemsDB | counterScript |', counterFilterScript);
		}

		let itemsCounter = 0;

		if (enablePaging) {
			const resultCounter = await this.itemsCounterDB({ knex, script: counterFilterScript, trace });
			itemsCounter = resultCounter.itemsCounter;
		}

		const result = await UtilDB.selectScript({ knex, script: mainScript, trace });
		return {
			success: true,
			data: {
				hasFilter: !!filterScript, // si tiene un filtro aplicado
				hasPaging: enablePaging, // si tiene paginacion aplicada
				itemsCounter: itemsCounter || result.data.length, // numero de items en total con o sin paginacion
				...enablePaging && { paginSize: pagingSize }, // numero de items en este paginacion
				items: result.data,
			},
			applied: {
				...filterVals.length && { filtering: filterVals }, // detalle del filtro aplicado,
				...enablePaging && { paging: { size: pagingSize, index: pagingIndex, } } // detalle de la paginacion aplicada
			},
			filtersAllowed: Object.values(filtersAllowed).map(i => i.public), // muestra todos los datos publicos de los filtros permitidos
		};
	}

	/**
	 *
	 * @param {*} param0
	 * @example
	 */
	static async itemsCounterDB({ knex, script, trace }) {

		// el script debe contener la estructura del counter | Ejm: select count(*) As itemsCounter from Academies
		if (!script.includes(' count(*) As itemsCounter'))
			throw internalServerError({ msg: 'not found alias itemsCounter', err: etc.errors.database, trace });

		const result = await UtilDB.selectScript({ knex, script, trace });
		return { itemsCounter: result.data[0].itemsCounter };
	}

	static buildFilter({ filtersAllowed = {}, filterVals = [] }) {

		// si no hay filtros permitidos
		if (!Object.keys(filtersAllowed).length) return '';

		// si no hay filtros enviados en la peticion
		if (!filterVals.length) return '';

		let filters = [];

		for (const item of filterVals) {
			// configuracion del filtro
			const setting = filtersAllowed[item.key];
			!setting && internalServerError({ msg: `filter key no valid: ${item.key}`, data: filterVals, err: etc.errors.database }).throw();
			// combinamos el patron con los valores enviados y lo agregamos al array de filtros
			filters.push(
				setting.pattern.format({ column: setting.column, val: item.val, val1: item.val1 })
			);
		}
		// concatenamos todos los filtros con And y retornamos
		return filters.join(' And ');
	}

	// el orden del orderBy depende del orden del filterVals
	// se puede configurar el orden 'asc' o 'desc' desde la peticion | si no se envia se toma el de configuracion
	static buildOrder({ filtersAllowed = {}, filterVals = [] }) {

		// si no hay filtros permitidos
		if (!Object.keys(filtersAllowed).length) return '';

		// si no hay filtros enviados en la peticion
		if (!filterVals.length) return '';

		let order = [];

		for (const item of filterVals) {
			// configuracion del filtro
			const setting = filtersAllowed[item.key];
			// armamos el order
			order.push(
				`${setting.column} ${item.order || setting.order}`
			);
		}
		// concatenamos todos los filtros con And y retornamos
		return order.join(' , ');
	}

	// TODO: documentar
	static buildPaging({ enablePaging = false, pagingSize = 0, pagingIndex = 0 }) {
		let limiting = ``; // Script para agregar al principal, con Limit y Offset si la paginacion esta habilitada
		let offset = 0; // Offset del limit

		if (!enablePaging) return { offset, limiting };

		offset = (pagingIndex - 1) * pagingSize;
		limiting = `Limit ${pagingSize} Offset ${offset}`;

		return { offset, limiting };
	}

	static async newItemDB({ knex, script, trace }) {
		let result = await UtilDB.runScript({ knex, script, trace });
		// el insert debe afectar 1 row, si es distinto se lanza una excepcion
		if (result.affectedRows != 1)
			throw internalServerError({ msg: [`newItemDB: script returned ${result.affectedRows} affected rows`, script].join('\n'), obfuscateMessage: true, trace });

		// el insertId funciona bien cuando el primary key es un incremental, cuando es string siempre retorna 0
		return { success: true, insertId: result.insertId };
	}


	static async updateItemsDB({ knex, script, affectedRowsScript, expectedAffectedRows = 1, trace }) {
		let result = {};
		let affectedRows = 0;

		result = await UtilDB.itemsCounterDB({ knex, script: affectedRowsScript, trace });
		affectedRows = result.itemsCounter;

		// El script solo debe afectar a "expectedAffectedRows" registros, en caso contrario mandar error
		if (affectedRows != expectedAffectedRows)
			throw internalServerError({
				msg: [`The affectedRowsScript must return ${expectedAffectedRows} item(s). ItemsFound: ${affectedRows}`, script].join('\n'), obfuscateMessage: true, trace
			});

		result = await UtilDB.runScript({ knex, script, trace });

		return { success: true, affectedRows };
	}

	static async updateItemDB({ knex, script, affectedRowsScript, trace }) {
		return UtilDB.updateItemsDB({
			knex,
			script,
			affectedRowsScript,
			expectedAffectedRows: 1,
			trace
		});
	}

	static async upsertItemsDB({ knex, script, affectedRowsScript, expectedAffectedRows = 1, trace }) {
		let result = {};
		let affectedRows = 0;

		result = await UtilDB.itemsCounterDB({ knex, script: affectedRowsScript, trace });
		affectedRows = result.itemsCounter;

		// El script solo debe afectar a "expectedAffectedRows" registros, en caso contrario mandar error
		// puede que el registro sea nuevo "affectedRows == 0"
		if (affectedRows != 0 && affectedRows != expectedAffectedRows)
			throw internalServerError({
				msg: [`The affectedRowsScript must return ${expectedAffectedRows} item(s). ItemsFound: ${affectedRows}`, affectedRowsScript, script].join('\n'),
				obfuscateMessage: true,
				trace
			});

		// el affectedRows retornado despues de ejecutar un upsert puede retornar:
		// 0: retorna "cero" cuando se encontro un duplicado pero son los mismos datos
		// 1: retorna "uno" cno se encontro un duplicado asi que se genero uno nuevo
		// 2: retorna "dos" ccuando encuentra un duplicado y actualiza los valores. Esto ocurre cuando afecta un registro.

		// TODO: aun no hay soporte para upsertItemsDB, en realidad depende del script. on hold

		result = await UtilDB.runScript({ knex, script, trace });

		return { success: true, affectedRows };
	}

	static async upsertItemDB({ knex, script, affectedRowsScript, trace }) {
		return UtilDB.upsertItemsDB({
			knex,
			script,
			affectedRowsScript,
			expectedAffectedRows: 1,
			trace
		});
	}

	static async removeItemsDB({ knex, script, affectedRowsScript, expectedAffectedRows = 1, trace }) {
		let result = {};
		let affectedRows = 0;

		result = await UtilDB.itemsCounterDB({ knex, script: affectedRowsScript, trace });
		affectedRows = result.itemsCounter;

		// El script solo debe afectar a "expectedAffectedRows" registros, en caso contrario mandar error
		if (affectedRows != expectedAffectedRows)
			throw internalServerError({
				msg: `The affectedRowsScript must return ${expectedAffectedRows} item(s). ItemsFound: ${affectedRows}`, trace
			});

		result = await UtilDB.runScript({ knex, script, trace });

		return { success: true, affectedRows };
	}

	static async removeItemDB({ knex, script, affectedRowsScript, trace }) {
		return UtilDB.removeItemsDB({
			knex,
			script,
			affectedRowsScript,
			expectedAffectedRows: 1,
			trace
		});
	}

	static async checkDBHealth({ knex, trace }) {
		const result = await UtilDB.itemDB({
			knex,
			script: `Select now() As now`,
			trace
		});
		return {
			success: result.success,
			data: result.data.item
		};
	}

}
