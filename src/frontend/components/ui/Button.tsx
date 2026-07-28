import type { ComponentProps } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon';

interface ButtonProps extends ComponentProps<'button'> {
    variant?: ButtonVariant;
}

export function Button({
    variant = 'primary',
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`button ${className}`.trim()}
            data-variant={variant}
            {...props}
        />
    );
}