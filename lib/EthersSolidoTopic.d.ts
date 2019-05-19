import { SolidoTopic } from '@decent-bet/solido';
export declare class EthersSolidoTopic implements SolidoTopic {
    private next;
    constructor();
    topic(value: string): this;
    or(value: any): this;
    and(value: any): this;
    get(): any[];
}
