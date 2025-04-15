export default class SymbolSet {
    display: string;
    url: string;

    constructor(display: string, url: string) {
        this.display = display
        this.url = url
    }

    static symbolSets: SymbolSet[] = [
        { display: "Bootstrap Icons", url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/bootstrap-icons.svg" },
        { display: "Font Awesome Regular", url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/sprites/regular.svg" },
        { display: "Font Awesome Solid", url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/sprites/solid.svg" },
        { display: "Font Awesome Brands", url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/sprites/brands.svg" },
    ]
}
