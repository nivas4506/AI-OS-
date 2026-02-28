// ============================================
// Virtual File System
// ============================================

class FileSystem {
    constructor() {
        this.root = {
            name: 'root',
            type: 'folder',
            children: {
                'Desktop': {
                    name: 'Desktop', type: 'folder',
                    children: {
                        'Welcome.txt': { name: 'Welcome.txt', type: 'file', content: 'Welcome to AI OS!\n\nThis is your intelligent desktop environment.\nExplore the apps and features!' },
                        'Notes.txt': { name: 'Notes.txt', type: 'file', content: 'My Notes\n--------\n- Try the AI Assistant\n- Explore File Explorer\n- Check Settings' },
                    }
                },
                'Documents': {
                    name: 'Documents', type: 'folder',
                    children: {
                        'Projects': {
                            name: 'Projects', type: 'folder', children: {
                                'project-plan.txt': { name: 'project-plan.txt', type: 'file', content: 'AI OS Project Plan\n\n1. Core desktop environment\n2. Window management\n3. AI Integration\n4. App ecosystem' },
                            }
                        },
                        'Resume.txt': { name: 'Resume.txt', type: 'file', content: 'John Doe\nSoftware Engineer\n\nSkills: AI, Web Development, Cloud Computing' },
                        'Ideas.txt': { name: 'Ideas.txt', type: 'file', content: 'Future Ideas:\n- Voice commands\n- Plugin system\n- Cloud sync\n- Mobile support' },
                    }
                },
                'Downloads': {
                    name: 'Downloads', type: 'folder',
                    children: {
                        'report.txt': { name: 'report.txt', type: 'file', content: 'Quarterly Report Q4 2025\n\nRevenue: $1.2M\nGrowth: 25%\nUsers: 50,000+' },
                    }
                },
                'Pictures': {
                    name: 'Pictures', type: 'folder',
                    children: {
                        'Screenshots': { name: 'Screenshots', type: 'folder', children: {} },
                        'Wallpapers': { name: 'Wallpapers', type: 'folder', children: {} },
                    }
                },
                'Music': { name: 'Music', type: 'folder', children: {} },
                'Videos': { name: 'Videos', type: 'folder', children: {} },
            }
        };
    }

    resolve(pathStr) {
        if (pathStr === '/' || pathStr === '') return this.root;
        const parts = pathStr.replace(/^\//, '').split('/');
        let current = this.root;
        for (const part of parts) {
            if (!current.children || !current.children[part]) return null;
            current = current.children[part];
        }
        return current;
    }

    listDir(pathStr) {
        const node = this.resolve(pathStr);
        if (!node || node.type !== 'folder') return [];
        return Object.values(node.children).map(item => ({
            name: item.name,
            type: item.type,
            size: item.content ? item.content.length : 0,
            children: item.children ? Object.keys(item.children).length : 0,
        }));
    }

    readFile(pathStr) {
        const node = this.resolve(pathStr);
        if (!node || node.type !== 'file') return null;
        return node.content || '';
    }

    writeFile(pathStr, content) {
        const parts = pathStr.replace(/^\//, '').split('/');
        const fileName = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.resolve(parentPath);
        if (!parent || parent.type !== 'folder') return false;
        if (parent.children[fileName]) {
            parent.children[fileName].content = content;
        } else {
            parent.children[fileName] = { name: fileName, type: 'file', content };
        }
        return true;
    }

    createFolder(pathStr) {
        const parts = pathStr.replace(/^\//, '').split('/');
        const folderName = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.resolve(parentPath);
        if (!parent || parent.type !== 'folder') return false;
        if (parent.children[folderName]) return false;
        parent.children[folderName] = { name: folderName, type: 'folder', children: {} };
        return true;
    }

    deleteItem(pathStr) {
        const parts = pathStr.replace(/^\//, '').split('/');
        const itemName = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.resolve(parentPath);
        if (!parent || !parent.children[itemName]) return false;
        delete parent.children[itemName];
        return true;
    }

    rename(pathStr, newName) {
        const parts = pathStr.replace(/^\//, '').split('/');
        const oldName = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.resolve(parentPath);
        if (!parent || !parent.children[oldName]) return false;
        const item = parent.children[oldName];
        item.name = newName;
        parent.children[newName] = item;
        delete parent.children[oldName];
        return true;
    }
}

export const fileSystem = new FileSystem();
