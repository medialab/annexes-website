export type Edition = {
    name: string;
    coverimg: string;
};

export type DropItem =
    | string
    | {
        id?: string;
        label?: string;
        name?: string;
        title?: string;
    };

export type MenuVariations = "book" | "layout" | "gallery" | "reader";