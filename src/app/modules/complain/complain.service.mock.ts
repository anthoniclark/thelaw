export class ComplainServiceMock {
    private fakeSubscribe(returnValue, errorValue) {
        return {
            subscribe: function (callback, error) {
                callback(returnValue);
                error(errorValue);
            }
        };
    }

    public getComplains() {
        var fakeData = [];
        return this.fakeSubscribe(fakeData, 0);
    }

}
