export default function authorize(roles?: any): ({
    (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction): Promise<void>;
    unless: typeof import("express-unless").unless;
} | ((req: any, res: any, next: any) => Promise<any>))[];
//# sourceMappingURL=authorize.d.ts.map