import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                'rounded-xl border bg-card text-card-foreground shadow-sm dark:bg-gray-900 dark:border-gray-800',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
        <h3
            className={cn(
                'font-semibold leading-none tracking-tight text-xl',
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
};

export const CardContent = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn('p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
};

export const CardFooter = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
};
