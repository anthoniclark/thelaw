export class CaseServiceMock {
    private fakeSubscribe(returnValue, errorValue) {
        return {
            subscribe: function (callback, error) {
                callback(returnValue);
                error(errorValue);
            }
        }
    }

    public getCases() {
        var fakeData = [];
        return this.fakeSubscribe(fakeData, 0);
    }

}