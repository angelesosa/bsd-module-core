'use strict';
import redis from 'redis';
import etc from "../config/etc";
import { internalServerError } from './exceptions';
export default class UtilRedis {

    /**
     * Revisa si la conexion creada ha sido satisfactoria
     * Escenarios
     * 1. Lanza error con reject
     * 2. devuelve|resuelve una promesa {} "diciendo que todo ok"
     * @param {*} param0 
     */
    static checkRedisClient({ redisClient, trace }) {
        return new Promise((resolve, reject) => {
            redisClient.on('connect', () => { });
            redisClient.on('error', (err) => { reject(err) });
            redisClient.on('ready', () => { resolve({}); });
        });
    }

    /**
     * Metodo para guardar en redis
     * Si envias una key que ya existe, lo sobreescribe
     * @param {*} param0 
     */
    static async infoFromRAM({ host, port, key, trace }) {
        try {
            let redisClient = redis.createClient(port, host);
            await UtilRedis.checkRedisClient({ redisClient });
            return new Promise((resolve, reject) => {
                redisClient.get(key, (err, reply) => {
                    if (err) reject(err); // este error lo captura el try-catch
                    resolve({
                        itemFound: !!reply,
                        data: reply, // redis responde => null o la data 
                    });
                });
            }).finally((result) => {
                redisClient.quit();
                return result;
            });
        } catch (err) {
            throw internalServerError({ msg: err.message, err: etc.errors.ram, obfuscateMessage: true, trace });
        }
    }

    static async deleteInfoFromRAM({ host, port, key, trace }) {
        try {
            let redisClient = redis.createClient(port, host);
            await UtilRedis.checkRedisClient({ redisClient });
            return new Promise((resolve, reject) => {
                redisClient.del(key, (err, reply) => {
                    if (err) reject(err); // este error lo captura el try-catch
                    resolve({
                        data: reply, // redis responde "1"
                    });
                });
            }).finally((result) => {
                redisClient.quit();
                return result;
            });
        } catch (err) {
            throw internalServerError({ msg: err.message, err: etc.errors.ram, obfuscateMessage: true, trace });
        }
    }

    static async infoToRAM({ host, port, key, value, trace }) {
        try {
            let redisClient = redis.createClient(port, host);
            await UtilRedis.checkRedisClient({ redisClient });
            return new Promise((resolve, reject) => {
                redisClient.set(key, value, (err, reply) => {
                    if (err) reject(err); // este error lo captura el try-catch
                    resolve({
                        data: reply // redis devuelve "OK"
                    });
                });
            }).finally((result) => {
                redisClient.quit();
                return result;
            });
        } catch (err) {
            throw internalServerError({ msg: err.message, err: etc.errors.ram, obfuscateMessage: true, trace });
        }
    }

}
