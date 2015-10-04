/// <reference path='greeter.ts'/>

module ex1 {
    export class greetExample {
        private greeterInstance:greeter.Greeter;

        constructor() {
            this.greeterInstance = new greeter.Greeter('Inner-htmled greeting', '.output-area');
            this.greeterInstance.greet();
        }
    }
    ;
}
;
