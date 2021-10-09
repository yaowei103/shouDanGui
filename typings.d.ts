declare module '*.css';
// declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.less';

declare interface Window {
  DDLogin: any;
  attachEvent: any;
  removeEventListener: any;
  detachEvent: any;
  BOCardReader: any;
}
