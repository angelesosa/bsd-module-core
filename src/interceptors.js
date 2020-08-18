'use strict';
import util from './util';
import utilDate from './util-date';
import etc from '../config/etc';
import Youch from 'youch';
import forTerminal from 'youch-terminal';
import lang from '../config/lang';
import { HttpError } from './exceptions';

/**
 * Funcion interceptor utilzada para enlazar logica adicional que se repite en todas las llamadas a los endpoint
 * Ademas:
 * Transforma el resultado devuelto del handler
 * Transforma la excepcion lanzada en la ejecucion del endpoint
 * Extiende el comportamiento de una llamada basica al endpoint
 * Puede anular una funcion dependiendo las condiciones especificas
 *
 * @param {*} toolkitHapi (requerido): es el kit de herramientas para la respuesta de hapi
 * @param {*} guard (opcional): es una funcion que valida las credenciales | por defecto no valida nada
 * @param {*} pipe (requerido): funcion que transforma los datos de entrada a la forma deseada para el handler
 * @param {*} handler (requerido): funcion principal
 * @param {*} error (opcional): funcion que intercepta cualquier error lanzado durante la ejecucion del endpoint | por defecto la funcion es exceptionInterceptor
 *
 * @example Ejemplo de un endpoint sin seguridad
    handler: (req, h) =>
   		requestInterceptor({
			toolkitHapi: h,
			pipe: ({ trace }) => test({ req, trace }),
			handler: ({ data, trace }) => handler({ data, trace }),
		})
 *
 * @example Ejemplo de un endpoint validando la session del usuario | uso mas comun de la funcion
	requestInterceptor({
		toolkitHapi: h,
		guard: ({ trace }) => checkUsrSession({ req, trace }),
		pipe: ({ sec, trace }) => test({ req, sec, trace }),
		handler: ({ data, trace }) => handler({ data, trace }),
	})
 *
 * @example Ejemplo donde sobreescribe la forma como se retornan los errores
	handler: (req, h) =>
		requestInterceptor({
			toolkitHapi: h,
			guard: ({ trace }) => checkUsrSession({ req, trace }),
			pipe: ({ sec, trace }) => test({ req, sec, trace }),
			handler: ({ data, trace }) => handler({ data, trace }),
			error: ({ err }) => {
				console.log(err);
				return { msg: "ocurrio un error..." }
			}
		})
 *
 */
export const requestInterceptor = async ({ toolkitHapi, guard = async () => { }, pipe, handler, error = exceptionInterceptor }) => {
	const trace = util.trace();
	const { started, startedDatetime } = utilDate.startedTimes();

	let result = await guard({ trace })
		.then(sec => pipe({ sec, trace })) // "sec": "respuesta devuelta por security"
		.then(data => handler({ data, trace })) // "data": "es la data transformada por el pipe"
		.catch(err => error({ err }));

	// respuesta cuando el resultado no es un objeto
	if (typeof result != 'object' || result == null)
		return toolkitHapi.response(result);

	result.timeLapse = utilDate.execTimeLapse({ started, startedDatetime });
	result.kindMessage = result.kindMessage || lang.common.request.completed['en'];
	return toolkitHapi.response(result).code(result.statusCode || etc.httpCodes.ok);
}

export const exceptionInterceptor = async ({ err }) => {
	new Youch(err, {}).toJSON().then(output => {
		// si es un HttpError quitamos el primer error frame
		if (err instanceof HttpError) {
			output.error.frames.shift();
			output.error.message = [output.error.message, `Data: ${JSON.stringify(err.data)}`].join('\n');
		}
		console.log(forTerminal(output));
	});
	const obfuscatedMessage = `This message cannot be displayed, please check the log.`;

	const error = err.error && err.error.label || etc.errors.internal.label;

	// ocultar mensaje original si se configuro para que no se muestre el error
	// util para los casos de error de base de datos
	let message = err.obfuscateMessage ? obfuscatedMessage : err.message;

	const response = {
		statusCode: err.statusCode || etc.httpCodes.serverError,
		success: false,
		messageId: err.msgId,
		message,
		kindMessage: err.kindMessage,
		data: err.data,
		error,
	};
	return response;
}
