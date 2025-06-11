class Category {
    id: number | null;
    name: string;

    constructor(categoryId: number, categoryName: string) {
        this.id = categoryId;
        this.name = categoryName;
    }
}

export default Category;