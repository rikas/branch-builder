import { mkdir, readFile, writeFile } from '@tauri-apps/plugin-fs';
import { open, save } from '@tauri-apps/plugin-dialog';
import { ToastQueue } from '@react-spectrum/toast';
import { TreeData } from '@react-stately/data';
import { buildSimpleTree, getRootChildren } from './utils';

export async function loadFile(): Promise<Folder[]> {
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

  try {
    const bytes = await readFile(path);

    if (!bytes || bytes.length === 0) {
      throw new Error('File is empty');
    }

    const contentFromBytes = new TextDecoder('utf-8').decode(new Uint8Array(bytes));

    console.log('File content:', contentFromBytes);
    console.log('Bytes length:', bytes.length);
    console.log('First 50 bytes:', bytes.slice(0, 50));

    const parsedContent = JSON.parse(contentFromBytes) as Folder[];

    ToastQueue.positive(`File '${fileName}' loaded`, { timeout: 2000 });

    return parsedContent;
  } catch (error) {
    ToastQueue.negative(`Failed to load file '${fileName}'. ${error}`, { timeout: 2000 });
    return [] as Folder[];
  }
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
    (folder.children ?? []).forEach((child) => traverse(child, currentPath));
  };

  // Adds all the folders to the paths array
  folders.forEach((folder) => traverse(folder, ''));

  // Creates the folders
  for (const path of paths) {
    await mkdir(`${parent}/${path}`, { recursive: true });
  }

  ToastQueue.positive('Folders created', { timeout: 2000 });
}

// Saves the tree structure to a JSON file
export async function saveFile(tree: TreeData<Folder>) {
  const path = await save({
    title: 'Save configuration file',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });

  if (!path) {
    return;
  }

  const rootChildren = getRootChildren(tree);
  const simpleTree = buildSimpleTree(rootChildren);
  const content = JSON.stringify(simpleTree, null, 2);
  const contentBytes = new TextEncoder().encode(content);

  await writeFile(path, contentBytes);
  // await writeTextFile(path, JSON.stringify(data, null, 2));
  const fileName = path.split('/').pop();

  ToastQueue.positive(`File '${fileName}' saved`, { timeout: 2000 });
}
