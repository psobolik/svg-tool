export class SymbolSet {
    display: string;
    file: string;

    constructor(display: string, file: string) {
        this.display = display
        this.file = file
    }
}
export const symbolSets: SymbolSet[] = [
    // new SymbolSet('Test', `${import.meta.env.BASE_URL}/test.svg`),
    new SymbolSet('Bootstrap', `${import.meta.env.BASE_URL}/bootstrap-icons.svg`),
    new SymbolSet('Font Awesome Regular', `${import.meta.env.BASE_URL}/regular.svg`),
    new SymbolSet('Font Awesome Solid', `${import.meta.env.BASE_URL}/solid.svg`),
    new SymbolSet('Font Awesome Brands', `${import.meta.env.BASE_URL}/brands.svg`),
]
