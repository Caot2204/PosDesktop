class Category {
    id: number | undefined;
    name: string;

    constructor(categoryId: number | undefined, categoryName: string) {
        this.id = categoryId;
        this.name = categoryName;
    }
}

export default Category;