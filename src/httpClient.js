'use strict';

import axios from 'axios';
import { internalServerError } from './exceptions';
import etc from '../config/etc';
const err = etc.errors.endpoints;

export default class HttpClient {

	static async call({ method, url, headers, params, data, auth }) {
		try {
			let result = await axios({
				method, url, headers, params, data, auth,
				validateStatus: function (status) {
					// acepta cualquier respuesta a partir del 200 para que no mande nada al catch
					// ya no se requiere cath
					return status >= 200;
				}
			});
			return {
				status: result.status,
				data: result.data,
				headers: result.headers
			};
		} catch (e) {
			// para errores de conexion
			const data = `
				errno: ${e.errno},
				code: ${e.code},
				syscall: ${e.syscall},
				address: ${e.address},
				port: ${e.port},
				configUrl: ${e.config.url},
				configMethod: ${e.config.method},
				configData: ${JSON.stringify(e.config.data)},
				configHeader: ${JSON.stringify(e.config.headers)},
			`;
			internalServerError({ msg: data, obfuscateMessage: true,  err }).throw();
		}
	}

}
