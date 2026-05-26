import { User, UserCreationAttributes } from "./user.model";
export declare const userService: {
    getAll: typeof getAll;
    getById: typeof getById;
    create: typeof create;
    update: typeof update;
    delete: typeof _delete;
};
declare function getAll(): Promise<User[]>;
declare function getById(id: number): Promise<User>;
declare function create(params: UserCreationAttributes & {
    password: string;
}): Promise<void>;
declare function update(id: number, params: Partial<UserCreationAttributes> & {
    password?: string;
}): Promise<void>;
declare function _delete(id: number): Promise<User>;
export {};
//# sourceMappingURL=user.service.d.ts.map