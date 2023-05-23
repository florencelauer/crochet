export interface Picture {
    title: string;
    description: string;
    files: string[];
    dimensions: {width: number, height: number}[]
}
