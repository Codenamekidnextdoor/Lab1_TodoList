// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../../../src/frontend/components/ui/Button';

describe('Button', () => {
    it('keeps native button behavior and exposes its visual variant', () => {
        const onClick = vi.fn();

        render(
            <Button type="button" variant="secondary" onClick={onClick}>
                Cancel
            </Button>,
        );

        const button = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(button);

        expect(onClick).toHaveBeenCalledOnce();
        expect(button.getAttribute('type')).toBe('button');
        expect(button.getAttribute('data-variant')).toBe('secondary');
    });
});