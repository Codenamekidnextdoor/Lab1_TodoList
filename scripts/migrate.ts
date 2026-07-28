import { openDatabase } from '../src/backend/database';
import { logger } from '../src/backend/utils/logger';

const database = openDatabase();
database.close();

logger.info('Database is up to date');