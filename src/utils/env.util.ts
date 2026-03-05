export function mustParse<T>(value: string | undefined, name: string, parser: (v: string) => T): T {
    if (!value) throw new Error(`Missing required env var: ${name}`);
    try {
        return parser(value);
    } catch {
        throw new Error(`Invalid value for env var: ${name}`);
    }
}

export const parseBoolean = (v: string): boolean => {
    if (v === 'true') return true;
    if (v === 'false') return false;
    throw new Error('Expected "true" or "false"');
}