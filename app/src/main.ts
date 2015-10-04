/// <reference path='ex-1/ex-1.ts'/>

(function () {
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap)
    } else {
        bootstrap();
    }

    function bootstrap() {
        console.log('bootstrap app here');
        new ex1.greetExample();
    }
})();
