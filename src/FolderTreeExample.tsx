import { useTreeContext } from './TreeContext';

let currentID = 4;

export default function FolderTreeExample() {
  const { treeData: tree } = useTreeContext();

  // Example: Update a folder's name and keep its children
  const renameFolder = (id: string, newName: string) => {
    const item = tree.getItem(id);
    if (!item) return;

    const currentChildrenData = item.children ? item.children.map((node) => node.value) : [];

    tree.update(id, { ...item.value, name: newName, children: currentChildrenData }); // keep children intact!
  };

  const addItem = () => {
    const items = Array.from(tree.items.values());

    const newId = `FOLDER_${(currentID++).toString()}`;

    console.log('Adding new folder with id:', newId);
    console.log('KEY:', items[0]?.key || null);

    tree.append(items[0]?.key ?? null, { id: newId, name: `New Folder ${newId}` });
  };

  return (
    <div>
      <h3>Folder Tree</h3>

      <button onClick={addItem}>Add item</button>

      <ul>
        {Array.from(tree.items.values()).map((item) => (
          <li key={item.key}>
            <span>{item.value.name}</span>{' '}
            <button onClick={() => renameFolder(item.key as string, item.value.name + ' ✨')}>
              Rename
            </button>
            {item.children && (
              <ul>
                {item.children.map((child) => (
                  <li key={child.key}>
                    {child.value.name}

                    <button
                      onClick={() => renameFolder(child.key as string, child.value.name + ' ❤️')}
                    >
                      Rename
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
