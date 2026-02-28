// ============================================
// App: Terminal
// ============================================
import { fileSystem } from '../core/filesystem.js';

export function createTerminal(container) {
    let cwd = '/';

    container.innerHTML = `
    <div class="app-terminal">
      <div class="terminal-output" id="term-output"></div>
      <div class="terminal-input-line">
        <span class="terminal-prompt" id="term-prompt">ai-os:/ $</span>
        <input type="text" class="terminal-input" id="term-input" autofocus spellcheck="false" autocomplete="off">
      </div>
    </div>
  `;

    const output = container.querySelector('#term-output');
    const input = container.querySelector('#term-input');
    const promptEl = container.querySelector('#term-prompt');

    print('AI OS Terminal v1.0', 'system');
    print('Type "help" for available commands.\n', 'system');

    function updatePrompt() {
        promptEl.textContent = `ai-os:${cwd} $`;
    }

    function print(text, type = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line' + (type ? ' ' + type : '');
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function processCommand(cmd) {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        print(`${promptEl.textContent} ${trimmed}`, '');

        const parts = trimmed.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (command) {
            case 'help':
                print('Available commands:', 'system');
                print('  ls [path]      - List directory contents', 'system');
                print('  cd <path>      - Change directory', 'system');
                print('  pwd            - Print working directory', 'system');
                print('  cat <file>     - Display file contents', 'system');
                print('  mkdir <name>   - Create directory', 'system');
                print('  touch <name>   - Create empty file', 'system');
                print('  rm <name>      - Remove file/folder', 'system');
                print('  echo <text>    - Print text', 'system');
                print('  whoami         - Current user', 'system');
                print('  date           - Current date/time', 'system');
                print('  uname          - System information', 'system');
                print('  neofetch       - System info (fancy)', 'system');
                print('  clear          - Clear terminal', 'system');
                print('  history        - Command history', 'system');
                break;

            case 'ls': {
                const target = resolvePath(args[0] || '.');
                const items = fileSystem.listDir(target);
                if (items.length === 0) print('(empty directory)');
                else items.forEach(item => {
                    const icon = item.type === 'folder' ? '📁' : '📄';
                    print(`${icon} ${item.name}`);
                });
                break;
            }

            case 'cd':
                if (!args[0] || args[0] === '~' || args[0] === '/') { cwd = '/'; }
                else if (args[0] === '..') {
                    const parts = cwd.split('/').filter(Boolean);
                    parts.pop();
                    cwd = '/' + parts.join('/');
                    if (cwd === '/') cwd = '/';
                } else {
                    const newPath = resolvePath(args[0]);
                    const node = fileSystem.resolve(newPath);
                    if (node && node.type === 'folder') cwd = newPath;
                    else print(`cd: no such directory: ${args[0]}`, 'error');
                }
                updatePrompt();
                break;

            case 'pwd':
                print(cwd || '/');
                break;

            case 'cat': {
                if (!args[0]) { print('cat: missing operand', 'error'); break; }
                const content = fileSystem.readFile(resolvePath(args[0]));
                if (content !== null) print(content);
                else print(`cat: ${args[0]}: No such file`, 'error');
                break;
            }

            case 'mkdir':
                if (!args[0]) { print('mkdir: missing operand', 'error'); break; }
                if (fileSystem.createFolder(resolvePath(args[0]))) print(`Created directory: ${args[0]}`, 'success');
                else print(`mkdir: cannot create directory '${args[0]}'`, 'error');
                break;

            case 'touch':
                if (!args[0]) { print('touch: missing operand', 'error'); break; }
                if (fileSystem.writeFile(resolvePath(args[0]), '')) print(`Created file: ${args[0]}`, 'success');
                else print(`touch: cannot create file '${args[0]}'`, 'error');
                break;

            case 'rm':
                if (!args[0]) { print('rm: missing operand', 'error'); break; }
                if (fileSystem.deleteItem(resolvePath(args[0]))) print(`Removed: ${args[0]}`, 'success');
                else print(`rm: cannot remove '${args[0]}'`, 'error');
                break;

            case 'echo':
                print(args.join(' '));
                break;

            case 'whoami':
                print('user@ai-os');
                break;

            case 'date':
                print(new Date().toString());
                break;

            case 'uname':
                print('AI OS 1.0.0 x86_64 WebAssembly');
                break;

            case 'neofetch':
                print('', 'system');
                print('       ╭──────────╮       user@ai-os', 'system');
                print('       │  AI  OS  │       ──────────', 'system');
                print('       │  ◉    ◉  │       OS: AI OS 1.0.0', 'system');
                print('       │    ──    │       Kernel: Web 5.0', 'system');
                print('       │  ╰────╯  │       Shell: ai-terminal', 'system');
                print('       ╰──────────╯       Resolution: ' + window.innerWidth + 'x' + window.innerHeight, 'system');
                print('                          Theme: Dark Mode', 'system');
                print('                          CPU: Neural Engine v2', 'system');
                print('                          Memory: ∞ MB', 'system');
                print('', 'system');
                break;

            case 'clear':
                output.innerHTML = '';
                break;

            case 'history':
                cmdHistory.forEach((cmd, i) => print(`  ${i + 1}  ${cmd}`));
                break;

            default:
                print(`${command}: command not found. Type "help" for available commands.`, 'error');
        }
    }

    function resolvePath(p) {
        if (!p || p === '.') return cwd;
        if (p.startsWith('/')) return p;
        return (cwd === '/' ? '' : cwd) + '/' + p;
    }

    const cmdHistory = [];
    let historyIdx = -1;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value;
            if (cmd.trim()) { cmdHistory.push(cmd); historyIdx = cmdHistory.length; }
            processCommand(cmd);
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIdx > 0) { historyIdx--; input.value = cmdHistory[historyIdx]; }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx < cmdHistory.length - 1) { historyIdx++; input.value = cmdHistory[historyIdx]; }
            else { historyIdx = cmdHistory.length; input.value = ''; }
        }
    });

    container.addEventListener('click', () => input.focus());
    setTimeout(() => input.focus(), 100);
}
