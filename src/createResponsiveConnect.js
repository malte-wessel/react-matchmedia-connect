import capitalize from './utils/capitalize';
import createMatchMediaConnect from './createMatchMediaConnect';

const defaultBreakpoints = {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200
};

export default function createResponsiveConnect(breakpoints = defaultBreakpoints) {
    const breakpointsList = [];
    const queryMap = {
        isLandscape: '(orientation: landscape)',
        isPortrait: '(orientation: portrait)'
    };

    for (const key in breakpoints) {
        if (!breakpoints.hasOwnProperty(key)) continue;
        const value = breakpoints[key];
        breakpointsList.push({ key, value });
    }

    // Make sure breakpoints are ordered by value ASC
    breakpointsList.sort(({ value: a }, { value: b }) => a - b);

    breakpointsList.forEach((breakpoint, idx) => {
        const { key } = breakpoint;
        const capitalizedKey = capitalize(key);
        // Skip min-width query for first element
        if (idx > 0) {
            const { value: width } = breakpoint;
            const minWidthKey = `isMin${capitalizedKey}`;
            queryMap[minWidthKey] = `(min-width: ${width}px)`;
        }
        const nextBreakpoint = breakpointsList[idx + 1];
        // Skip max-width query for last element
        if (nextBreakpoint) {
            const { value: nextWidth } = nextBreakpoint;
            const maxWidthKey = `isMax${capitalizedKey}`;
            queryMap[maxWidthKey] = `(max-width: ${nextWidth - 1}px)`;
        }
    });

    return createMatchMediaConnect(queryMap);
}
