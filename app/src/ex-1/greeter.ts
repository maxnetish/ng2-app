module greeter {
    export class Greeter {
        constructor(public greeting:string, public whereGreet:string) {
        }

        greet() {
            var targetNode:Node = document.querySelector(this.whereGreet);
            targetNode.textContent = this.greeting;
        }
    }
    ;
}
;

