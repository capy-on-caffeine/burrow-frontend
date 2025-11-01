declare module 'neovis.js' {
  export default class NeoVis {
    constructor(config: any);
    render(): void;
    clearNetwork(): void;
    registerOnEvent(eventName: string, handler: (e: any) => void): void;
  }
}
