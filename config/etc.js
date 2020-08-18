'use strict'

const etc = {
	stage: {
		pro: 'PRO',
		qa: 'QA',
		dev: 'DEV'
	},
	log: {
		trace: { label: 'TRACE', value: 1 },
		debug: { label: 'DEBUG', value: 2 },
		info: { label: 'INFO', value: 3 },
		error: { label: 'ERROR', value: 4 },
		none: { label: 'NONE', value: 100 }
	},
	httpCodes: {
		ok: 200,
		created: 201,
		badRequest: 400,
		unauthorized: 401,
		notFound: 404,
		forbidden: 403,
		conflict: 409,
		serverError: 500,
	},
	dataType: {
		integer: 'INT',
		string: 'STRING'
	},
	errors: {
		internal: { label: 'INTERNAL_UNKNOWN', description: '(HTTP error code = 500) An unknown internal error occurred.' },
		endpoints: { label: 'INTERNAL_ENDPOINT', description: 'An internal error occurred while call an endpoint.' },
		notification: { label: 'INTERNAL_NOTIFICATION', description: 'An internal error occurred while running the library.' },
		database: { label: 'INTERNAL_DB', description: 'An internal error occurred while connect with the BD.' },
		ram: { label: 'INTERNAL_RAM', description: 'An internal error occurred while connect with the BD.' },
		credential: { label: 'CREDENTIAL', description: 'Lacks valid authentication credentials for the target resource.' },
		hanlder: { label: 'INTERNAL_HANDLER', description: 'Business logic' },
	},
	httpRequestStatus: {
		sent: -1,
		success: 1,
		failed: 0,
	},
	status: {
		active: 1,
		inactive: 0,
	}
};
export default etc;
