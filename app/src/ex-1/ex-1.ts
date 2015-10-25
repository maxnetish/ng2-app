/// <reference path='greeter.ts'/>

module ex1 {
    export class greetExample {
        private greeterInstance:greeter.Greeter;

        constructor() {
            this.greeterInstance = new greeter.Greeter('bla bla', '.output-area');
        }

        public ShowGreet() {
            console.log(greeter.MyColor.Blue);
            console.log('ShowGreet context: ', this);
            this.greeterInstance.greet();
        }
    }
    ;
}
;
