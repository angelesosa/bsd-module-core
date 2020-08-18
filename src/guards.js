'use strict';
import HttpClient from './httpClient';
import { unauthorized, internalServerError } from './exceptions'
import etc from './../config/etc';

export const checkUsrPrivilege = async ({ req, securtiyUrl, endpId, trace, check = true }) => {
	// validar si se debe saltar esta funcion
	if (!check) return;
	// validamos
	let result = await HttpClient.call({
		method: 'post',
		url: securtiyUrl,
		headers: {
			user_id: req.headers.user_id,
			user_token: req.headers.user_token,
		},
		data: {
			endpointId: endpId,
			trace
		}
	});
	// obtenemos el payload
	result = result.data;
	// lanzamos el throw si responde un error
	!result.success && unauthorized({ msg: result.kindMessage, err: etc.errors.credential, trace }).throw();
	return result;
}

export const checkUsrSession = async ({ req, securtiyUrl, trace, check = true }) => {
	// validar si se debe saltar esta funcion
	if (!check) return;

	if (!securtiyUrl) throw internalServerError({ msg: `securtiyUrl is required` });

	// validamos
	let result = await HttpClient.call({
		method: 'post',
		url: securtiyUrl,
		headers: {
			user_id: req.headers.user_id,
			user_token: req.headers.user_token,
		},
		data: {
			trace
		}
	});
	// obtenemos el payload
	result = result.data;
	// lanzamos el throw si responde un error
	result.status == etc.httpCodes.unauthorized || result.status == etc.httpCodes.badRequest
		&& unauthorized({ msg: result.data.message || result.data.kindMessage, data: result, trace }).throw();
	return result;
}

export const checkUsrSessionInParams = async ({ req, securtiyUrl, trace, check = true }) => {
	// validar si se debe saltar esta funcion
	if (!check) return;
	// validamos
	let result = await HttpClient.call({
		method: 'post',
		url: securtiyUrl,
		headers: {
			user_id: req.params.user_id,
			user_token: req.params.user_token,
		},
		data: {
			trace
		}
	});
	// lanzamos el throw si responde un error
	!result.success && unauthorized({ message: result.message, trace }).throw();
	return result;
}

export const apikey = async ({ req, apiKey, trace, check = true }) => {
	// validar si se debe saltar esta funcion
	if (!check) return;
	// validacion
	(apiKey != req.headers.api_key) && unauthorized({ trace }).throw();
	// return undefined
}
