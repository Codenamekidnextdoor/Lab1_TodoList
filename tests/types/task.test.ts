import { describe, expect, it } from 'vitest';

import { TASK_STATUSES } from '../../src/types/task';

describe('task types', () => {
    it('defines only the three allowed task statuses', () => {
        expect(TASK_STATUSES).toEqual(['TODO', 'IN_PROGRESS', 'COMPLETE']);
    });
});