'use strict';

import etc from '../config/etc';
import lang from '../config/lang';

export class HttpError extends Error {
	constructor({ msg, name, msgId, kindMessage, statusCode, error, data, obfuscateMessage, trace }) {
		super(msg || kindMessage || '');
		this.name = name || '';
		this.msgId = msgId || '';
		this.kindMessage = kindMessage || '';
		this.statusCode = statusCode || '';
		this.error = error || etc.errors.internal;
		this.data = data || {};
		this.obfuscateMessage = obfuscateMessage || false;
		this.trace = trace || '';
		Error.captureStackTrace(this, HttpError);
	}
	/**
	 * lanzar la excepcion sin la palabra reservada "throw"
	 * @example !errorCode && internalServerError({message: 'errorCode is required'}).throw();
	 */
	throw() {
		throw this;
	}
}

/**
 * Crea un objeto error de tipo internal server error
 * @example
 * 1) condition && internalServerError({ ... }).throw();
 * @param {*} param0
 */
export const internalServerError = ({ msg, kmsg, err, data, obfuscateMessage = false, trace, usrLang = 'en' }) => {
	const error = new HttpError({
		name: 'HttpInternalServerError',
		statusCode: etc.httpCodes.serverError,
		msgId: msg['id'] || 'R_GENERAL_INTERNAL_SERVER_ERROR',
		msg: msg[usrLang] || msg || `Internal server error: ${kmsg || ''}`,
		kindMessage: kmsg || lang.common.request.failedTryAgain[usrLang],
		obfuscateMessage,
		error: err || etc.errors.internal,
		data,
		trace,
	});
	return error;
}

/**
 * Crea un objeto error de tipo 'badRequest'
 * @example
 * 1) condition && badRequest({ ... }).throw();
 * @param {*} param0
 */
export const badRequest = ({ msg, kmsg, err, data, trace, usrLang = 'en' }) => {
	const error = new HttpError({
		name: 'HttpBadRequest',
		statusCode: etc.httpCodes.badRequest,
		msg: msg || `Bad request: ${kmsg}`,
		kindMessage: kmsg || lang.common.request.failedTryAgain[usrLang],
		error: err || etc.errors.hanlder,
		data,
		trace
	});
	return error;
}

/**
 * Crea un objeto error de tipo 'notFound'
 * @example
 * 1) condition && badRequest({ ... }).throw();
 * @param {*} param0
 */
export const notFound = ({ msg, kmsg, id, err, data, trace, usrLang = 'en' }) => {
	const error = new HttpError({
		name: 'HttpNotFound',
		statusCode: etc.httpCodes.notFound,
		msg: msg || `Not Found: ${kmsg}`,
		kindMessage: kmsg || lang.common.request.failedIdNotFound[usrLang].format({ id }),
		error: err || etc.errors.hanlder,
		data,
		trace
	});
	return error;
}

/**
 * Crea un objeto error de tipo 'unauthorized'
 * @example
 * 1) condition && unauthorized({ ... }).throw();
 * @param {*} param0
 */
export const unauthorized = ({ msg, kmsg = '', err, data, trace, usrLang = 'en' }) => {
	const error = new HttpError({
		name: 'HttpBadRequest',
		statusCode: etc.httpCodes.unauthorized,
		msg: msg || `Unauthorized Request: ${kmsg}`,
		kindMessage: kmsg || lang.common.request.failedTryAgain[usrLang],
		error: err || etc.errors.credential,
		data,
		trace
	});
	return error;
}

/**
 * Crea un objeto error de tipo 'conflict'
 * @param {string|Object} [msg=''] - es el mensaje de la excepcion, puede ser un objeto de lang o un string
 * @example
 *
 * 		// ejemplo con un string
 *		conflict({ msg: 'userId not found' ...}).throw();
 *
 * 		// ejemplo con un obj del archivo Lang - el metodo conflict se encargara de obenter el id y el mensaje para mostrarlo
 * 		const failedIdNotFound = lang.common.request.failedIdNotFound;
 * 		conflict({ msg: failedIdNotFound, ... }).throw();
 *
 * @param {string} [kmsg = ''] - Es el mensaje amigable para el front, el valor es un string
 * @example
 * 		conflict({ kmsg: 'Tu solicitud no ha podido ser procesado, el id [123] no se encontro' ...}).throw();
 *
 * @param {object} [err = etc.errors.hanlder] - define el tipo-origen del error y quien lanzo el error.
 * 		Valores: internal | endpoints | notification | database | credential | hanlder
 * 		Todos lo objetos estan definidos en etc.errors
 *
 *
 *
 */
export const conflict = ({ msg = '', kmsg = '', err, data, trace, usrLang = 'en' }) => {
	const error = new HttpError({
		name: 'HttpConflict',
		statusCode: etc.httpCodes.conflict,
		msgId: msg['id'] || 'R_GENERAL_CONFLICT',
		msg: msg[usrLang] || msg || `Conflict: ${kmsg || ''}`,
		kindMessage: kmsg || lang.common.request.failedTryAgain[usrLang],
		error: err || etc.errors.hanlder,
		data,
		trace
	});
	return error;
}
