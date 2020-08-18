'use strict';
import joi from '@hapi/joi';
export const joi_errorMsg = 'Code Error => ';

// object joi
export const objJoi = (rules = {}) => joi.object({ ...rules }).options({ allowUnknown: true });
const joiError = ({ msg = 'Code Error => ', code }) => new Error(`${msg} ${code}`);


/*******************************
* << ****** any *********** >>
********************************/
export const anyJoi = ({ errId }) => joi.any().error(joiError({ code: errId }));

/*******************************
* << ****** numbers ********** >>
********************************/
// numbers -  enteros
export const intJoi = ({ errId }) => joi.number().integer().min(1).error(joiError({ code: errId }));
export const intZeroJoi = ({ errId }) => joi.number().integer().min(0).error(joiError({ code: errId }));
// numbers -  decimales
export const decJoi = ({ errId }) => joi.number().precision(2).min(0.00).max(100).error(joiError({ code: errId }));
export const decNoLimitJoi = ({ errId }) => joi.number().precision(2).min(0.00).error(joiError({ code: errId }));
// numbers -  montos
export const amountJoi = ({ errId }) => joi.number().precision(2).min(0.00).max(5000.00).error(joiError({ code: errId }));
export const bigAmountJoi = ({ errId }) => joi.number().precision(2).min(0.00).max(500000.00).error(joiError({ code: errId }));

/*******************************
* << ****** fechas y horas *********** >>
********************************/
// time
export const intHoursJoi = ({ errId }) => joi.number().integer().min(1).max(72).error(joiError({ code: errId }));
export const intMinutesJoi = ({ errId }) => joi.number().integer().min(1).max(720).error(joiError({ code: errId }));
export const dateJoi = ({ errId }) => joi.date().iso().error(joiError({ code: errId }));

/*******************************
* << ****** string *********** >>
********************************/
// string
export const strJoi = ({ errId }) => joi.string().min(1).error(joiError({ code: errId }));
export const strJoiEmpty = ({ errId }) => joi.string().allow('').error(joiError({ code: errId }));
export const textJoi = ({ errId }) => joi.string().allow('').optional().min(1).max(1500).error(joiError({ code: errId }));
// string - utils
export const ccJoi = ({ errId }) => joi.string().creditCard().error(joiError({ code: errId }));
export const passJoi = ({ errId }) => joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,20}$/).error(joiError({ code: errId }));
export const uriJoiRegex = ({ errId }) => joi.string().regex(/www\.|(?!www)[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.|(?!www)[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}/).error(joiError({ code: errId }));
export const emailJoi = ({ errId }) => joi.string().email().error(joiError({ code: errId }));

/*******************************
* << ****** boolean ********* >>
********************************/
export const boolJoi = ({ errId }) => joi.number().integer().min(0).max(1).error(joiError({ code: errId }));
export const booleanJoi = ({ errId }) => joi.boolean().error(joiError({ code: errId }));

/*******************************
* << ****** array *********** >>
********************************/
export const arrItemsJoi = ({ joiObj, min = 1, max = 20, errId }) => joi.array().items(joiObj).min(min).max(max).unique().error(joiError({ code: errId }));

// credentials
export const userIdJoi = ({ errId }) => joi.number().integer().min(1).required().description('ID del usuario que realiza el request').error(joiError({ code: errId })); 
export const userTokenJoi = ({ errId }) => joi.string().required().min(1).description('El token de la sesion del user').error(joiError({ code: errId }));
export const apiKeyJoi = ({ errId }) => joi.string().required().description('La key requerida para que esta API atienda la solicitud').error(joiError({ code: errId }));

// paging
export const enablePagingJoi = ({ errId }) => joi.boolean().optional().description('true = Data con paginacion<br>false = Data SIN paginacion').error(joiError({ code: errId }));
export const pagingSize = ({ errId }) => joi.number().integer().min(5).max(100).optional().description('Numero de registros por pagina').error(joiError({ code: errId }));
export const pagingIndexJoi = ({ errId }) => joi.number().integer().min(1).optional().description('El numero de pagina a mostrar').error(joiError({ code: errId }));

// filter
const arrFiltersJoi = ({ errId }) => joi.array().items(
	joi.object({
		key: joi.string().required().min(1).description('Identificador (nombre) de la columna del filtro').error(new Error(`${joi_errorMsg} ** F001`)), // F => filtros
		val: joi.string().required().min(1).description('Primer valor relacionado con el identificador').error(new Error(`${joi_errorMsg} ** F002`)), // F => filtros
		val1: joi.string().optional().min(1).description('Segundo valor relacionado con el identificador').error(new Error(`${joi_errorMsg} ** F003`)), // F => filtros
		order: joi.string().optional().allow('asc', 'desc').description('orden del filtro').error(new Error(`${joi_errorMsg} ** F004`)), // F => filtros
	})
).min(1).unique().error(joiError({ code: errId }));

export const joi_headers_credentials_filters_paging = {
	user_id: userIdJoi({ errId: '* C001' }),
	user_token: userTokenJoi({ errId: '* C002' }),
	enable_paging: enablePagingJoi({ errId: '* P002' }),
	paging_size: pagingSize({ errId: '* P003' }),
	paging_index: pagingIndexJoi({ errId: '* P004' }),
	filters: arrFiltersJoi({  errId: '* F000' }),
}

export const joi_headers_userId_token = {
	user_id: userIdJoi({ errId: '* C001' }),
	user_token: userTokenJoi({ errId: '* C002' }),
}

export const joi_headers_apikey_filters_paging = {
	api_key: apiKeyJoi({ errId: '* C001' }), // C => credentials
	filters: arrFiltersJoi({  errId: '* F000' }),
}
