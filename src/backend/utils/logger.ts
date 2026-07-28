type Level = 'info' | 'warn' | 'error' | 'debug';

function log(level: Level, message: string, meta?: Record<string, unknown>){
    const line = JSON.stringify({
        timestamp : new Date().toISOString(),
        level, service: 'back-end', message, ...meta
    });

    level === 'error' ? console.error(line) : console.log(line);
}

export const logger = {
    info: (msg: string , meta?:Record<string, unknown>) => log('info', msg, meta),
    warn: (msg: string , meta?:Record<string, unknown>) => log('warn', msg, meta),
    error: (msg: string , meta?:Record<string, unknown>) => log('error', msg, meta),
    debug: (msg: string , meta?:Record<string, unknown>) => log('debug', msg, meta)
}