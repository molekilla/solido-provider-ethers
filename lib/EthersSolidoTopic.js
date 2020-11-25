"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthersSolidoTopic = void 0;
class EthersSolidoTopic {
    constructor() {
        this.next = [];
    }
    topic(value) {
        this.next = [...this.next, value];
        return this;
    }
    or(value) {
        this.next = [...this.next, value];
        return this;
    }
    and(value) {
        this.next = [[...this.next, value]];
        return this;
    }
    get() {
        return this.next;
    }
}
exports.EthersSolidoTopic = EthersSolidoTopic;
