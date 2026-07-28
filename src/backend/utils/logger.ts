type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogMetadata = Record<string, unknown>;

function log(level: LogLevel, message: string, metadata: LogMetadata = {}) {
    const line = JSON.stringify({
        ...metadata,
        timestamp: new Date().toISOString(),
        level,
        service: 'backend',
        message,
    });

    if (level === 'error') {
        console.error(line);
        return;
    }

    if (level === 'warn') {
        console.warn(line);
        return;
    }

    console.log(line);
}

export const logger = {
    info: (message: string, metadata?: LogMetadata) => log('info', message, metadata),
    warn: (message: string, metadata?: LogMetadata) => log('warn', message, metadata),
    error: (message: string, metadata?: LogMetadata) => log('error', message, metadata),
    debug: (message: string, metadata?: LogMetadata) => {
        if (process.env.NODE_ENV !== 'production') {
            log('debug', message, metadata);
        }
    },
};