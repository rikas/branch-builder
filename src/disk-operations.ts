import { mkdir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { open, save } from '@tauri-apps/plugin-dialog';
import { ToastQueue } from '@react-spectrum/toast';

export async function openFile(): Promise<Folder[]> {
  const path = await open({
    directory: false,
    multiple: false,
    title: 'Open configuration file',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });

  if (!path) {
    return [];
  }

  const fileName = path.split('/').pop();

  const content = await readTextFile(path);

  ToastQueue.positive(`File '${fileName}' opened`, { timeout: 2000 });

  return JSON.parse(content);
}

export async function openFolder(): Promise<string> {
  const path = await open({
    directory: true,
    multiple: false,
    title: 'Open folder',
    recursive: true,
  });

  if (!path) {
    return '';
  }

  return path;
}

export async function createFolders(parent: string, folders: Folder[]) {
  const paths: string[] = [];

  // Maps the folders array to an array of paths, based on the tree names
  const traverse = (folder: Folder, path?: string) => {
    const currentPath = path ? `${path}/${folder.name}` : folder.name;

    paths.push(currentPath);
    folder.children.forEach((child) => traverse(child, currentPath));
  };

  // Adds all the folders to the paths array
  folders.forEach((folder) => traverse(folder, ''));

  // Creates the folders
  for (const path of paths) {
    await mkdir(`${parent}/${path}`, { recursive: true });
  }

  ToastQueue.positive('Folders created', { timeout: 2000 });
}

export async function saveFile(data: Folder[]) {
  const path = await save({
    title: 'Save configuration file',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });

  if (!path) {
    return;
  }

  await writeTextFile(path, JSON.stringify(data, null, 2));
  const fileName = path.split('/').pop();

  ToastQueue.positive(`File '${fileName}' saved`, { timeout: 2000 });
}
