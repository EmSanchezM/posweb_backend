import { Document } from 'mongoose';

// Mongoose 7 removed `DocumentDefinition`; this keeps its Mongoose 6 shape:
// the document's own fields without the Document instance members,
// with `_id`, `id` and `__v` optional and loosely typed.
type OptionalKeys = '_id' | 'id' | '__v';

export type DocumentDefinition<T> =
    Omit<T, keyof Document | OptionalKeys> & Partial<Record<OptionalKeys, any>>;
