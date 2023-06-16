declare module '@hiver/hiver-react-component-library';

declare module '*.svg' {
    import { SVGProps } from 'react';
    declare const ReactComponent: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    export { ReactComponent };
    declare const image: string;
    export default image;
}
