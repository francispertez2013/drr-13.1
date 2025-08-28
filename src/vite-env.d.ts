/// <reference types="vite/client" />

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}