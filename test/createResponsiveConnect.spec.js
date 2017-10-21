/* eslint-disable no-underscore-dangle */
import createMatchMediaConnect from '../src/createMatchMediaConnect';
import createResponsiveConnect, {
    __RewireAPI__ as RewireAPI
} from '../src/createResponsiveConnect';

describe('createResponsiveConnect', () => {
    describe('when creating', () => {
        it('should use default breakpoint', (done) => {
            const spy = sinon.spy(createMatchMediaConnect);
            RewireAPI.__Rewire__('createMatchMediaConnect', spy);
            createResponsiveConnect();
            expect(spy.callCount).toEqual(1);
            expect(spy.firstCall.args[0]).toEqual({
                isLandscape: '(orientation: landscape)',
                isPortrait: '(orientation: portrait)',
                isMaxXs: '(max-width: 767px)',
                isMinSm: '(min-width: 768px)',
                isMaxSm: '(max-width: 991px)',
                isMinMd: '(min-width: 992px)',
                isMaxMd: '(max-width: 1199px)',
                isMinLg: '(min-width: 1200px)'
            });
            spy.reset();
            RewireAPI.__ResetDependency__('createMatchMediaConnect');
            done();
        });
    });
    describe('when using custom breakpoints', () => {
        it('should create custom media queries', (done) => {
            const spy = sinon.spy(createMatchMediaConnect);
            RewireAPI.__Rewire__('createMatchMediaConnect', spy);
            createResponsiveConnect({
                small: 100,
                medium: 200,
                large: 300
            });
            expect(spy.callCount).toEqual(1);
            expect(spy.firstCall.args[0]).toEqual({
                isLandscape: '(orientation: landscape)',
                isPortrait: '(orientation: portrait)',
                isMaxSmall: '(max-width: 199px)',
                isMinMedium: '(min-width: 200px)',
                isMaxMedium: '(max-width: 299px)',
                isMinLarge: '(min-width: 300px)'
            });
            spy.reset();
            RewireAPI.__ResetDependency__('createMatchMediaConnect');
            done();
        });
    });
});
