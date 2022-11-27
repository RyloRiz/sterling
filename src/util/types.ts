type Primitive = number | string | boolean | null;
type ValueOf<T> = T[keyof T];

export {
	Primitive,
	ValueOf
}