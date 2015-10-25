/// <reference path='ex-1/ex-1.ts'/>

(function () {
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap)
    } else {
        bootstrap();
    }

    function bootstrap() {
        console.log('bootstrap app here');
        var ex1Instance = new ex1.greetExample();

        var pressMeButton = document.querySelector('#press-me-button');
        pressMeButton.addEventListener('click', ex1Instance.ShowGreet.bind(ex1Instance));
        pressMeButton.addEventListener('click', (e)=> {
            console.log('Lambda: ', e);
            console.log('Context: ', this);
        });
    }
})();
