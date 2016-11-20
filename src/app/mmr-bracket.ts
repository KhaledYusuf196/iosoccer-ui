export class MmrBracket {
    threshold: number
    name: string
    label: string

    constructor(threshold: number, name: string, label: string) {
        this.threshold = threshold;
        this.name = name;
        this.label = label;
    }
}
