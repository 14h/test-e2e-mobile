describe('a spec with pending', function() {
    
    it('should be pending', function() {
        pending('This is pending.');
    });

    xit('should be also pending', function() {
        expect(true).toBe(true);
    });
});
