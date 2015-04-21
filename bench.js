(function() {
    this.Bench = function(iterations) {
        this.score = this.test(iterations|50000);
    }

    this.Bench.prototype.test = function(count) {
        var start = new Date();

        while(count > 0) {
            count--;
            var a = new Array();
            a.push(document.getElementsByTagName('body > form:first-child') + Math.random());
            a[0].replace('[a-z]',function() {
                return Math.random();
            });

            delete a;
        }

        var end = new Date();

        return end.getTime() - start.getTime();
    }


}).apply(window);
