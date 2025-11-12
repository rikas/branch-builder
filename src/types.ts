declare const __APP_VERSION__: string;

interface Folder {
  name: string;
  id: string;
  children?: Folder[];
}
