'use strict';

import UtilLog from "./util-log";

export default class UtilHapiApi {

    // util request
	static remoteIpAddress({ req }) {
		const xFF = req.headers['x-forwarded-for'];
		const ip = xFF ? xFF.split(',')[0] : req.info.remoteAddress;
		return ip;
	}

    /**
   * Devuelve el archivo de configuracion de la conexion Hapi
   * @param {Object} data { 
   *    env(JSON Environment Variables), 
   *    app(JSON App Info)
   * }
   * @returns {Object} Hapi Connection Configuration
   */
    static connectionConf({ env }) {
        return {
            host: env.micro.app.host,
            address: env.micro.app.address,
            port: env.micro.app.port,
            routes: {
                timeout: {
                    server: 60000 * env.micro.routes.timeout.server,
                    socket: 60000 * env.micro.routes.timeout.socket
                }
            }
        }
    }

    /**
    * Devuelve el archivo de configuracion de HapiSwagger
    * @param {Object} data { 
    *    hapiSwagger(HapiSwagger),
    *    env(JSON Environment Variables), 
    *    app(JSON App Info)
    * }
    * @returns {Object} HapiSwagger Configuration
    */
    static swaggerConf({ hapiSwaggerPlugin, env, app }) {
        return {
            plugin: hapiSwaggerPlugin,
            options: {
                swaggerUI: true,
                documentationPage: true,
                schemes: [env.micro.swagger.protocol],
                host: `${env.micro.swagger.host}:${env.micro.swagger.port}`,
                info: {
                    title: `${env.micro.app.name}`,
                    version: app.info.version,
                    description: app.info.description,
                },
                grouping: 'tags',
            }
        }
    }

    static consoleEnvironment({ env, keyColor, showLog = true }) {
        if (!showLog) return;
        const event = `Starting up - env -`;
        const apiName = env.micro.api.name;
        UtilLog.print({ keyColor, key: apiName, value: `Starting up - +++++++++++++++++++++++++++++++++++++++++++++` });
        // environment variable +++++++++++++++++++++++++++++++++++++++++++++++++++++`;
        UtilLog.print({ keyColor, key: apiName, value: `${event} stage => ${env.stage}` });
        // + 
        UtilLog.print({ keyColor, key: apiName, value: `${event} macro.api.key => ${env.macro.api.key.toString().substring(0, 2)}...` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} macro.api.solution => ${env.macro.api.solution}` });
        // + 
        UtilLog.print({ keyColor, key: apiName, value: `${event} macro.brand.id => ${env.macro.brand.id}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} macro.brand.name => ${env.macro.brand.name}` });
        // + 
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.api.audit => ${env.micro.api.audit}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.api.events => ${env.micro.api.events}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.api.id => ${env.micro.api.id}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.api.log => ${env.micro.api.log}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.api.name => ${env.micro.api.name}` });
        // + 
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.app.address => ${env.micro.app.address}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.app.host => ${env.micro.app.host}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.app.name => ${env.micro.app.name}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.app.port => ${env.micro.app.port}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.app.protocol => ${env.micro.app.protocol}` });
        // + 
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.routes.timeout.server => ${env.micro.routes.timeout.server}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.routes.timeout.socket => ${env.micro.routes.timeout.socket}` });
        // +
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.swagger.protocol => ${env.micro.swagger.protocol}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.swagger.port => ${env.micro.swagger.port}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.swagger.host => ${env.micro.swagger.host}` });
        // +
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.connection.host => ${env.micro.dbs.SQL.biz.connection.host}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.connection.name => ${env.micro.dbs.SQL.biz.connection.name}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.connection.password => ${env.micro.dbs.SQL.biz.connection.password}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.connection.port => ${env.micro.dbs.SQL.biz.connection.port}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.connection.timezone => ${env.micro.dbs.SQL.biz.connection.timezone}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.connection.user => ${env.micro.dbs.SQL.biz.connection.user}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.pool.min => ${env.micro.dbs.SQL.biz.pool.min}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.pool.max => ${env.micro.dbs.SQL.biz.pool.max}` });
        UtilLog.print({ keyColor, key: apiName, value: `${event} micro.dbs.SQL.biz.pool.max => ${env.micro.dbs.SQL.biz.pool.max}` });
    }

    /**
   * Agrega CORS si la llamada se realiza con https
   */
    static addCORS(request, h) {
        if (!request.headers.origin) {
            return h.continue;
        }
        // depending on whether we have a boom or not,
        // headers need to be set differently.
        let response = request.response.isBoom ? request.response.output : request.response;
        response.headers['access-control-allow-origin'] = request.headers.origin;
        response.headers['access-control-allow-credentials'] = 'true';
        if (request.method !== 'options') {
            return h.continue;
        }
        response.statusCode = 200;
        response.headers['access-control-expose-headers'] = 'content-type, content-length, etag';
        response.headers['access-control-max-age'] = 60 * 10; // 10 minutes
        // dynamically set allowed headers & method
        if (request.headers['access-control-request-headers']) {
            response.headers['access-control-allow-headers'] = request.headers['access-control-request-headers'];
        }
        if (request.headers['access-control-request-method']) {
            response.headers['access-control-allow-methods'] = request.headers['access-control-request-method'];
        }
        return h.continue;
    }

}
