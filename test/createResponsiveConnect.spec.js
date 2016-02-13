import { createResponsiveConnect } from 'react-matchmedia-connect';
const createMatchMediaConnect = require('../src/createMatchMediaConnect');

describe('createResponsiveConnect', () => {
    describe('when creating', () => {
        it('should use default breakpoint', done => {
            const spy = spyOn(createMatchMediaConnect, 'default');
            createResponsiveConnect();
            expect(spy.calls.length).toEqual(1);
            expect(spy.calls[0].arguments[0]).toEqual({
                isLandscape: '(orientation: landscape)',
                isPortrait: '(orientation: portrait)',
                isMaxXs: '(max-width: 767px)',
                isMinSm: '(min-width: 768px)',
                isMaxSm: '(max-width: 991px)',
                isMinMd: '(min-width: 992px)',
                isMaxMd: '(max-width: 1199px)',
                isMinLg: '(min-width: 1200px)'
            });
            spy.restore();
            done();
        });
    });
    describe('when using custom breakpoints', () => {
        it('should create custom media queries', done => {
            const spy = spyOn(createMatchMediaConnect, 'default');
            createResponsiveConnect({
                small: 100,
                medium: 200,
                large: 300
            });
            expect(spy.calls.length).toEqual(1);
            expect(spy.calls[0].arguments[0]).toEqual({
                isLandscape: '(orientation: landscape)',
                isPortrait: '(orientation: portrait)',
                isMaxSmall: '(max-width: 199px)',
                isMinMedium: '(min-width: 200px)',
                isMaxMedium: '(max-width: 299px)',
                isMinLarge: '(min-width: 300px)'
            });
            spy.restore();
            done();
        });
    });
});
