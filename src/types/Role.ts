export interface Role {
    _id: string;
    name: string;
    key: string;
    permissions: Array<string>;
}